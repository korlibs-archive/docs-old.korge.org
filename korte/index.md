---
layout: default
title: "KorTE"
fa-icon: far fa-file-code
priority: 41
---

<img alt="KorTE" src="/i/logos/korte.svg" width="128" height="128" style="float: left;" />

KorTE is a asynchronous template engine for Multiplatform Kotlin 1.3.

It is a non-strict super set of [twig](https://twig.symfony.com/) / [django](https://docs.djangoproject.com/en/2.1/topics/templates/) / [atpl.js](https://github.com/soywiz/atpl.js) template engines and can support [liquid templaet engine](https://shopify.github.io/liquid/) too with frontmatter.

It has out of the box support for [ktor](https://ktor.io/) and [vert.x](https://vertx.io/).

It works on JVM and JS out of the box.
But can also work on Native when using untyped model data or making models to implement the `DynamicType` interface.

It allows to call suspend methods from within templates.

<https://github.com/korlibs/korte>

{% include stars.html project="korte" %}

[![Build Status](https://travis-ci.org/korlibs/korte.svg?branch=master)](https://travis-ci.org/korlibs/korte)
[![Maven Version](https://img.shields.io/github/tag/korlibs/korte.svg?style=flat&label=maven)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22korte%22)

Live demo (editable) [[source code]](https://github.com/korlibs/korte-samples/blob/master/korte-sample-browser/src/main/kotlin/main.kt){:target="_blank",:rel="noopener"}:

<embed src="https://korlibs.github.io/korte-samples/korte-sample-browser/web/" style="width: 100%;height:50vh;" />

{% include toc_include.md %}

{% include using_with_gradle.md name="korte" %}

{% raw %}

## Usage

### Raw Usage

Manual usage:

```kotlin
import com.soywiz.korte.Template

val template = Template("hello {{ who }}")
val rendered = template(mapOf("who" to "world"))
assertEquals("hello world", rendered)
```

Managed with KorIO's Vfs and optional cache:

```kotlin
import com.soywiz.korte.Templates

//val myvfs = resourcesVfs["templates"] // To read templates from a 'templates' folder in the application resources
val myvfs = MemoryVfsMix(
    "index.html" to "hello {{ who }}"
)

val templates = Templates(myvfs, cache = true)
val rendered = templates.render("index.html", mapOf("who" to "world"))
assertEquals("hello world", rendered)
```

### Ktor

```kotlin
dependencies {
    jvmMainApi "com.soywiz:korte-ktor-jvm:$korteVersion"
}
```

```kotlin
fun Application.module() {
    install(Korte) {
        cache(true)
        root(
            // resourcesVfs
            MemoryVfsMix(
                "demo.tpl" to "Hello {{ hello }}"
            )
        )
    }
    routing {
        get("/") {
            call.respondKorte("demo.tpl", MyModel(hello = "world"))
        }
    }
    assertEquals("Hello world", handleRequest(HttpMethod.Get, "/") { }.response.content)
}
```

### Vert.x

```kotlin
dependencies {
    jvmMainApi "com.soywiz:korte-vertx-jvm:$korteVersion"
}
```

```kotlin
val port = 0
val host = "127.0.0.1"
val vertx = Vertx.vertx()
val router = Router.router(vertx)
val template = TemplateHandler.create(
    KorteVertxTemplateEngine(
        coroutineContext, Templates(
            MemoryVfsMix(
                "index.html" to "hello world {{ 1 + 2 }}!",
                "hello.html" to "Nice :)!"
            )
        )
    )
)

router.get("/*").handler(template)

val server: HttpServer = run {
    val server = vertx.createHttpServer()
    server.requestHandler(router)
    vx { server.listen(port, host, it) }
}
val actualPort = server.actualPort()

try {
    val client = vertx.createHttpClient()
    assertEquals("hello world 3!", client.get(actualPort, "127.0.0.1", "/").readString())
    assertEquals("Nice :)!", client.get(actualPort, "127.0.0.1", "/hello").readString())
} finally {
    server.close()
}
```

### Native

Since Kotlin/Native doesn't provide any kind of reflective functionality yet (and kotlinx.serialization don't allow to call methods), you have to help it a bit to understand your typed models to be able to call them.

```kotlin
data class Person(val name: String, val surname: String) :
    DynamicType<Person> by DynamicType({ register(Person::name, Person::surname) })
```

```kotlin
class TestMethods : DynamicType<TestMethods> by DynamicType({
        register("mytest123") { mytest123() }
        register("sum") { sum(it[0].toDynamicInt(), it[1].toDynamicInt()) }
    }), DynamicContext {
        var field = 1

        suspend fun mytest123(): Int {
            var r = withContext(Dispatchers.Unconfined) { field }
            return r + 7
        }

        @JsName("sum")
        suspend fun sum(a: Int, b: Int): Int {
            return a + b
        }
    }
```

## Syntax (Basic)

KorTE has two kind of markers:
* `{% block_marker %}`
* `{% block %}...{% endblock %}`
* `{{ expression_marker }}`.

Space trimming:

* Left: `{%- block_marker %}`
* Right: `{% block_marker -%}`
* Both: `{%- block_marker -%}`

Expressions:

* Binary operators: `+`, `-`, `*`, `/`, `%`, `**`, `&`, `|`, `^`, `AND`, `OR`, `&&`, `||`, `==`, `!=`, `<=`, `>=`, `<`, `>`, `<=>`, `in`, `?:`, `..`
* Unary operators: `+`, `-`, `~`, `!`, `NOT`
* Ternary operator: `?`, `:`
* String Literals: `"abc"` or `'abc'`
* Array Literals: `[1,2,3,4]`
* Object Literals: `{"k1": "v1", "k2": "v2"}`
* String Interpolation *(not implemented in 1.0.0)*: `"hello #{name}"`
* Array Access: `list[0]`, `map["key"]`
* Filter invoke: `expr|myfilter` or `expr|myfilter(arg1, arg2, ...)`
* Property Access: `myobj.key` (if key is a property or a suspend function it will be called)
* Function/Method call: `myobj.method(arg1, arg2...)` (if `method` is suspend will be called normally)

## Syntax (Tags)

### FOR

The simplest syntax for for is:

```liquid
{% for key in list %}{{ key }}{% endfor %}
```

You can also iterate maps and lists of pairs:

```liquid
{% for key, value in map %}{{ key }}={{ value }}{% endfor %}
```

It is possible define an else block to be executed when the iterable is empty:

```liquid
{% for item in expression %}
    {{ item }},
{% else %}
    List is empty
{% endfor %}
```

Inside loops, there is a special variable called `loop` with information about the iteration.

```liquid
{% for item in expression %}
    {{ loop.length }}
    {{ loop.index }}
    {{ loop.index0 }}
    {{ loop.revindex }}
    {{ loop.first }} -- boolean
    {{ loop.last }} -- boolean
{% endfor %}
```

You can iterate ranges using the `..` operator:

```liquid
{% for n in 0..9 %}{{ n }}, {% endfor %}
```

> `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, `

### IF / ELSEIF / ELSE

The basic syntax:

```liquid
{% if expression %}display only if expression is true{% endif %}
```

IF / ELSE syntax:

```liquid
{% if expression %}
    display only if expression is true
{% else %}
    display only if expression is false
{% endif %}
```

IF / ELSEIF / ELSE syntax:

```liquid
{% if expression1 %}
    display only if expression is true
{% elseif expression2 %}
    display if expression2 is true and expression1 was false
{% else %}
    display only if not matched other entries
{% endif %}
```

### SWITCH + CASE

```liquid
{% switch expression %}
    {% case "a" %}Case a
    {% case "b" %}Case b
    {% default %}Other cases
{% endswitch %}
```

### SET

In order to create temporal variables you can use the set tag:

```liquid
{% set variable = expression %}
```

### DEBUG

Logs message to the standard output for debugging:

```liquid
{% debug "test" %}
```

### CAPTURE

```liquid
{% capture variable %}REPEAT{% endcapture %}

{{ variable }} and {{ variable }}
```

### MACRO + IMPORT

#### `_macros.html`
```liquid
{% macro sum(a, b) %}
    {{ a + b }}
{% endmacro %}
```

#### `index.html`
```liquid
{% import "_macros.html" as macros %}
{{ macros.sum(1, 2) }}
```

### INCLUDE

#### `_include_.html`
```liquid
HELLO {{ name }}
```

#### `index.html`
```liquid
{% set name = "WORLD" %}{% include "_include.html" %}
{% set name = "NAME" %}{% include "_include.html" %}
```

### EXTENDS + BLOCK

KorTE supports template inheritance with multiply blocks.

#### `_base.html`
```liquid
<html><head></head><body>
{% block content %}default content{% endblock %}
</body></html>
```

#### `_two_columns.html`
```liquid
{% extends "_base.html" %}
{% block content %}
    <div>{% block left %}default left column{% endblock %}</div>
    <div>{% block right %}default right column{% endblock %}</div>
{% endblock %}
```

#### `index.html`
```liquid
{% extends "_two_columns.html" %}
{% block left %}
    My left column
{% endblock %}
{% block right %}
    My prefix {{ parent() }} with additional content
{% endblock %}
```

## Syntax (Functions)

### CYCLE

This functions allows to pick a value in a list in a cyclic way:

```liquid
assertEquals("a", Template("{{ cycle(['a', 'b'], 2) }}")())
assertEquals("b", Template("{{ cycle(['a', 'b'], -1) }}")())
```

### RANGE

Along the `..` operator, allows you to create a range and to specify a custom step instead of the default 1.

```liquid
assertEquals("[0, 1, 2, 3]", Template("{{ 0..3 }}")())
assertEquals("[0, 1, 2, 3]", Template("{{ range(0,3) }}")())
assertEquals("[0, 2]", Template("{{ range(0,3,2) }}")())
```

### PARENT

This function is used inside a `{% block %}` block when used in inheritance to place the content of the block defined in ancestors. Acts like a `super.myblock()` in kotlin.

```liquid
{% block myblock %}
    Before the default content
    {{ parent() }}
    After the default content
{% endblock %}
```

## Syntax (Filters)

### CAPITALIZE

```liquid
{{ "hellO"|capitalize }}
```
> `HellO`

### LOWER

```liquid
{{ "HELLo"|lower }}
```
> `hello`

### UPPER

```liquid
{{ "hellO"|upper }}
```
> `HELLO`

### JOIN

```liquid
{{ [1,2,3,4]|join(":") }}
```
> `1:2:3:4`

### LENGTH

```liquid
{{ ['a', 'b', 'c']|length }}, {{ "hi"|length }}
```
> `3, 2`

### QUOTE

```liquid
{{ "I'm a test"|quote }}
```
> `"I\'m a test"`

### REVERSE

```liquid
{{ "hello"|reverse }}, {{ [1,2,3]|reverse }}
```
> `olleh, [3,2,1]`

### RAW

```liquid
{{ "<test>" }}, {{ "<test>"|raw }}
```
> `&lt;test&gt;, <test>`

### SORT

```liquid
{{ [10, 4, 7, 1]|sort }}
```
> `[1,4,7,10]`

### TRIM

```liquid
{{ "   hello   "|trim }}
```
> `hello`

### MERGE

```liquid
{{ [1, 2, 3]|merge([4, 5, 6]) }}
```
> `[1,2,3,4,5,6]`

### JSON_ENCODE

```liquid
{{ ["a", "b"]|json_encode }}
```
> `["a", "b"]`

### FORMAT

```liquid
{{ "hello %03d"|format(7) }}
```
> `hello 007`

### CHUNKED

```liquid
{{ [1,2,3,4,5]|chunked(2) }}
```
> `[[1,2],[3,4],[5]]`

## Extending

```kotlin
val config = TemplateConfig()
config.register(Filter("length") { subject.dynamicLength() })

val template = Template("mytemplate", config)
```

### Filters

Filters have an injected this with the execution `context`, the `subject`,and optionally the `args` of the filter call.

```kotlin
config.register(Filter("length") { subject.dynamicLength() })
```

```kotlin
config.register(Filter("chunked") {
    subject.toDynamicList().chunked(args[0].toDynamicInt())
})
```

### Functions

Functions have an args argument that receives a list of parameters already evaluated:

```kotlin
config.register(TeFunction("cycle") { args ->
    val list = args.getOrNull(0).toDynamicList()
    val index = args.getOrNull(1).toDynamicInt()
    list[index umod list.size]
})
```

### Tags

A tag has an associated name, several internal tag names, and a tag that ends this tag or null if it is not a block.

```kotlin
config.register(Tag("capture", setOf(), null) {
    data class BlockCapture(val varname: String, val content: Block) : Block {
		override suspend fun eval(context: Template.EvalContext) {
			val result = context.capture {
				content.eval(context)
			}
			context.scope.set(varname, RawString(result))
		}
	}

    val main = chunks[0]
    val tr = ExprNode.Token.tokenize(main.tag.content)
    val varname = ExprNode.parseId(tr)
    DefaultBlocks.BlockCapture(varname, main.body)
})
```

```kotlin
config.register(Tag("switch", setOf("case", "default"), setOf("endswitch")) {
    var subject: ExprNode? = null
    val cases = arrayListOf<Pair<ExprNode, Block>>()
    var defaultCase: Block? = null

    for (part in this.chunks) {
        val tagContent = part.tag.content
        val body = part.body
        when (part.tag.name) {
            "switch" -> {
                subject = ExprNode.parse(tagContent)
            }
            "case" -> {
                cases += ExprNode.parse(tagContent) to body
            }
            "default" -> {
                defaultCase = body
            }
        }
    }
    if (subject == null) error("No subject set in switch")
    //println(this.chunks)
    object : Block {
        override suspend fun eval(context: Template.EvalContext) {
            val subjectValue = subject.eval(context)
            for ((case, block) in cases) {
                if (subjectValue == case.eval(context)) {
                    block.eval(context)
                    return
                }
            }
            defaultCase?.eval(context)
            return
        }
    }
})
```

{% endraw %}
