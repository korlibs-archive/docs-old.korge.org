---
layout: default
title: "Setup"
fa-icon: fa-check-square
priority: 0
---

## Editor

You can create KorGE applications with any editor of your preference that supports Kotlin.
I suggest you to use either [IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/) or [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/).
If you can afford it, the Ultimate version has [a lot more features](https://www.jetbrains.com/idea/features/editions_comparison_matrix.html) and it is super sweet if you plan to do fullstack development using Kotlin.

I suggest you to configure IntelliJ IDEA with:

* Editor → Code Style → Kotlin → Imports → Use imports with '*'
* Build, Execution, Deployment → Build Tools → Gradle → Runner → Delegate IDE build/run actions to gradle and Run tests using Gradle test runner
* Editor → General → Code Completion → Match Case - NO, Show the parameter info popup in 0 ms

## Gradle

KorGE uses gradle as build system. The only special requirement to build KorGE is any supported Java JDK.

The easiest way to get started is to download the template project that includes a Gradle 5.1.1 wrapper, a preconfigured build-script and a small main and a test:

### <a href="https://github.com/korlibs/korge-hello-world/archive/master.zip"><i class="fa fa-download"></i> Download Project Template</a>

To know how to configure the gradle plugin by yourself, check the [Gradle Plugin section](/korge/gradle-plugin).
