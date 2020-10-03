---
layout: default
title: "Cordova (Legacy)"
title_prefix: KorGE Targets
fa-icon: fa-mobile
priority: 10
#status: new
---

Before Kotlin/Native was being stable, and proper iOS target was created,
KorGE supported Apache Cordova using the Kotlin/JS target.

Now Cordova **<u>is disabled by default</u>** to avoid confusion, but you can still
enable it.

{% include toc_include.md %}

## Enabling Cordova targets

You have to Opt-In to be able to use Cordova targets. You can do it by adding
this to your `gradle.properties` file:

```properties
enable.cordova.targets=true
```

## Android Target

You will need the Android SDK.

```bash
./gradlew compileCordovaAndroid           # Just compiles cordova for Android
./gradlew runCordovaAndroid               # Runs the application (dce'd, minimized and webpacked) in an Android device
./gradlew runCordovaAndroidNoMinimized    # Runs the application in Android without minimizing (so you can use `chrome://inspect` to debug the application easier)
```

## iOS Target

You will need XCode and iOS SDKs.

```bash
./gradlew compileCordovaIos               # Just compiles cordova for iOS
./gradlew runCordovaIos                   # Runs the application (dce'd, minimized and webpacked) in an iOS device
./gradlew runCordovaIosNoMinimized        # Runs the application in iOS without minimizing (so you can use Safari on macOS to debug the application easier)
```