---
layout: default
title: "DragonBones"
fa-icon: fa-child
---

You can use DragonBones by adding the dependency:

```kotlin
dependencies {
    commonMainApi "com.soywiz:korge-dragonbones:$korgeVersion"
}
```

## Using in code

```kotlin
val factory = KorgeDbFactory()
factory.parseDragonBonesData(Json.parse(resourcesVfs["Dragon/Dragon_ske.json"].readString())!!)
factory.parseTextureAtlasData(
    Json.parse(resourcesVfs["Dragon/Dragon_tex.json"].readString())!!,
    resourcesVfs["Dragon/Dragon_tex.png"].readBitmapOptimized().toBMP32()
)
val armatureDisplay = factory.buildArmatureDisplay(armatureName = "Dragon", dragonBonesName = "Dragon")!!.position(100, 100)
```

The ArmatureDisplay is a view that can be attached to any container.
Also it contains the `armature` and the `animation` so you can apply animations to it.

```kotlin
class KorgeDbArmatureDisplay : Container(), IArmatureProxy {
    // ...
    val armature: Armature
    val animation: Animation

}
```