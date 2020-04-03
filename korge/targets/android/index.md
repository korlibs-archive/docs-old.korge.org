---
layout: default
title: "Android"
fa-icon: fa-mobile
priority: 3
#status: new
---

The Android target uses the Kotlin JVM. It consumes and generates intermediate `.class` files,
to end generating portable Android `APK`, or Android `AAR` packages
with no external dependencies, nor native per-platform native code, also supports
proguard, so the resulting application is really small.


{% include toc_include.md %}

## Executing

Using gradle tasks on the terminal:

```bash
./gradlew installAndroidDebug      # Installs an APK on all the connected devices
./gradlew runAndroidEmulatorDebug  # Runs the application in an emulator
```

Triggering these tasks, it generates a separate android project into `build/platforms/android`.
You can open it in `Android Studio` for debugging and additional tasks. The KorGE plugin just
delegates gradle tasks to that gradle project.

## Packaging

To generate AAR package files to upload the store:

```bash
./gradlew bundleDebug
./gradlew bundleRelease
```

## Installing and using the Android SDK

This target requires a separate installation of the Android SDK.
When installed with Android Studio it is usually detected directly, but you can use
the `ANDROID_SDK` environment variable, or the `sdk.dir` on the `local.properties` file.
