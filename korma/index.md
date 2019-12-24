---
layout: default
hide_title: true
title: "KorMA"
fa-icon: fa-calculator
priority: 50
---

<img src="/i/logos/korma.svg" width="128" height="128" alt="Mathematic Library for Kotlin" style="float:left; margin: 0 16px 16px 0;" />

Korma is a mathematic library for multiplatform Kotlin 1.3 mostly focused on geometry.

[https://github.com/korlibs/korma](https://github.com/korlibs/korma)

[![Build Status](https://travis-ci.org/korlibs/korma.svg?branch=master)](https://travis-ci.org/korlibs/korma)
[![Maven Version](https://img.shields.io/github/tag/korlibs/korma.svg?style=flat&label=maven)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22korma%22)

<div style="clear: both;"></div>

**Table of contents:**

{::options toc_levels="1..3" /}

* TOC
{:toc}
{:.multicolumn}

## Using with gradle

Requires `Gradle 4.7` (`JVM 8~10`) for building and `Kotlin >=1.3.11` for running:

```
def kormaVersion = "1.9.1"

repositories {
    maven { url "https://dl.bintray.com/korlibs/korlibs" }
}

dependencies {
    // For multiplatform projects
    implementation "com.soywiz:korma:$kormaVersion"
    
    // For JVM/Android only
    implementation "com.soywiz:korma-jvm:$kormaVersion"
    // For JS only
    implementation "com.soywiz:korma-js:$kormaVersion"
}

// Additional funcionality using Clipper and poly2try code (with separate licenses):
// - https://github.com/korlibs/korma/blob/master/korma-shape-ops/LICENSE
// - https://github.com/korlibs/korma/blob/master/korma-triangulate-pathfind/LICENSE
dependencies {
    implementation "com.soywiz:korma-shape-ops:$kormaVersion"
    implementation "com.soywiz:korma-triangulate-pathfind:$kormaVersion"
}

// settigs.gradle
enableFeaturePreview('GRADLE_METADATA')
```

## Math utils

### Clamping

```kotlin
fun Long.clamp(min: Long, max: Long): Long
fun Int.clamp(min: Int, max: Int): Int
fun Double.clamp(min: Double, max: Double): Double
fun Float.clamp(min: Float, max: Float): Float
```

### Interpolation

Korma defines two interfaces for interpolable classes and provides several extension methods for `Double` (the ratio between 0 and 1) to interpolate several kind of types.

```kotlin
interface Interpolable<T> {
    fun interpolateWith(ratio: Double, other: T): T
}

interface MutableInterpolable<T> {
    fun setToInterpolated(ratio: Double, l: T, r: T): T
}

fun <T> Double.interpolateAny(min: T, max: T): T
fun Double.interpolate(l: Float, r: Float): Float
fun Double.interpolate(l: Double, r: Double): Double
fun Double.interpolate(l: Int, r: Int): Int
fun Double.interpolate(l: Long, r: Long): Long
fun <T> Double.interpolate(l: Interpolable<T>, r: Interpolable<T>): T
fun <T : Interpolable<T>> Double.interpolate(l: T, r: T): T
```

### Easing

Korma defines some standard Easing functions and a way to include additional easing functions and combine them.

```kotlin
interface Easing {
    operator fun invoke(it: Double): Double

    companion object {
        operator fun invoke(f: (Double) -> Double) = object : Easing

        fun cubic(f: (t: Double, b: Double, c: Double, d: Double) -> Double): Easing
        fun combine(start: Easing, end: Easing): Easing

        val SMOOTH: Easing
        val EASE_IN_ELASTIC: Easing
        val EASE_OUT_ELASTIC: Easing
        val EASE_OUT_BOUNCE: Easing
        val LINEAR: Easing
        val EASE_IN: Easing
        val EASE_OUT: Easing
        val EASE_IN_OUT: Easing
        val EASE_OUT_IN: Easing
        val EASE_IN_BACK: Easing
        val EASE_OUT_BACK: Easing
        val EASE_IN_OUT_BACK: Easing
        val EASE_OUT_IN_BACK: Easing
        val EASE_IN_OUT_ELASTIC: Easing
        val EASE_OUT_IN_ELASTIC: Easing
        val EASE_IN_BOUNCE: Easing
        val EASE_IN_OUT_BOUNCE: Easing
        val EASE_OUT_IN_BOUNCE: Easing
        val EASE_IN_QUAD: Easing
        val EASE_OUT_QUAD: Easing
        val EASE_IN_OUT_QUAD: Easing
        val EASE_SINE: Easing
    }
}
```

## Geometry

### Angle

`Angle` is an inline class backed by a `Double` that represents an angle and that can give additional type safety and semantics to code. It can be constructed from and converted to `degrees` and `radians` and offer several utilities and operators related to angles:

```kotlin
inline class Angle(val radians: Double)

fun cos(angle: Angle): Double
fun sin(angle: Angle): Double
fun tan(angle: Angle): Double

inline val Number.degrees: Angle
inline val Number.radians: Angle

val Angle.degrees: Double
val Angle.radians: Double

val Angle.normalized: Angle
```

### Point and Matrix

`Point` and `Matrix` are classes holding doubles (to get consistency among targets including JavaScript) that represent a 2D Point (with x and y) and a 2D Affine Transform Matrix (with a, b, c, d, tx and ty).

### Vector3D and Matrix3D

`Vector3D` and `Matrix3D` are vectors and matrices of 4 components / 4 rows and 4 columns. They can also be used as 2, 3 and 4 component vectors, and 2x2, 3x3 and 4x4 matrices.

### BoundsBuilder

`BoundsBuilder` is a class that allows to compute the bounds of a set of points without additional allocations.

```kotlin
class BoundsBuilder {
    fun reset()
    fun add(x: Double, y: Double): BoundsBuilder
    fun getBounds(out: Rectangle = Rectangle()): Rectangle
}

inline fun BoundsBuilder.add(x: Number, y: Number)
fun BoundsBuilder.add(p: IPoint)
fun BoundsBuilder.add(ps: Iterable<IPoint>)
fun BoundsBuilder.add(ps: IPointArrayList)
fun BoundsBuilder.add(rect: Rectangle)
```

### PointArrayList

`PointArrayList` and `PointIntArrayList` can be used to store a list of points (pair of numbers) without allocating objects per element. You can later access x and y components with `getX` and `getY` or convert them into a list of `Point` for convenience that actually allocate objects.

```kotlin
class PointArrayList(capacity: Int = 7) {
    constructor(capacity: Int = 7, callback: PointArrayList.() -> Unit)
    constructor(points: List<IPoint>): PointArrayList
    constructor(vararg points: IPoint): PointArrayList

    val size: Int
    fun isEmpty(): Boolean
    fun isNotEmpty(): Boolean
    fun add(x: Double, y: Double)
    fun getX(index: Int)
    fun getY(index: Int)

    fun setX(index: Int, x: Double)
    fun setY(index: Int, y: Double)
    fun setXY(index: Int, x: Double, y: Double)
    fun reverse()
    fun sort()
}

fun PointArrayList.getPoint(index: Int): Point
fun PointArrayList.toPoints(): List<Point>
inline fun IPointArrayList.contains(x: Number, y: Number): Boolean

inline fun PointArrayList.add(x: Number, y: Number)
fun PointArrayList.add(p: Point)
fun PointArrayList.add(other: PointArrayList)
inline fun PointArrayList.setX(index: Int, x: Number)
inline fun PointArrayList.setY(index: Int, y: Number)
inline fun PointArrayList.setXY(index: Int, x: Number, y: Number)
```
### Rectangle, Size, Anchor, Orientation and ScaleMode

```kotlin
data class Rectangle(
    var x: Double, var y: Double,
    var width: Double, var height: Double
) : MutableInterpolable<Rectangle>, Interpolable<Rectangle>, IRectangle, Sizeable

inline class Size(val p: Point) : MutableInterpolable<Size>, Interpolable<Size>, ISize, Sizeable

data class Anchor(val sx: Double, val sy: Double) : Interpolable<Anchor>

enum class Orientation(val value: Int) { CW(+1), CCW(-1), COLLINEAR(0) }

class ScaleMode {
    operator fun invoke(item: Size, container: Size, target: Size = Size()): Size

    companion object {
        val COVER: ScaleMode
        val SHOW_ALL: ScaleMode
        val EXACT: ScaleMode
        val NO_SCALE: ScaleMode
    }
}
```

As a sample combining most of these entities:

```kotlin
assertEquals(
    Rectangle(0, -150, 600, 600),
    Size(100, 100).applyScaleMode(
        Rectangle(0, 0, 600, 300),
        ScaleMode.COVER,
        Anchor.MIDDLE_CENTER
    )
)
```

## BinPacker

`BinPacker` allows to place rectangles thighly packed without overlapping in a reduced space.
A popular use case is generating atlases; packing several smaller images in a texture
either at compilation time, or dynamically at runtime.

```kotlin
val packer = BinPacker(100, 100)
val result = packer.addBatch(listOf(Size(20, 10), Size(10, 30), Size(100, 20), Size(20, 80)))
assertEquals(
    "[Rectangle(x=20, y=50, width=20, height=10), Rectangle(x=20, y=20, width=10, height=30), Rectangle(x=0, y=0, width=100, height=20), Rectangle(x=0, y=20, width=20, height=80)]",
    result.toString()
)
```

## Vector

Korma provide several vectorial capabilities to generate all kind of vectorial shapes formed from lines, polygons and curves.

### Constructing vectors with lines and curves

The basic classes for vector building are `VectorPath` and `VectorBuilder`.
They do not include color information, but just the vector shape.
You can make other classes to implement the `VectorBuilder` interface by delegation to for example provide a Context2D-like interface with filling and stroking including all the extension methods provided.

```kotlin
open class VectorPath(
    val commands: IntArrayList = IntArrayList(),
    val data: DoubleArrayList = DoubleArrayList(),
    val winding: Winding = Winding.EVEN_ODD
) : VectorBuilder

interface VectorBuilder {
    val totalPoints: Int
    val lastX: Double
    val lastY: Double
    fun moveTo(x: Double, y: Double)
    fun lineTo(x: Double, y: Double)
    fun quadTo(cx: Double, cy: Double, ax: Double, ay: Double)
    fun cubicTo(cx1: Double, cy1: Double, cx2: Double, cy2: Double, ax: Double, ay: Double)
    fun close()
}
```

Extension methods using the basic interface:

```kotlin
fun VectorBuilder.isEmpty(): Boolean
fun VectorBuilder.isNotEmpty(): Boolean

fun VectorBuilder.arcTo(ax: Double, ay: Double, cx: Double, cy: Double, r: Double)
fun VectorBuilder.rect(x: Double, y: Double, width: Double, height: Double)
fun VectorBuilder.rectHole(x: Double, y: Double, width: Double, height: Double)
fun VectorBuilder.roundRect(x: Double, y: Double, w: Double, h: Double, rx: Double, ry: Double = rx)
fun VectorBuilder.arc(x: Double, y: Double, r: Double, start: Double, end: Double)
fun VectorBuilder.circle(x: Double, y: Double, radius: Double)
fun VectorBuilder.ellipse(x: Double, y: Double, rw: Double, rh: Double)
fun VectorBuilder.moveTo(p: Point)
fun VectorBuilder.lineTo(p: Point)
fun VectorBuilder.quadTo(c: Point, a: Point)
fun VectorBuilder.cubicTo(c1: Point, c2: Point, a: Point)

inline fun VectorBuilder.moveTo(x: Number, y: Number)
inline fun VectorBuilder.lineTo(x: Number, y: Number)
inline fun VectorBuilder.quadTo(controlX: Number, controlY: Number, anchorX: Number, anchorY: Number)
inline fun VectorBuilder.cubicTo(cx1: Number, cy1: Number, cx2: Number, cy2: Number, ax: Number, ay: Number)

inline fun VectorBuilder.moveToH(x: Number)
inline fun VectorBuilder.rMoveToH(x: Number)

inline fun VectorBuilder.moveToV(y: Number)
inline fun VectorBuilder.rMoveToV(y: Number)

inline fun VectorBuilder.lineToH(x: Number)
inline fun VectorBuilder.rLineToH(x: Number)

inline fun VectorBuilder.lineToV(y: Number)
inline fun VectorBuilder.rLineToV(y: Number)

inline fun VectorBuilder.rMoveTo(x: Number, y: Number)
inline fun VectorBuilder.rLineTo(x: Number, y: Number)

inline fun VectorBuilder.rQuadTo(cx: Number, cy: Number, ax: Number, ay: Number)
inline fun VectorBuilder.rCubicTo(cx1: Number, cy1: Number, cx2: Number, cy2: Number, ax: Number, ay: Number)
inline fun VectorBuilder.arcTo(ax: Number, ay: Number, cx: Number, cy: Number, r: Number)
inline fun VectorBuilder.rect(x: Number, y: Number, width: Number, height: Number)
inline fun VectorBuilder.rectHole(x: Number, y: Number, width: Number, height: Number)
inline fun VectorBuilder.roundRect(x: Number, y: Number, w: Number, h: Number, rx: Number, ry: Number = rx)
inline fun VectorBuilder.arc(x: Number, y: Number, r: Number, start: Number, end: Number)
inline fun VectorBuilder.circle(x: Number, y: Number, radius: Number)
inline fun VectorBuilder.ellipse(x: Number, y: Number, rw: Number, rh: Number)
```

You can also determine if a point is contained inside a `VectorPath`:

```kotlin
fun VectorPath.containsPoint(x: Double, y: Double): Boolean
```

### Shape2d

Several algorithms require to work with simple straight segments.
Korma provides a Shape2d set of classes to describe shapes.

You can convert a `VectorPath` to a `Shape2d` using the `toShape2d` extension method:

```kotlin
val shape = VectorPath {
    moveTo(0, 0)
    lineTo(100, 0)
    lineTo(100, 100)
    close()
}.toShape2d()
```

### Shape2d: Intersection, Union, Xor, Difference, Collision Test, Growing/Shrinking

Korma provides a separate artifact called `korma-shape-ops` that includes a Kotlin port of the `Clipper` library integrated with the `Shape2D` API.
It provides boolean methods to operate with two paths.

```kotlin
infix fun Shape2d.collidesWith(other: Shape2d): Boolean

infix fun Shape2d.intersection(other: Shape2d): Shape2d
infix fun Shape2d.union(other: Shape2d): Shape2d
infix fun Shape2d.xor(other: Shape2d): Shape2d
infix fun Shape2d.difference(other: Shape2d): Shape2d

operator fun Shape2d.plus(other: Shape2d): Shape2d
operator fun Shape2d.minus(other: Shape2d): Shape2d

fun Shape2d.extend(size: Double, cap: VectorPath.LineCap = VectorPath.LineCap.ROUND): Shape2d
fun Shape2d.extendLine(size: Double, join: VectorPath.LineJoin = VectorPath.LineJoin.SQUARE, cap: VectorPath.LineCap = VectorPath.LineCap.SQUARE): Shape2d 
```

### Shape2d: Triangulation and Triangulation-based Node and Point Path Finding

Korma provides a separate artifact called `korma-triangulate-pathfind` to do triangulation and triangulation-based path finding.

Triangulating a set of polygons (or curves too after converting them into polygons with `toShape2d`) has several use cases like drawing a vectorial shape into the GPU, doing physics or doing path finding.

To triangulate a set of points, a `Shape2d` or a `VectorPath`:

```kotlin
fun List<IPoint>.triangulate(): List<Triangle>
fun Shape2d.triangulate(): List<List<Triangle>>
fun Shape2d.triangulateFlat(): List<Triangle>
fun VectorPath.triangulate(): List<List<Triangle>>
fun VectorPath.triangulateFlat(): List<Triangle>

```

For pathfinding:

```kotlin
fun List<Triangle>.toSpatialMesh(): SpatialMesh
fun List<Triangle>.pathFind(): SpatialMeshFind
fun SpatialMeshFind.funnel(p0: IPoint, p1: IPoint): List<IPoint>
fun List<Triangle>.funnel(p0: IPoint, p1: IPoint): List<IPoint>
fun List<Triangle>.pathFind(p0: IPoint, p1: IPoint): List<IPoint>
fun Shape2d.toSpatialMesh(): SpatialMesh
fun Shape2d.pathFind(): SpatialMeshFind
fun Shape2d.pathFind(p0: IPoint, p1: IPoint): List<IPoint>
```

Additionally this library allows to compute the area of Shape2d by doing triangulation:

```kotlin
val Shape2d.area: Double
```

### Extra: Bezier tools

Korma provides a `Bezier` object with several methods to compute in a bezier curve (quadratic and cubic) their points, their length or their bounds.

## Path Finding

Usually in games you might want to find the shortest path between two points.

### AStar (A*)

Korma includes an AStar implementation to find paths in bidimensional grids.

```kotlin
val points = AStar.find(
    board = Array2("""
        .#....
        .#.##.
        .#.#..
        ...#..
    """) { c, x, y -> c == '#' },
    x0 = 0,
    y0 = 0,
    x1 = 4,
    y1 = 2,
    findClosest = false
)
println(points)
// [(0, 0), (0, 1), (0, 2), (0, 3), (1, 3), (2, 3), (2, 2), (2, 1), (2, 0), (3, 0), (4, 0), (5, 0), (5, 1), (5, 2), (4, 2)]
```

### Path finding in vectors and polygons

Check the **Shape2d: Triangulation-based Node and Point Path Finding** section.