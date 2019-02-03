---
layout: default
title: Filters
fa-icon: fa-adjust
priority: 70
---

Views can have filters attached that change how the view and its children are displayed.

```kotlin
var View.filter: Filter? = null
```

**Table of contents:**

{::options toc_levels="1..3" /}

* TOC
{:toc}

## ComposedFilter

You can apply several filters to a view using this:

```kotlin
class ComposedFilter(val filters: List<Filter>) : Filter()
```

## IdentityFilter

This filter can be used to no apply filters at all. But serves for the subtree to be rendered in a texture.

```kotlin
object IdentityFilter : Filter()
```

## ColorMatrixFilter

```kotlin
class ColorMatrixFilter(var colorMatrix: Matrix3D, var blendRatio: Double) : Filter() {
    companion object {
        val GRAYSCALE_MATRIX = Matrix3D.fromRows(
            0.33f, 0.33f, 0.33f, 0f,
            0.59f, 0.59f, 0.59f, 0f,
            0.11f, 0.11f, 0.11f, 0f,
            0f, 0f, 0f, 1f
        )
        
        val IDENTITY_MATRIX = Matrix3D.fromRows(
            1f, 0f, 0f, 0f,
            0f, 1f, 0f, 0f,
            0f, 0f, 1f, 0f,
            0f, 0f, 0f, 1f
        )
    }
}
```

## Convolute3Filter

```kotlin
class Convolute3Filter(var kernel: Matrix3D) : Filter() {
    companion object {
        val KERNEL_GAUSSIAN_BLUR: Matrix3D
        val KERNEL_BOX_BLUR: Matrix3D
        val KERNEL_IDENTITY: Matrix3D
        val KERNEL_EDGE_DETECTION: Matrix3D
    }
}
```

## WaveFilter and PageFilter

Can be used to simulate pages from books:

```kotlin
class PageFilter(
    var hratio: Double = 0.5,
    var hamplitude0: Double = 0.0,
    var hamplitude1: Double = 10.0,
    var hamplitude2: Double = 0.0,
    var vratio: Double = 0.5,
    var vamplitude0: Double = 0.0,
    var vamplitude1: Double = 0.0,
    var vamplitude2: Double = 0.0
) : Filter()
```

```kotlin
class WaveFilter(
    var amplitudeX: Int = 10,
    var amplitudeY: Int = 10,
    var crestCountX: Double = 2.0,
    var crestCountY: Double = 2.0,
    var cyclesPerSecondX: Double = 1.0,
    var cyclesPerSecondY: Double = 1.0,
    var time: Double = 0.0
) : Filter()
```

## SwizzleColorsFilter

Serves to do component swizzling per pixel:

```kotlin
class SwizzleColorsFilter(var swizzle: String = "rgba") : Filter()
```
