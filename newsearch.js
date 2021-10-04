"use strict";
class AsyncStorage {
}
Map.prototype.map = (function (gen) {
    const out = [];
    for (const [key, value] of this.entries()) {
        out.push(gen(key, value));
    }
    return out;
});
Array.prototype.unique = (function () {
    const set = new Set();
    const out = [];
    for (const it of this) {
        if (set.has(it))
            continue;
        set.add(it);
        out.push(it);
    }
    return out;
});
Array.prototype.sorted = (function () {
    const array = this.slice();
    array.sort();
    return array;
});
Array.prototype.sortedBy = (function (gen) {
    const array = this.slice();
    array.sortBy(gen);
    return array;
});
Array.prototype.sortBy = (function (gen) {
    this.sort((a, b) => {
        const aa = gen(a);
        const bb = gen(b);
        if (aa < bb)
            return -1;
        if (aa > bb)
            return +1;
        return 0;
    });
});
Array.prototype.any = (function (func) {
    for (const item of this)
        if (func(item))
            return true;
    return false;
});
Array.prototype.all = (function (func) {
    for (const item of this)
        if (!func(item))
            return false;
    return true;
});
Array.prototype.filterUpTo = (function (maxItems, func) {
    const out = [];
    for (const item of this) {
        if (func(item)) {
            out.push(item);
            if (out.length >= maxItems)
                break;
        }
    }
    return out;
});
Array.prototype.groupBy = (function (gen) {
    const out = new Map();
    for (const item of this) {
        const key = gen(item);
        if (!out.has(key))
            out.set(key, []);
        out.get(key).push(item);
    }
    return out;
});
const replacements = new Map();
replacements.set("an", "a");
class TextProcessor {
    static tokenize(text) {
        return text.split(/\W+/g)
            .map(it => it.trim())
            .map(it => it.replace(/c/g, 'k'))
            .map(it => it.replace(/l+/g, 'l'))
            .map(it => it.replace(/s+$/g, ''))
            .map(it => replacements.get(it) || it)
            .filter(it => it.length > 0);
    }
}
class QueryResult {
    constructor(text, words, section) {
        this.text = text;
        this.words = words;
        this.section = section;
        this.paragraph = section.matches(words) ?? section.matchesAny(words);
        this.score = 0;
        const sectionFullTitle = section.titles.join(" ").toLowerCase();
        for (const word of words) {
            if (sectionFullTitle.indexOf(word) >= 0) {
                this.score += 10;
            }
            if (section.words.has(word)) {
                this.score += Number(section.words.get(word));
            }
        }
    }
    get doc() {
        return this.section.doc;
    }
}
class DocQueryResult {
    constructor(doc, results) {
        this.doc = doc;
        this.results = results;
        this.score = 0;
        results.sortBy(it => -it.score);
        this.score = 0;
        for (const result of results)
            this.score += result.score;
    }
}
class WordWithVariants {
    constructor(words) {
        this.words = words;
    }
}
class DocIndex {
    constructor() {
        this.allWords = new Set();
        this.wordsToSection = new Map();
    }
    tokenize(text) {
        return TextProcessor.tokenize(text.toLowerCase()).unique();
    }
    addWords(section, text) {
        const words = new Set(this.tokenize(text));
        for (const word of words) {
            if (word.length == 0)
                continue;
            if (!this.wordsToSection.has(word))
                this.wordsToSection.set(word, new Set());
            this.wordsToSection.get(word).add(section);
            this.allWords.add(word);
        }
    }
    findWords(word) {
        let lcWord = word.toLowerCase();
        const out = [];
        for (const key of this.allWords.keys()) {
            if (key.indexOf(lcWord) >= 0) {
                const score = Math.abs(word.length - key.length);
                out.push([key, score]);
            }
        }
        out.sortBy(it => {
            return it[1];
        });
        return new WordWithVariants(out.map(it => it[0]).slice(0, 5));
    }
    getRepetition(word) {
        if (!this.wordsToSection.has(word))
            return 0;
        return this.wordsToSection.get(word).size;
    }
    getTotalDocuments(words) {
        let sum = 0;
        for (const word of words.words) {
            if (this.wordsToSection.has(word)) {
                sum += this.wordsToSection.get(word).size;
            }
        }
        return sum;
    }
    query(text, maxResults = 7, debug = false) {
        const tokenizedText = this.tokenize(text);
        let allWordsSep = tokenizedText.map(it => this.findWords(it));
        if (debug)
            console.info(JSON.stringify(allWordsSep), tokenizedText);
        if (allWordsSep.length == 0)
            return [];
        let intersectionSections = new Set();
        let exploredSections = new Set();
        const allWordsSepSorted = allWordsSep.sortedBy(it => this.getTotalDocuments(it));
        for (const searchWord of allWordsSepSorted[0].words) {
            const sectionsToSearch = [...(this.wordsToSection.get(searchWord) || [])];
            const toExploreSections = [];
            for (const section of sectionsToSearch) {
                if (exploredSections.has(section))
                    continue;
                exploredSections.add(section);
                toExploreSections.push(section);
            }
            const intersectionSectionsPart = [...toExploreSections]
                .filterUpTo(maxResults, (section) => {
                return tokenizedText
                    .all((token) => {
                    let words = this.findWords(token).words;
                    const res = words.any((word) => section.hasWord(word));
                    if (!res)
                        return false;
                    return true;
                });
            });
            for (const part of intersectionSectionsPart) {
                intersectionSections.add(part);
            }
            if (intersectionSections.size >= maxResults) {
                break;
            }
        }
        return [...intersectionSections]
            .slice(0, maxResults)
            .map(it => new QueryResult(text, tokenizedText, it))
            .groupBy(it => it.doc)
            .map((key, value) => new DocQueryResult(key, value))
            .sortedBy(it => -it.score);
    }
}
class DocParagraphResult {
    constructor(paragraph, index, count) {
        this.paragraph = paragraph;
        this.index = index;
        this.count = count;
        this.words = paragraph.words.slice(index, index + count);
    }
}
class DocParagraph {
    constructor(text, words = TextProcessor.tokenize(text.toLowerCase())) {
        this.text = text;
        this.words = words;
    }
    matchesWord(word, origin) {
        return origin.toLowerCase().indexOf(word.toLowerCase()) >= 0;
    }
    matches(words) {
        if (words.length == 0)
            return null;
        for (let n = 0; n < this.words.length - words.length + 1; n++) {
            let matches = true;
            for (let m = 0; m < words.length; m++) {
                if (!this.matchesWord(words[m], this.words[n + m])) {
                    matches = false;
                    break;
                }
            }
            if (matches)
                return new DocParagraphResult(this, n, words.length);
        }
        return null;
    }
    matchesAny(words) {
        for (const word of words) {
            if (!this.words.any(it => this.matchesWord(word, it)))
                return null;
        }
        return new DocParagraphResult(this, 0, this.words.length);
    }
}
class DocSection {
    constructor(doc, id, title, parentSection) {
        this.doc = doc;
        this.id = id;
        this.title = title;
        this.parentSection = parentSection;
        this.words = new Map();
        this.paragraphs = [];
        this.titles = [];
        if (parentSection) {
            this.titles = [...parentSection.titles, title];
        }
        else {
            this.titles = (title.length) ? [title] : [];
        }
    }
    hasWord(word) {
        if (this.words.has(word))
            return true;
        for (const w of this.words.keys()) {
            if (w.indexOf(word) >= 0)
                return true;
        }
        return false;
    }
    addText(text) {
        const words = TextProcessor.tokenize(text.toLowerCase());
        this.paragraphs.push(new DocParagraph(text));
        this.doc.index.addWords(this, text);
        for (const word of words) {
            if (!this.words.has(word))
                this.words.set(word, 0);
            this.words.set(word, this.words.get(word) + 1);
        }
    }
    matches(words) {
        for (const p of this.paragraphs) {
            const result = p.matches(words);
            if (result)
                return result;
        }
        return null;
    }
    matchesAny(words) {
        for (const p of this.paragraphs) {
            const result = p.matchesAny(words);
            if (result)
                return result;
        }
        return null;
    }
}
class Doc {
    constructor(index, url) {
        this.index = index;
        this.url = url;
        this.title = '';
        this.sections = [];
    }
    createSection(id, title, parentSection) {
        let docSection = new DocSection(this, id, title, parentSection);
        this.sections.push(docSection);
        return docSection;
    }
}
class DocIndexer {
    constructor(index, url) {
        this.doc = new Doc(index, url);
        this.section = this.doc.createSection("", "", null);
        this.hSections = [];
    }
    getHNum(tagName) {
        switch (tagName) {
            case "h1": return 1;
            case "h2": return 2;
            case "h3": return 3;
            case "h4": return 4;
            case "h5": return 5;
            case "h6": return 6;
            case "h7": return 7;
            default: return -1;
        }
    }
    index(element) {
        const id = element.getAttribute("id");
        const children = element.children;
        const tagName = element.tagName.toLowerCase();
        if (id != null) {
            const headerNum = this.getHNum(tagName);
            const textContent = element.textContent || "";
            this.section = this.doc.createSection(id, textContent, this.hSections[headerNum - 1]);
            this.section.addText(textContent);
            if (headerNum >= 0) {
                this.hSections[headerNum] = this.section;
            }
        }
        if (tagName == 'title') {
            this.doc.title = element.textContent || "";
        }
        if (tagName == 'pre') {
            for (const line of (element.textContent || "").split(/\n/g)) {
                this.section.addText(line);
            }
        }
        else if (children.length == 0 || tagName == 'p' || tagName == 'code') {
            this.section.addText(element.textContent || "");
        }
        else {
            for (let n = 0; n < children.length; n++) {
                const child = children[n];
                this.index(child);
            }
        }
    }
}
async function fetchParts() {
    let response = await fetch("/all.html");
    let text = await response.text();
    return text.split("!!!$PAGE$!!!");
}
async function getIndex() {
    let parts = await fetchParts();
    const parser = new DOMParser();
    const index = new DocIndex();
    for (const part of parts) {
        const breakPos = part.indexOf("\n");
        if (breakPos < 0)
            continue;
        const url = part.substr(0, breakPos);
        const content = part.substr(breakPos + 1);
        const xmlDoc = parser.parseFromString(content, "text/html");
        const indexer = new DocIndexer(index, url);
        indexer.index(xmlDoc.documentElement);
    }
    return index;
}
async function getIndexOnce() {
    var _a;
    (_a = window).searchIndexPromise || (_a.searchIndexPromise = getIndex());
    window.searchIndex = await window.searchIndexPromise;
    return window.searchIndex;
}
async function newSearchMain() {
    const index = await getIndexOnce();
    console.log("ready");
    const searchBox = document.querySelector("input#searchbox");
    if (searchBox) {
        let lastText = '';
        searchBox.addEventListener("keyup", (e) => {
            const currentText = searchBox.value;
            if (lastText != currentText) {
                lastText = currentText;
                console.clear();
                const time0 = Date.now();
                const results = index.query(currentText, 7, true);
                const time1 = Date.now();
                console.info("Results in", time1 - time0);
                for (const result of results) {
                    console.log("###", result.doc.url, result.doc.title, result.score);
                    for (const res of result.results) {
                        console.log("->", `SCORE:`, res.score, res.section.titles, res.paragraph?.paragraph?.text);
                    }
                }
            }
        });
    }
}
