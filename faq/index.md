---
layout: default
title: FAQ
fa-icon: fa-question-circle
priority: 1000
---

## Are these libraries free?

Yes. All these libraries are dual licensed under MIT and Apache 2.0, except some libraries that I have ported from other languages and were not licensed as MIT, that propagate their own license. But in any case, all the licenses used are free and permissive.

## Where can I find the libraries?

* You can find the source code of my libraries: <https://github.com/korlibs> and <https://github.com/soywiz>.
* I publish all my library binaries at bintray: <https://bintray.com/soywiz/soywiz>.

There are plans to publish them on Maven Central too, but I need some time to update the build scripts to do so.

## How do I include these libraries in my multiplatform projects?

Older versions (before february) just require one line + gradle metadata:

```groovy
commonMainApi "com.soywiz:library:$version"
```

Newer versions published after 6 february, do not include gradle metadata (that has a lot of known problems), but require adding dependencies for each target independently:

```groovy
def library = "klock"
commonMainApi "com.soywiz:$library-metadata:$libraryVersion" // it is common on the left, and -metadata on the right
jvmMainApi "com.soywiz:$library-jvm:$libraryVersion"
jsMainApi "com.soywiz:$library-js:$libraryVersion"
androidMainApi "com.soywiz:$library-android:$libraryVersion"
iosX64MainApi "com.soywiz:$library-iosx64:$libraryVersion"
iosArm32MainApi "com.soywiz:$library-iosarm32:$libraryVersion"
iosArm64MainApi "com.soywiz:$library-iosarm64:$libraryVersion"
macosX64MainApi "com.soywiz:$library-macosx64:$libraryVersion"
linuxX64MainApi "com.soywiz:$library-linuxx64:$libraryVersion"
mingwX64MainApi "com.soywiz:$library-mingwx64:$libraryVersion"
```

If you are using kotlin-dsl, I have made a small couple of functions for it:

```kotlin
val ALL_TARGETS = listOf("android", "iosArm64", "iosArm32", "iosX64", "js", "jvm", "linuxX64", "macosX64", "mingwX64", "metadata")

fun DependencyHandler.addCommon(group: String, name: String, version: String, targets: List<String> = ALL_TARGETS) {
    for (target in targets) {
        val suffix = "-${target.toLowerCase()}"
        val base = when (target) {
            "metadata" -> "common"
            else -> target
        }

        val packed = "$group:$name$suffix:$version"
        add("${base}MainApi", packed)
        add("${base}TestImplementation", packed)
    }
}

fun DependencyHandler.addCommon(dependency: String, targets: List<String> = ALL_TARGETS) {
    val (group, name, version) = dependency.split(":", limit = 3)
    return addCommon(group, name, version, targets)
}

// Usage:
dependency {
    addCommon("com.soywiz:klock:$klockVersion")
}
```

## Why do you use a custom version of kotlinx-coroutines?

I was not able to figure out how to get it working without gradle metadata,
so I decided to publish a custom version based on 1.1.0 until I know how to
include it in multiplatform projects without metadata on native without issues.

## Contributing

This is an Opensource project.
That means that it is **free of charge**, and that you can **see**, **modify** and **suggest changes** to the source code.
The whole project stack is opensource, so you can contribute to this projectitself, the documentation or even the blog.

Think that this is a huge project that has been initially developed by a single person, and that requires a lot of time.
So probably it will have some rough edges. But you can help to improve it!

### Contributing to the documentation

Did you find **something wrong**? Something **misleading** or **confusing**? Or just want to add more content to the documentation?

In order to make it easier to contribute, each page of the documentation contains a pencil link, that sends you to the github page of the documentation to modify the file itself.

![](/faq/contributing/doc_pencil_button.png)

That link sends you to the file just for viewing, but github provides another pencil button that when pressed will create a fork of the documentation project so you can modify the file and later create a PR with your suggestions.

![](/faq/contributing/github_edit_this_page.png)

This project uses [jekyll](https://jekyllrb.com/) for its documentation.
Jekyll is a blogging engine that works out of the box on github.
It also allows to be used as a plain CMS allowing to create custom sites
like this documentation.
