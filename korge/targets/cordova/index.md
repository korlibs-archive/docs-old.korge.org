---
layout: default
title: "Cordova (Legacy)"
fa-icon: fa-mobile
priority: 10
#status: new
---

Before Kotlin/Native was being stable, and proper iOS target was created,
KorGE supported Apache Cordova using the Kotlin/JS target.

Now Cordova **<u>is disabled by default</u>** to avoid confusion, but you can still
enable it.

## Enabling Cordova targets

You have to Opt-In to be able to use Cordova targets. You can do it by adding
this to your `gradle.properties` file:

```properties
enable.cordova.targets=true
```


