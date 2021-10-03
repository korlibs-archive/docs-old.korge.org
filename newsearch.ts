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
}

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

class TextProcessor {
	static tokenize(text: string): string[] {
		return text.split(/\W+/g).map(it => it.trim()).filter(it => it.length > 0)
	}
}

class QueryResult {
	// @TODO: Compute score
	public paragraph: DocParagraphResult|null
	public score: number

	constructor(public text: string, public words: string[], public section: DocSection) {
		this.paragraph = section.matches(words)
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

class DocIndex {
	allWords = new Set<string>();
	wordsToSection = new Map<string, Set<DocSection>>()
	//wordsToDoc = new Map<string, Set<Doc>>()

	tokenize(text: string): string[] {
		return TextProcessor.tokenize(text.toLowerCase())
	}

	addWords(section: DocSection, text: string) {
		const words = new Set(this.tokenize(text))
		for (const word of words) {
			if (word.length == 0) continue
			if (!this.wordsToSection.has(word)) this.wordsToSection.set(word, new Set())
			//if (!this.wordsToDoc.has(word)) this.wordsToDoc.set(word, new Set())
			this.wordsToSection.get(word)!.add(section)
			//this.wordsToDoc.get(word)!.add(section.doc)
			this.allWords.add(word)
		}
	}

	findWords(word: string): string[] {
		let lcWord = word.toLowerCase();
		if (this.wordsToSection.has(lcWord)) {
			return [lcWord]
		}
		const out: string[] = []
		for (const key of this.allWords.keys()) {
			if (key.indexOf(lcWord) >= 0) {
				out.push(key)
			}
		}
		return out
	}

	getRepetition(word: string): number {
		if (!this.wordsToSection.has(word)) return 0
		return this.wordsToSection.get(word)!.size
	}

	query(text: string, maxResults: number = 7): DocQueryResult[] {
		const tokenizedText = this.tokenize(text)
		let allWords = tokenizedText.flatMap(it => this.findWords(it));
		// Find the less frequent word
		allWords.sortBy(it => this.getRepetition(it))
		if (allWords.length == 0) return []

		const sectionsToSearch = [...(this.wordsToSection.get(allWords[0]) || [])]

		const intersectionSections = sectionsToSearch
			.filterUpTo(maxResults, (section) => {
				return tokenizedText
					.all((token) => {
						let words = this.findWords(token);
						const res = words.any((word) => section.words.has(word))
						//console.log("words", words, "res", res, section, "match", section.matches(tokenizedText))
						if (!res) return false
						//return section.matches(tokenizedText) != null
						return true
					})
			})

		//console.log(intersectionSections)
		return intersectionSections
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
	constructor(public text: string, public words: string[] = TextProcessor.tokenize(text.toLowerCase())) {
	}

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
}

class DocSection {
	words = new Map<string, number>()
	paragraphs: DocParagraph[] = [];
	titles: string[] = []

	constructor(public doc: Doc, public id: string, public title: string, public parentSection: DocSection|null) {
		if (parentSection) {
			this.titles = [...parentSection.titles, title]
		} else {
			this.titles = [title]
		}
	}

	addText(text: string) {
		const words = TextProcessor.tokenize(text.toLowerCase())
		this.paragraphs.push(new DocParagraph(text))
		this.doc.index.addWords(this, text);
		for (const word of words) {
			if (!this.words.has(word)) this.words.set(word, 0)
			this.words.set(word, this.words.get(word)! + 1)
		}
	}

	matches(words: string[]): DocParagraphResult|null {
		for (const p of this.paragraphs) {
			const result = p.matches(words)
			if (result) return result
		}
		return null
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
			this.section.addText(textContent)
			if (headerNum >= 0) {
				this.hSections[headerNum] = this.section
			}
		}
		if (tagName == 'title') {
			this.doc.title = element.textContent || ""
		}
		if (tagName == 'code') {
		//if (false) {
			// Skip
		} else if (children.length == 0 || tagName == 'p' || tagName == 'code') {
			this.section.addText(element.textContent || "");
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
	let response = await fetch("/all.html");
	let text = await response.text()
	return text.split("!!!$PAGE$!!!")
}

async function getIndex() {
	let parts = await fetchParts()
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
	return index
}

async function main() {
	const index = await getIndex();
	(window as any).searchIndex = index
	console.log("ready")

	const searchBox: HTMLInputElement|undefined = document.querySelector("input#searchbox") as any;
	if (searchBox) {
		let lastText = ''
		searchBox.addEventListener("keyup", (e) => {
			const currentText = searchBox.value
			if (lastText != currentText) {
				lastText = currentText
				console.clear()
				const results = index.query(currentText, 7)
				for (const result of results) {
					console.log("###", result.doc.url, result.doc.title, result.score)
					for (const res of result.results) {
						console.log("->", res.section.titles, res.paragraph?.paragraph?.text)
					}
				}
				//console.log(searchBox.value)
			}
		})
	}
}
main()
