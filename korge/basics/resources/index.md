---
layout: default
title: Resources
fa-icon: fa-archive
---

KorGE uses the [Virtual File Systems from Korio](/korio/) to load resources from different sources,
and its most basic resources are [Bitmaps from KorIM](/korim/) and [Sounds from KorAU](/korau/).
But it can also load bitmap fonts, tiled maps, etc.

## resourcesVfs

KorIO offers a `resourcesVfs` global property that holds a Virtual File System that include the
files from `src/commonMain/resources` in all the targets.

## Bitmaps

You can read bitmaps with:

```kotlin
resourcesVfs["relative/path/to/image.png"].readBitmap()
```

All the targets support at least `PNG` and `JPEG` bitmap loading.

## Sound and Music

You can read sound files with:

```kotlin
resourcesVfs["relative/path/to/sound.mp3"].readSound()
```
