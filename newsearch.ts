/** soywiz 2021 */

class AsyncStorage {

}

interface Map<K, V> {
	map<R>(gen: (key: K, value: V) => R): R[]
}
Map.prototype.map = (function (gen: (key: any, value: any) => any): any[] {
	const out = []
	for (const [key, value] of this.entries()) {
		out.push(gen(key, value))
	}
	return out
})


interface Array<T> {
	any(func: (value: T) => boolean): boolean
	all(func: (value: T) => boolean): boolean
	filterUpTo(count: number, func: (value: T) => boolean): T[]
	groupBy<R>(gen: (value: T) => R): Map<R, T[]>
	sortBy<R>(gen: (value: T) => R): void
	sorted(): T[]
	sortedBy<R>(gen: (value: T) => R): T[]
	unique(): T[]
}

Array.prototype.unique = (function(): any[] {
	const set = new Set();
	const out = []
	for (const it of this) {
		if (set.has(it)) continue
		set.add(it)
		out.push(it)
	}
	return out
})

Array.prototype.sorted = (function(): any[] {
	const array = this.slice()
	array.sort()
	return array
})

Array.prototype.sortedBy = (function (gen: (value: any) => any): any[] {
	const array = this.slice()
	array.sortBy(gen)
	return array
})

Array.prototype.sortBy = (function (gen: (value: any) => any): void {
	this.sort((a: any, b: any) => {
		const aa = gen(a)
		const bb = gen(b)
		if (aa < bb) return -1
		if (aa > bb) return +1
		return 0
	})
})
Array.prototype.any = (function (func: (value: any) => boolean): boolean {
	for (const item of this) if (func(item)) return true
	return false
})
Array.prototype.all = (function (func: (value: any) => boolean): boolean {
	for (const item of this) if (!func(item)) return false
	return true
})
Array.prototype.filterUpTo = (function (maxItems: number, func: (value: any) => boolean): any[] {
	const out = [];
	for (const item of this) {
		if (func(item)) {
			out.push(item)
			if (out.length >= maxItems) break;
		}
	}
	return out
})
Array.prototype.groupBy = (function (gen: (value: any) => any): Map<any, any> {
	const out = new Map<any, any[]>();
	for (const item of this) {
		const key = gen(item)
		if (!out.has(key)) out.set(key, [])
		out.get(key)!.push(item)
	}
	return out
})

const replacements = new Map<string, string>()
replacements.set("an", "a")

class TextProcessor {
	static tokenize(text: string): string[] {
		const out = []
		for (const it of text.toLowerCase().split(/\W+/g)) {
			const res = it.trim().replace(/c/g, 'k').replace(/l+/g, 'l').replace(/s+$/g, '')
			const res2 = replacements.get(res) || res
			if (res2.length > 0) {
				out.push(res2)
			}
		}
		return out
	}
}

class TokenizedText {
	public length: number
	constructor(public text: string, public words: string[] = TextProcessor.tokenize(text).unique()) {
		this.length = words.length
	}
}

class QueryResult {
	// @TODO: Compute score
	public paragraph: DocParagraphResult|null
	public score: number

	constructor(public text: string, public words: string[], public section: DocSection) {
		this.paragraph = section.matches(words) ?? section.matchesAnyOrder(words) ?? section.matchesAny(words)
		this.score = 0
		const sectionFullTitle = section.titles.join(" ").toLowerCase()
		for (const word of words) {
			if (sectionFullTitle.indexOf(word) >= 0) {
				this.score += 10
			}
			if (section.words.has(word)) {
				this.score += Number(section.words.get(word))
			}
		}
	}

	get doc() {
		return this.section.doc
	}
}

class DocQueryResult {
	score: number = 0

	constructor(public doc: Doc, public results: QueryResult[]) {
		results.sortBy(it => -it.score)
		this.score = 0
		for (const result of results) this.score += result.score
	}
}

class WordWithVariants {
	constructor(public words: string[]) {
	}
}

class DocIndex {
	allWords = new Set<string>();
	wordsToSection = new Map<string, Set<DocSection>>()
	//wordsToDoc = new Map<string, Set<Doc>>()

	addWords(section: DocSection, text: TokenizedText) {
		const words = new Set(text.words)
		for (const word of words) {
			if (word.length == 0) continue
			if (!this.wordsToSection.has(word)) this.wordsToSection.set(word, new Set())
			//if (!this.wordsToDoc.has(word)) this.wordsToDoc.set(word, new Set())
			this.wordsToSection.get(word)!.add(section)
			//this.wordsToDoc.get(word)!.add(section.doc)
			this.allWords.add(word)
		}
	}

	findWords(word: string): WordWithVariants {
		let lcWord = word.toLowerCase();
		//if (this.wordsToSection.has(lcWord)) {
		//	return [lcWord]
		//}
		const out: [string, number][] = []
		for (const key of this.allWords.keys()) {
			if (key.indexOf(lcWord) >= 0) {
				const score = Math.abs(word.length - key.length)
				out.push([key, score])
			}
		}
		//console.warn(out)
		out.sortBy(it => {
			return it[1]
		})
		return new WordWithVariants(out.map(it => it[0]).slice(0, 5))
	}

	getRepetition(word: string): number {
		if (!this.wordsToSection.has(word)) return 0
		return this.wordsToSection.get(word)!.size
	}

	getTotalDocuments(words: WordWithVariants): number {
		let sum = 0
		for (const word of words.words) {
			if (this.wordsToSection.has(word)) {
				sum += this.wordsToSection.get(word)!.size
			}
		}
		return sum
	}

	query(text: string, maxResults: number = 7, debug: boolean = false): DocQueryResult[] {
		const tokenizedText = new TokenizedText(text).words
		let allWordsSep = tokenizedText.map(it => this.findWords(it));
		// Find the less frequent word
		//allWords.sortBy(it => this.getRepetition(it))

		if (debug) console.info(JSON.stringify(allWordsSep), tokenizedText)

		if (allWordsSep.length == 0) return []

		let intersectionSections = new Set<DocSection>()

		let exploredSections = new Set<DocSection>()

		const allWordsSepSorted = allWordsSep.sortedBy(it => this.getTotalDocuments(it))

		for (const searchWord of allWordsSepSorted[0].words) {
			const sectionsToSearch = [...(this.wordsToSection.get(searchWord) || [])]
			const toExploreSections = []

			for (const section of sectionsToSearch) {
				if (exploredSections.has(section)) continue
				exploredSections.add(section)
				toExploreSections.push(section)
			}

			const intersectionSectionsPart = [...toExploreSections]
				.filterUpTo(maxResults, (section) => {
					return tokenizedText
						.all((token) => {
							let words = this.findWords(token).words;
							const res = words.any((word) => section.hasWord(word))
							//console.log("words", words, "res", res, section, "match", section.matches(tokenizedText))
							if (!res) return false
							//return section.matches(tokenizedText) != null
							return true
						})
				})
			for (const part of intersectionSectionsPart) {
				intersectionSections.add(part)
			}
			if (intersectionSections.size >= maxResults) {
				break
			}
		}


		//console.log(intersectionSections)
		return [...intersectionSections]
			.slice(0, maxResults)
			.map(it => new QueryResult(text, tokenizedText, it))
			.groupBy(it => it.doc)
			.map((key, value) => new DocQueryResult(key, value))
			.sortedBy(it => -it.score)
	}
}

class DocParagraphResult {
	public words: string[]

	constructor(public paragraph: DocParagraph, public index: number, public count: number) {
		this.words = paragraph.words.slice(index, index + count)
	}
}

class DocParagraph {
	constructor(public texts: TokenizedText) {
	}

	get text() { return this.texts.text }
	get words() { return this.texts.words }

	matchesWord(word: string, origin: string): boolean {
		return origin.toLowerCase().indexOf(word.toLowerCase()) >= 0
	}

	matches(words: string[]): DocParagraphResult|null {
		//console.log("DocParagraph.matches", words, this.words)
		if (words.length == 0) return null
		for (let n = 0; n < this.words.length - words.length + 1; n++) {
			let matches = true
			for (let m = 0; m < words.length; m++) {
				if (!this.matchesWord(words[m], this.words[n + m])) {
					//console.log("Not matching", words[m], this.words[n + m])
					matches = false
					break;
				}
			}
			if (matches) return new DocParagraphResult(this, n, words.length)
		}
		return null
	}

	matchesAnyOrder(words: string[]): DocParagraphResult|null {
		for (const word of words) {
			if (!this.words.any(it => this.matchesWord(word, it))) return null
		}
		return new DocParagraphResult(this, 0, this.words.length)
	}
	matchesAny(words: string[]): DocParagraphResult|null {
		for (const word of words) {
			if (this.words.any(it => this.matchesWord(word, it))) return new DocParagraphResult(this, 0, this.words.length)
		}
		return null
	}
}

class DocSection {
	words = new Map<string, number>()
	paragraphs: DocParagraph[] = [];
	titles: string[] = []

	constructor(public doc: Doc, public id: string, public title: string, public parentSection: DocSection|null) {
		if (parentSection) {
			this.titles = [...parentSection.titles, title]
		} else {
			this.titles = (title.length) ? [title] : []
		}
	}

	hasWord(word: string): boolean {
		if (this.words.has(word)) return true
		for (const w of this.words.keys()) {
			if (w.indexOf(word) >= 0) return true
		}
		return false
	}

	addText(text: TokenizedText) {
		if (text.length == 0) return
		this.paragraphs.push(new DocParagraph(text))
		this.doc.index.addWords(this, text);
		for (const word of text.words) {
			if (!this.words.has(word)) this.words.set(word, 0)
			this.words.set(word, this.words.get(word)! + 1)
		}
	}

	addRawText(text: string) {
		this.addText(new TokenizedText(text))
	}

	matches(words: string[]): DocParagraphResult|null {
		for (const p of this.paragraphs) {
			const result = p.matches(words)
			if (result) return result
		}
		return null
	}

	matchesAnyOrder(words: string[]): DocParagraphResult|null {
		for (const p of this.paragraphs) {
			const result = p.matchesAnyOrder(words)
			if (result) return result
		}
		return null
	}

	matchesAny(words: string[]): DocParagraphResult|null {
		if (this.paragraphs.length == 0) return null
		for (let n = 1; n < this.paragraphs.length; n++) {
			const p = this.paragraphs[n]
			const result = p.matchesAny(words)
			if (result) return result
		}
		return this.paragraphs[0].matchesAny(words)
	}
}

class Doc {
	public title: string = ''
	public sections: DocSection[] = []
	constructor(public index: DocIndex, public url: string) {
	}

	createSection(id: string, title: string, parentSection: DocSection|null): DocSection {
		let docSection = new DocSection(this, id, title, parentSection);
		this.sections.push(docSection);
		return docSection;
	}
}

class DocIndexer {
	doc: Doc
	hSections: DocSection[]
	section: DocSection

	constructor(index: DocIndex, url: string) {
		this.doc = new Doc(index, url);
		this.section = this.doc.createSection("", "", null)
		this.hSections = []
	}

	getHNum(tagName: string): number {
		switch (tagName) {
			case "h1": return 1
			case "h2": return 2
			case "h3": return 3
			case "h4": return 4
			case "h5": return 5
			case "h6": return 6
			case "h7": return 7
			default: return -1
		}
	}

	index(element: Element) {
		const id = element.getAttribute("id")
		const children = element.children;
		const tagName = element.tagName.toLowerCase();
		if (id != null) {
			const headerNum = this.getHNum(tagName)
			const textContent = element.textContent || ""
			this.section = this.doc.createSection(id, textContent, this.hSections[headerNum - 1])
			this.section.addRawText(this.doc.title)
			for (const title of this.section.titles) {
				this.section.addRawText(title)
			}
			this.section.addRawText(textContent)
			if (headerNum >= 0) {
				this.hSections[headerNum] = this.section
			}
		}
		if (tagName == 'title') {
			this.doc.title = element.textContent || ""
		}
		if (tagName == 'pre') {
			for (const line of (element.textContent || "").split(/\n/g)) {
				this.section.addRawText(line);
			}

			//if (false) {
			// Skip
		} else if (children.length == 0 || tagName == 'p' || tagName == 'code') {
			this.section.addRawText(element.textContent || "");
		} else {
			for (let n = 0; n < children.length; n++) {
				const child = children[n];
				this.index(child)
				//console.log(child);
			}
		}
	}
}

async function fetchParts() {
	const time0 = Date.now()
	let response = await fetch("/all.html");
	let text = await response.text()
	const time1 = Date.now()
	console.log("Fetched all.html in", time1 - time0)
	return text.split("!!!$PAGE$!!!")
}

function createIndexFromParts(parts: string[]) {
	const time0 = Date.now()
	//console.log(parts.length);
	const parser = new DOMParser();
	const index = new DocIndex();
	for (const part of parts) {
		const breakPos = part.indexOf("\n")
		if (breakPos < 0) continue

		const url = part.substr(0, breakPos)
		const content = part.substr(breakPos + 1)

		const xmlDoc = parser.parseFromString(content, "text/html");
		const indexer = new DocIndexer(index, url);
		indexer.index(xmlDoc.documentElement)
	}
	const time1 = Date.now()
	console.log("Created index in", time1 - time0)
	return index
}

async function getIndex(): Promise<DocIndex> {
	const parts = await fetchParts()
	//setInterval(() => { createIndexFromParts(parts) }, 500)
	return createIndexFromParts(parts)
}

async function getIndexOnce(): Promise<DocIndex> {
	(window as any).searchIndexPromise ||= getIndex();
	(window as any).searchIndex = await (window as any).searchIndexPromise;
	return (window as any).searchIndex;
}

async function newSearchMain() {
	const index = await getIndexOnce();
	console.log("ready")

	const searchBox: HTMLInputElement|undefined = document.querySelector("input#searchbox") as any;
	if (searchBox) {
		let lastText = ''
		searchBox.addEventListener("keyup", (e) => {
			const currentText = searchBox.value
			if (lastText != currentText) {
				lastText = currentText
				console.clear()
				const time0 = Date.now()
				const results = index.query(currentText, 7, true)
				const time1 = Date.now()
				console.info("Results in", time1 - time0)
				for (const result of results) {
					console.log("###", result.doc.url, result.doc.title, result.score)
					for (const res of result.results) {
						console.log("->", `SCORE:`, res.score, res.section.titles, res.paragraph?.paragraph?.text)
					}
				}
				//console.log(searchBox.value)
			}
		})
	}
}
