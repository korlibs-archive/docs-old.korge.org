---
layout: default
title: "Bitmaps"
title_prefix: KorIM
fa-icon: fa-image
priority: 60
---

## Bitmap

`Bitmap` is an abstract class used to represent images, as a bidimensional matrix with a set of RGBA pixels.

All Bitmaps have the following properties:

* `width: Int` the width of the image in pixels
* `height: Int` the height of the image in pixels
* `bpp: Int` bits per pixel for this image. For example for Bitmap32 it would be 32
* `premultiplied: Boolean` specifies if the color pixels in this image are premultiplied or not
* `backingArray: Any?` an optional array reference containing the raw pixels in the internal format of the Bitmap

...
