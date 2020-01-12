---
layout: default
title: FAQ
fa-icon: fa-question-circle
priority: 1000
status: new
---

**Table of contents:**

{::options toc_levels="1..2" /}

* TOC
{:toc}
{:.multicolumn}

## Are these libraries free?
{:#free}

Yes. All these libraries are dual licensed under MIT and Apache 2.0, except some libraries that I have ported from other languages and were not licensed as MIT, that propagate their own license. But in any case, all the licenses used are free and permissive.

## Where can I find the libraries?
{:#repos}

* You can find the source code of my libraries: <https://github.com/korlibs> and <https://github.com/soywiz>.
* I publish all my library binaries at bintray: <https://bintray.com/korlibs/korlibs>.
* The libraries are also synchronized to jcenter automatically

## How do I include these libraries in my multiplatform projects?
{:#include-multi}

The libraries are multiplatform Kotlin projects that uses GRADLE_METADATA to detect supported platforms.
They require Gradle 5.5.1 or greater. 

### `settings.gradle`
```groovy
enableFeaturePreview('GRADLE_METADATA')
```

### `build.gradle`
```groovy
repositories {
    jcenter()
    maven { url = uri("https://dl.bintray.com/korlibs/korlibs/") }
}
dependencies {
    implementation("com.soywiz.korlibs.klock:klock:1.6.1")
}
```

## How do I include these libraries in my pure-java projects?
{:#include-java}

### `build.gradle`
```groovy
dependencies {
    // ...
    implementation("com.soywiz.korlibs.klock:klock-jvm:1.6.1")
}
```

You might need to [disambiguate](https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#disambiguating-targets) in some cases:
```
implementation("com.soywiz.korlibs.klock:klock-jvm:1.6.1") {
    attributes {
        attribute(org.jetbrains.kotlin.gradle.plugin.KotlinPlatformType.attribute, org.jetbrains.kotlin.gradle.plugin.KotlinPlatformType.jvm)
    }
}
```

## Artifacts can't be resolved
{:#unresolved}

### Check that you are using at least Gradle 5.5.1
{:#unresolved-gradle}

```bash
./gradlew --version
```

You can update it with:

```bash
./gradlew wrapper --gradle-version=5.5.1
```

### Check that you have the repositories set
{:#unresolved-repositories}

```groovy
repositories {
    jcenter()
    maven { url = uri("https://dl.bintray.com/korlibs/korlibs/") }
}
```

## Contributing
{:#contributing}

This is an Opensource project.
That means that it is **free of charge**, and that you can **see**, **modify** and **suggest changes** to the source code.
The whole project stack is opensource, so you can contribute to this project itself, the documentation or even the blog.

Think that this is a huge project that has been initially developed by a single person, and that requires a lot of time.
So probably it will have some rough edges. But you can help to improve it!

### Contributing to the documentation
{:#contributing-docs}

Did you find **something wrong**,  **misleading** or **confusing**? Or just want to add more content to the documentation?

All the documentation is hosted at github using github pages and [jekyll](https://jekyllrb.com/):

<https://github.com/korlibs/korlibs.soywiz.com>

In order to make it easier to contribute, each page of the documentation contains a pencil link, that sends you to the github page of the documentation to modify the file itself.
