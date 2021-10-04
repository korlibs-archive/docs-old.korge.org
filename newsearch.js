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
        const out = [];
        for (const it of text.toLowerCase().split(/\W+/g)) {
            const res = it.trim().replace(/c/g, 'k').replace(/l+/g, 'l').replace(/s+$/g, '');
            const res2 = replacements.get(res) || res;
            if (res2.length > 0) {
                out.push(res2);
            }
        }
        return out;
    }
}
class TokenizedText {
    constructor(text, words = TextProcessor.tokenize(text).unique()) {
        this.text = text;
        this.words = words;
        this.length = words.length;
    }
}
class QueryResult {
    constructor(text, words, section) {
        this.text = text;
        this.words = words;
        this.section = section;
        this.paragraph = section.matches(words) ?? section.matchesAnyOrder(words) ?? section.matchesAny(words);
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
class DocQueryResultResult {
    constructor(results, wordsInIndex, iterations = 0, queryTimeMs = 0) {
        this.results = results;
        this.wordsInIndex = wordsInIndex;
        this.iterations = iterations;
        this.queryTimeMs = queryTimeMs;
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
    addWords(section, text) {
        const words = new Set(text.words);
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
        const time0 = Date.now();
        const tokenizedText = new TokenizedText(text).words;
        let allWordsSep = tokenizedText.map(it => this.findWords(it));
        if (debug)
            console.info(JSON.stringify(allWordsSep), tokenizedText);
        if (allWordsSep.length == 0)
            return new DocQueryResultResult([], this.wordsToSection.size);
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
        const results = [...intersectionSections]
            .slice(0, maxResults)
            .map(it => new QueryResult(text, tokenizedText, it))
            .groupBy(it => it.doc)
            .map((key, value) => new DocQueryResult(key, value))
            .sortedBy(it => -it.score);
        const time1 = Date.now();
        return new DocQueryResultResult(results, this.wordsToSection.size, 0, time1 - time0);
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
var DocParagraphKind;
(function (DocParagraphKind) {
    DocParagraphKind[DocParagraphKind["TEXT"] = 0] = "TEXT";
    DocParagraphKind[DocParagraphKind["PRE"] = 1] = "PRE";
    DocParagraphKind[DocParagraphKind["TITLE"] = 2] = "TITLE";
    DocParagraphKind[DocParagraphKind["SUBTITLE"] = 3] = "SUBTITLE";
})(DocParagraphKind || (DocParagraphKind = {}));
class DocParagraph {
    constructor(texts, kind) {
        this.texts = texts;
        this.kind = kind;
    }
    get text() { return this.texts.text; }
    get words() { return this.texts.words; }
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
    matchesAnyOrder(words) {
        for (const word of words) {
            if (!this.words.any(it => this.matchesWord(word, it)))
                return null;
        }
        return new DocParagraphResult(this, 0, this.words.length);
    }
    matchesAny(words) {
        for (const word of words) {
            if (this.words.any(it => this.matchesWord(word, it)))
                return new DocParagraphResult(this, 0, this.words.length);
        }
        return null;
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
    addText(text, kind) {
        if (text.length == 0)
            return;
        this.paragraphs.push(new DocParagraph(text, kind));
        this.doc.index.addWords(this, text);
        for (const word of text.words) {
            if (!this.words.has(word))
                this.words.set(word, 0);
            this.words.set(word, this.words.get(word) + 1);
        }
    }
    addRawText(text, kind) {
        this.addText(new TokenizedText(text), kind);
    }
    matches(words) {
        for (const p of this.paragraphs) {
            const result = p.matches(words);
            if (result)
                return result;
        }
        return null;
    }
    matchesAnyOrder(words) {
        for (const p of this.paragraphs) {
            const result = p.matchesAnyOrder(words);
            if (result)
                return result;
        }
        return null;
    }
    matchesAny(words) {
        if (this.paragraphs.length == 0)
            return null;
        for (let n = 1; n < this.paragraphs.length; n++) {
            const p = this.paragraphs[n];
            const result = p.matchesAny(words);
            if (result)
                return result;
        }
        return this.paragraphs[0].matchesAny(words);
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
            this.section.addRawText(this.doc.title, DocParagraphKind.TITLE);
            for (const title of this.section.titles) {
                this.section.addRawText(title, DocParagraphKind.SUBTITLE);
            }
            this.section.addRawText(textContent, DocParagraphKind.TEXT);
            if (headerNum >= 0) {
                this.hSections[headerNum] = this.section;
            }
        }
        if (tagName == 'title') {
            this.doc.title = element.textContent || "";
        }
        if (tagName == 'pre') {
            for (const line of (element.textContent || "").split(/\n/g)) {
                this.section.addRawText(line, DocParagraphKind.PRE);
            }
        }
        else if (children.length == 0 || tagName == 'p' || tagName == 'code') {
            this.section.addRawText(element.textContent || "", DocParagraphKind.TEXT);
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
    const time0 = Date.now();
    let response = await fetch("/all.html");
    let text = await response.text();
    const time1 = Date.now();
    console.log("Fetched all.html in", time1 - time0);
    return text.split("!!!$PAGE$!!!");
}
function createIndexFromParts(parts) {
    const time0 = Date.now();
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
    const time1 = Date.now();
    console.log("Created index in", time1 - time0);
    return index;
}
async function getIndex() {
    const parts = await fetchParts();
    return createIndexFromParts(parts);
}
async function getIndexOnce() {
    var _a;
    (_a = window).searchIndexPromise || (_a.searchIndexPromise = getIndex());
    window.searchIndex = await window.searchIndexPromise;
    return window.searchIndex;
}
HTMLElement.prototype.createChild = (function (tagName, gen) {
    const element = document.createElement(tagName);
    if (gen) {
        gen(element);
    }
    this.appendChild(element);
    return element;
});
function html(name) {
}
async function newSearchHook(query) {
    const index = await getIndexOnce();
    console.log("ready");
    const searchBox = document.querySelector(query);
    const searchResults = document.createElement("div");
    searchResults.classList.add("newsearch");
    document.body.appendChild(searchResults);
    if (searchBox) {
        let lastText = '';
        searchBox.addEventListener("keyup", (e) => {
            const currentText = searchBox.value;
            if (lastText == currentText)
                return;
            searchResults.innerHTML = '';
            lastText = currentText;
            console.clear();
            const results = index.query(currentText, 7, true);
            console.info("Results in", results.queryTimeMs, "words in index", results.wordsInIndex);
            for (const result of results.results) {
                searchResults.createChild("h2", (it) => {
                    it.innerText = result.doc.title;
                });
                console.log("###", result.doc.url, result.doc.title, result.score);
                for (const res of result.results) {
                    console.log("->", `SCORE:`, res.score, res.section.titles, res.paragraph?.paragraph?.text);
                    searchResults.createChild("div", (it) => {
                        it.className = "block";
                        it.createChild("div", (it) => {
                            it.className = "section";
                            it.createChild("a", (it) => {
                                it.href = `${res.doc.url}#${res.section.id}`;
                                it.innerText = res.section.titles.join(" > ");
                            });
                        });
                        const isPre = res.paragraph?.paragraph?.kind == DocParagraphKind.PRE;
                        it.createChild(isPre ? "pre" : "div", (it) => {
                            it.className = "content";
                            it.innerText = res.paragraph?.paragraph?.text || "";
                        });
                    });
                }
            }
        });
    }
}
async function newSearchMain() {
    await newSearchHook("input#searchbox");
}
