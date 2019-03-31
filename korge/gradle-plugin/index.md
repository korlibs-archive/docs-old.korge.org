---
layout: default
title: "Gradle Plugin"
fa-icon: fa-arrow-alt-circle-right
priority: 1
---

**Table of contents:**

{::options toc_levels="1..3" /}

* TOC
{:toc}

## The `korge` extension

The korge extension is a DSL to configure the application.
For further reference you can find the source code [here](https://github.com/korlibs/korge/blob/master/plugins/korge-gradle-plugin/src/main/kotlin/com/soywiz/korge/gradle/KorgeExtension.kt).

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

Three small files (plus gradle 5.1.1) is all you need to get started:

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

* Choose and configure the right supported `kotlin-multiplatform`. At this point, it uses `1.3.20`.
* Include all the artifacts required for KorGE.
* Add tasks to compile, install and run all the supported targets by the platform.
* Enable a extension called `korge` where you can configure properties of your application (application title, id, icon...)

```kotlin
import com.soywiz.korge.gradle.*

buildscript {
	repositories {
		mavenLocal()
		maven { url = uri("https://dl.bintray.com/soywiz/soywiz") }
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

Right now, the plugin is stored at my `bintray`, so you have to include this line for it to work: `maven { url = uri("https://dl.bintray.com/soywiz/soywiz") }`.

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

### Compiling for the JVM (Desktop)

Inside IntelliJ you can go to the `src/commonMain/kotlin/main.kt` file and press the green ▶️ icon
that appears to the left of the `suspend fun main()` line.

Using gradle tasks on the terminal:

```bash
./gradlew runJvm                    # Runs the program
./gradlew packageJvmFatJar          # Creates a FAT Jar with the program
./gradlew packageJvmFatJarProguard  # Creates a FAT Jar with the program and applies Proguard to reduce the size
```

Fat JARs are stored in the `/build/libs` folder.



### Compiling for the Web

Using gradle tasks on the terminal:

```bash
./gradlew jsWeb                     # Outputs to /build/web
./gradlew jsWebMin                  # Outputs to /build/web-min (applying Dead Code Elimination)
./gradlew jsWebMinWebpack           # Outputs to /build/web-min-webpack (minimizing and grouping into a single bundle.js file)
```

You can use any HTTP server to serve the files in your browser.
For example using: `npm -g install http-server` and then executing `hs build/web`.

You can also use `./gradlew -t jsWeb` to continuously building the JS sources and running `hs build/web` in another terminal.
Here you can find a `testJs.sh` script doing exactly this for convenience.

You can run your tests using Node.JS by calling `jsTest` or in a headless chrome with `jsTestChrome`.

### Compiling for Native Desktop (Windows, Linux and macOS)

#### Debug Mode

Files produced by theese commands must have resources in the same directory, and are larger than they need to be

Using gradle tasks on the terminal:

```bash
./gradlew linkMainDebugExecutableMacosX64         # Outputs to /build/bin/macosX64/mainDebugExecutable/main.kexe
./gradlew linkMainDebugExecutableLinuxX64         # Outputs to /build/bin/linuxX64/mainDebugExecutable/main.kexe
./gradlew linkMainDebugExecutableMingwX64         # Outputs to /build/bin/mingwX64/mainDebugExecutable/main.exe
```

#### Make the file smaller!

```bash
./gradlew packageMacosX64AppRelease         # Outputs to /build/bin/macosX64/mainReleaseExecutable/main.kexe
./gradlew packageLinuxX64AppRelease         # Outputs to /build/bin/linuxX64/mainReleaseExecutable/main.kexe
./gradlew packageMingwX64AppRelease         # Outputs to /build/bin/mingwX64/mainReleaseExecutable/main.exe
```
#### Adding an icon

Add an icon to your package by adding this to your `build.gradle`
```kotlin
korge {
    icon = file("<youricon>.png")
}
```

#### Cross-Compiling for Linux/Windows

If you have docker installed, you can generate native executables for linux and windows
using the cross-compiling gradle wrappers:

```bash
./gradlew_linux linkMainDebugExecutableLinuxX64   # Outputs to /build/web
./gradlew_win   linkMainDebugExecutableMingwX64   # Outputs to /build/web
```

#### Generating MacOS `.app`

```bash
./gradlew packageMacosX64AppDebug             # Outputs to /build/unnamed-debug.app
```

You can change `Debug` for `Release` in all the tasks to generate Release executables.

You can use the `strip` tool from your toolchain (or in the case of windows found in the ``~/.konan` toolchain)
to further reduce Debug and Release executables size by removing debug information (in some cases this will shrink the EXE size by 50%).

In windows this exe is at: `%USERPROFILE%\.konan\dependencies\msys2-mingw-w64-x86_64-gcc-7.3.0-clang-llvm-lld-6.0.1\bin\strip.exe`.

#### Linux notes

Since linux doesn't provide standard multimedia libraries out of the box,
you will need to have installed the following packages: `freeglut3-dev` and `libopenal-dev`.

In ubuntu you can use `apt-get`: `sudo apt-get -y install freeglut3-dev libopenal-dev`.

### Compiling for Android

You will need to have installed the Android SDK in the default path for your operating system
or to provide the `ANDROID_SDK` environment variable. The easiest way is to install Android Studio.

Using gradle tasks on the terminal:

#### Native Android (JVM)

```bash
./gradlew installAndroidDebug             # Installs an APK in all the connected devices
./gradlew runAndroidEmulatorDebug         # Runs the application in an emulator
```

Triggering these tasks, it generates a separate android project into `build/platforms/android`.
You can open it in `Android Studio` for debugging and additional tasks. The KorGE plugin just
delegates gradle tasks to that gradle project.

#### Apache Cordova (JS)

```bash
./gradlew compileCordovaAndroid           # Just compiles cordova from Android
./gradlew runCordovaAndroid               # Runs the application (dce'd, minimized and webpacked) in an Android device
./gradlew runCordovaAndroidNoMinimized    # Runs the application in Android without minimizing (so you can use `chrome://inspect` to debug the application easier)
```



### Compiling for iOS

You will need XCode and to download the iOS SDKs using Xcode.

Using gradle tasks on the terminal:

#### Native iOS (Kotlin/Native) + Objective-C

Note that the necessary bridges are built using Objective-C instead of Swift, so the application
won't include Swift's runtime.

```bash
./gradlew iosBuildSimulatorDebug          # Creates an APP file
./gradlew iosInstallSimulatorDebug        # Installs an APP file in the simulator
./gradlew iosRunSimulatorDebug            # Runs the APP in the simulator

```

These tasks generate a xcode project in `build/platforms/ios`, so you can also open the project
with XCode and do additional tasks there.

It uses [XCodeGen](https://github.com/yonaskolb/XcodeGen) for the project generation
and [ios-deploy](https://github.com/ios-control/ios-deploy) for deploying to real devices.

#### Apache Cordova (JS)

```bash
./gradlew compileCordovaIos               # Just compiles cordova from iOS
./gradlew runCordovaIos                   # Runs the application (dce'd, minimized and webpacked) in an iOS device
./gradlew runCordovaIosNoMinimized        # Runs the application in iOS without minimizing (so you can use Safari on macOS to debug the application easier)
```
