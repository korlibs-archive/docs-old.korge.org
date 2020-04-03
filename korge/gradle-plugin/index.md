---
layout: default
title: "Gradle Plugin"
title_prefix: KorGE
fa-icon: fa-arrow-alt-circle-right
priority: 1
---

{% include toc_include.md %}

## The `korge` extension

The korge extension is a DSL to configure the application.
For further reference you can find the source code [here](https://github.com/korlibs/korge-plugins/blob/master/korge-gradle-plugin/src/main/kotlin/com/soywiz/korge/gradle/KorgeExtension.kt).

```kotlin
korge {
    id = "com.unknown.unknownapp"
    version = "0.0.1"
    exeBaseName = "app"
    name = "unnamed"
    description = "description"
    orientation = Orientation.DEFAULT
    copyright = "Copyright (c) 2019 Unknown"

    // Configuring the author
    authorName = "unknown"
    authorEmail = "unknown@unknown"
    authorHref = "http://localhost"
    author("name", "email", "href")

    icon = File(rootDir, "icon.png")

    gameCategory = GameCategory.ACTION
    fullscreen = true
    backgroundColor = 0xff000000.toInt()
    appleDevelopmentTeamId = java.lang.System.getenv("DEVELOPMENT_TEAM") ?: project.findProperty("appleDevelopmentTeamId")?.toString()
    appleOrganizationName = "User Name Name"
    entryPoint = "main"
    jvmMainClassName = "MainKt"
    androidMinSdk = null

    cordovaPlugin("name", mapOf("arg1" to "value1"), version = "version")

    //androidAppendBuildGradle("...code...")
    config("MYPROP", "MYVALUE")

    // Korge Plugins
    plugin("com.soywiz:korge-admob:$korgeVersion", mapOf("ADMOB_APP_ID" to ADMOB_APP_ID))
    admob(ADMOB_APP_ID) // Shortcut for admob

    cordovaUseCrosswalk()
}
```

## Project structure

Three small files (plus gradle {{ site.data.versions.gradle }}) is all you need to get started:

### settings.gradle.kts

This file is used to preconfigure gradle. You will need to `enableFeaturePreview` with `GRADLE_METADATA` for KorGE to work.
It uses gradle metadata to determine where are the artifacts that it will need. This need might be removed in the future,
but for now it is required.

```kotlin
enableFeaturePreview("GRADLE_METADATA")
```

### build.gradle.kts

In this file you include and configure the KorGE gradle plugin.

The plugin does:

* Choose and configure the right supported `kotlin-multiplatform`. At this point, it uses `1.3.61`.
* Include all the artifacts required for KorGE.
* Add tasks to compile, install and run all the supported targets by the platform.
* Enable a extension called `korge` where you can configure properties of your application (application title, id, icon...)

```kotlin
import com.soywiz.korge.gradle.*

buildscript {
	repositories {
		mavenLocal()
		maven { url = uri("https://dl.bintray.com/korlibs/korlibs") }
		maven { url = uri("https://plugins.gradle.org/m2/") }
		mavenCentral()
	}
	dependencies {
		classpath("com.soywiz:korge-gradle-plugin:1.0.2") // KorGE version here
	}
}

apply(plugin = "korge")

korge {
	id = "com.sample.demo"
}
```

Right now, the plugin is stored at my `bintray`, so you have to include this line for it to work: `maven { url = uri("https://dl.bintray.com/korlibs/korlibs") }`.

Later I will publish the artifacts to `Maven Central` and the plugin to the `Gradle Plugins` repository.

### src/commonMain/kotlin

All your common source files must be stored here.
If you want to have specific source files per platform, you can use the directory structure of Kotlin-Common.
For example: `src/androidMain/kotlin`, `src/jsMain/kotlin`, `src/jvmMain/kotlin`, `src/iosX64/kotlin`...

#### src/commonMain/kotlin/main.kt

KorGE requires the entry point to be a `suspend fun main` function without arguments. In most of the targets, this function is called directly. But in Android and iOS, this main will be called after from an `Activity` or a `ViewController`.
All these details are handled by the KorGE gradle plugin.

```kotlin
suspend fun main() = Korge {
    solidRect(100, 100, Colors.RED)
}
```

## Gradle Tasks

In addition to all the low-level tasks offered by the `kotlin-multiplatform` plugin, KorGE offers additional tasks:

For Windows, change all the `./gradlew` for `gradlew.bat`.

The most basic task to run your application is `./gradlew runJvm`.

For the rest of the tasks and details for each platform, check the [Targets section](/korge/targets):

{% include toc.html context="/korge/targets/" %}
