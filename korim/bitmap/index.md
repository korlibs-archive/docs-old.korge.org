---
layout: default
title: "Bitmaps"
title_prefix: KorIM
fa-icon: fa-image
priority: 60
---

KorIM support several Bitmap formats and operations.

{% include toc_include.md max_level=2 %}

## `Bitmap`

`Bitmap` is an abstract class used to represent images, as a bidimensional matrix with a set of RGBA pixels.

`BmpSlice` represents a region inside a `Bitmap`.

All Bitmaps have the following immutable properties:

* `width: Int` the width of the image in pixels
* `height: Int` the height of the image in pixels
* `bpp: Int` bits per pixel for this image. For example for Bitmap32 it would be 32
* `premultiplied: Boolean` specifies if the color pixels in this image are premultiplied or not
* `backingArray: Any?` an optional array reference containing the raw pixels in the internal format of the Bitmap

You can get the area in pixels of the bitmap with `bitmap.area` (`width * height`).

You can determine if a position is inside the bitmap with `bitmap.inside(x, y)`, there is an alias called `bitmap.inBounds(x, y)`.

You can clamp your coordinates by using `bitmap.clampX(x)` and `bitmap.clampY(x)`.

You can get the linear index of a position with `bitmap.index(x, y)`.

When using Bitmaps with KorGE, you can set the mutable property `mipmaps` to instruct the engine to generate mipmaps when internally converting into a texture and uploaded to the GPU.

### Getting and setting pixels

```kotlin
// Setting a color
bitmap.setRgba(x, y, Colors.RED)
bitmap.setInt(x, y, 17) // This depends on the kind of bitmap (indexed or rgba)

// Getting a color
val color: RGBA = bitmap.getRgba(x, y)
val colorValue: Int = bitmap.getInt(x, y)
val sampledColor: RGBA = bitmap.getRgbaSampled(1.5, 1.5) // Performs linear interpolation and samples neighborhood pixels to compute the color
```

 >  Note that depending on the Bitmap implementation, reading individual pixels might be costly. For example for `Bitmap32` it is pretty fast, but for a `HtmlNativeImage` this will be slow. It is recommended to use `readPixels` and `writePixels` instead or to convert the bitmap to `Bitmap32` with `bitmap.toBMP32()`

### Reading, writing and copying blocks of pixels

To read and write with the best performance a region in the Bitmap, you can use readPixelUnsafe and writePixelUnsafe:

```kotlin
val pixels = RgbaArray(width * height)
readPixelsUnsafe(x, y, width, height, pixels, offset = 0)
writePixelsUnsafe(x, y, width, height, pixels, offset = 0)
```

If you want to copy pixels from one image to another:

```kotlin
var dst: Bitmap
bitmap.copy(srcX, srcY, dst, dstX, dstY, width, height)
```

### Locking / updating the texture in KorGE

In KorGE, the bitmap is converted into a texture, and sometimes you will want to update that Bitmap and reupload the texture. To do so, you have to lock and unlock the bitmap.

```kotlin
bitmap.lock {
    // change bitmap pixels here
}
// starting here, the texture will be reuploaded
```

### Flipping the Bitmap

You can flip your image with `bitmap.flipX()` and `bitmap.flipY()`.

### Swapping rows and columns

You can swap two rows or two columns together with:

```kotlin
bitmap.swapRows(y0, y0)
bitmap.swapColumns(x0, x0)
```

### Converting into Bitmap32

You can call the `bitmap.toBMP32()` method to convert any `Bitmap` into a `Bitmap32`, if you prefer to not create a new instance if it is already a Bitmap32, you can call `bitmap.toBMP32IfRequired()`

### Cloning, extracting and creating bitmaps with the same format

To create a bitmap with the same content you can use:

`bitmap.clone()`

To create a new empty bitmap of the same type, but with different dimensions, you can use:

```kotlin
bitmap.createWithThisFormat(newWidth, newHeight)
```

To create a new bitmap with part of the contents of the original image:

```kotlin
val newBitmap = bitmap.extract(x, y, width, height)
```

### Comparing contents

You can check if two bitmaps have exactly the same pixels by calling `bitmap.contentEquals(otherBitmap)`.

### Context2d

You can create a context2d for drawing vectors, and stuff with a HTML-like API, with:

```kotlin
bitmap.context2d { context2d ->
    // ...
}
```

### Iterating over all the positions

```kotlin
bitmap.forEach { n, x, y ->
    val pixel: RGBA = bitmap.getRgba(x, y)
    val pixel: RGBA = bitmap32.data[n]
}
```

## `BitmapIndexed`, `Bitmap1`, `Bitmap2`, `Bitmap4`, `Bitmap8`

KorIM also supports indexed bitmaps, that are bitmaps whose pixels are determined by an integer of an specific amount of bits.

```kotlin
// Getting a pixel value
val pixel: Int = bitmap[x, y] // equivalent to bitmap.getInt(x, y)
// Setting a pixel value // equivalent to bitmap.setInt(x, y, pixel)
bitmap[x, y] = pixel
```

### Constructing a new BitmapIndexed

```kotlin
val bitmap1 = Bitmap1(width, height)
val bitmap2 = Bitmap2(width, height)
val bitmap4 = Bitmap4(width, height)
val bitmap8 = Bitmap8(width, height)

// You can specify a palette with:
val bitmap = Bitmap4(width, height, palette = RgbaArray(16))

// For Bitmap8 you can use a value provider when constructing
val bitmap = Bitmap8(width, height) { x, y ->
    (x + y).toByte()
}
```

### Setting a grayscale palette:

```kotlin
// This will update the palette with a gradient from pitch black, to clear white
bitmap.setWhitescalePalette()
```

### Convert to String

By specifying a character for each possible color, you can convert a BitmapIndexed into a String like this:

```kotlin
val paletteString = ".*" // 0=. 1=*
println(bitmap1.toLines(paletteString).joinToString("\n")()
```

### Bitmap32 to Bitmap1

You can construct a Bitmap1 by using a Bitmap32 as reference, and providing a function determining if each pixel is going to be 0 (false) or 1 (true).

```kotlin
bitmap32.toBitmap1 { color: RGBA -> color.a >= 0x3F }
```

## `NativeImage`

Native image is a special type of `Bitmap` that usually represents a Bitmap in a native platform. For example in JS, it would be represented as a `<canvas>` or `<img>`, and in the JVM it would be a `BufferedImage`. Some implementations require for setting and getting the color bits to copy memory from the GPU, and that might be slow to perform pixel by pixel.

This bitmap however, when using the `Context2D`, it uses native operations for vector rendering, which is usually faster.

You can construct an empty NativeImage with:
`NativeImage(width, height)`.

## `Bitmap32`

...TO WRITE...
