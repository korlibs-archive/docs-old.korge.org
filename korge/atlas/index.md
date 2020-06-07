---
layout: default
title: Atlas
title_prefix: KorGE
fa-icon: fas fa-map
priority: 35
---

{% include toc_include.md %}

## Overview

![](/korge/atlas/atlas.png)

## Loading atlases

KorGE supports `.json`-based (array and hash) and `.xml`-based atlases.
From a `VfsFile`, you can call the `.readAtlas()` extension method.
It will detect the JSON and XML formats automatically and will read it.

So for example:
```kotlin
val atlas: Atlas = resourcesVfs["character.atlas.json"].readAtlas()
```

## Extracting images from the Atlas

You can just use the `operator fun get` to access individual images

```kotlin
val image: BmpSlice = atlas["image.png"]
```

You can access the list of available entries with:

```kotlin
val entries: List<Atlas.Entry> = atlas.entries
```

## Automatic atlas generation

KorGE build system gradle plugin, support generating atlases from
a set of images directly. Just create a file with the `.atlas` extension
in your resources folder. In that file you have to place a folder name
whose images will be included in the atlas.

## Extract several `SpriteAnimation` from an Atlas

You can use atlases to store one or several animations.
KorGE allows you to build `SpriteAnimation` from an Atlas easily
either from all the frames in the atlas, or just with a subset.

```kotlin
val animation1 = atlas.getSpriteAnimation() // Includes all the images
val animation2 = atlas.getSpriteAnimation("RunRight") // Includes the images starting with RunRight 
val animation3 = atlas.getSpriteAnimation(Regex("beam\\d+.png")) // Includes the images starting with beam, following a number and ending with .png
```

