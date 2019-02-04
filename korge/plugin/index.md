---
layout: default
title: "Plugins"
fa-icon: fa-plug
priority: 900
status: incomplete
---

You can create KorGE plugins by creating a multiplatform artifact and creating a `.korge-plugin` file along the artifact and your `.pom`:

You have an example here: <https://github.com/korlibs/korge/blob/master/korge-admob/build.gradle.kts>

```kotlin
afterEvaluate {
    extensions.getByType<PublishingExtension>().apply {
        val publication = publications["kotlinMultiplatform"] as MavenPublication
        publication.artifact(File(buildDir, "korge-plugin.korge-plugin").apply {
            val node = Node(null, "korge-plugin").apply {
                appendNode("name").setValue("korge-admob")
                appendNode("version").setValue(version)
                appendNode("variables", mapOf("ADMOB_APP_ID" to "string"))
                appendNode("android").apply {
                    appendNode("init", mapOf("require" to "ADMOB_APP_ID")).setValue("try { com.google.android.gms.ads.MobileAds.initialize(com.soywiz.korio.android.androidContext(), \"\${ADMOB_APP_ID}\") } catch (e: Throwable) { e.printStackTrace() }")
                    appendNode("manifest-application", mapOf("require" to "ADMOB_APP_ID")).setValue("<meta-data android:name=\"com.google.android.gms.ads.APPLICATION_ID\" android:value=\"\${ADMOB_APP_ID}\" />")
                    
                    appendNode("dependencies").apply {
                        appendNode("dependency", mapOf("require" to "ADMOB_APP_ID")).setValue("com.google.android.gms:play-services-ads:$playServicesVersion")
                    }
                }
                appendNode("cordova").apply {
                    appendNode("plugins").apply {
                        appendNode("cordova-plugin-admob-free", mapOf("ADMOB_APP_ID" to "\${ADMOB_APP_ID}"))
                    }
                }
            }
            writeText(XmlUtil.serialize(node))
        })
    }
}
```

This file helps KorGE to identify what kind of things has to do at compile-time with Android or Cordova, in addition to which variables does the plugin need
to work properly.
