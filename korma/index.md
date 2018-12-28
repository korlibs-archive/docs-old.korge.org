---
layout: default
title: "Maths: Korma"
---

<img src="/i/logos/korma.svg" width="256" height="256" alt="Mathematic Library for Kotlin" />

Korma is a mathematic library for multiplatform Kotlin 1.3 mostly focused on geometry.

[https://github.com/korlibs/korma](https://github.com/korlibs/korma)

[![Build Status](https://travis-ci.org/korlibs/korma.svg?branch=master)](https://travis-ci.org/korlibs/korma)
[![Maven Version](https://img.shields.io/github/tag/korlibs/korma.svg?style=flat&label=maven)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22korma%22)

<div style="clear: both;"></div>

**Table of contents:**

{::options toc_levels="1..3" /}

* TOC
{:toc}

## Using with gradle

Requires `Gradle 4.7` (`JVM 8~10`) for building and `Kotlin >=1.3.11` for running:

```
def kormaVersion = "1.0.0"

repositories {
    maven { url "https://dl.bintray.com/soywiz/soywiz" }
}

dependencies {
    // For multiplatform projects
    implementation "com.soywiz:korma:$kormaVersion"
    
    // For JVM/Android only
    implementation "com.soywiz:korma-jvm:$kormaVersion"
    // For JS only
    implementation "com.soywiz:korma-js:$kormaVersion"
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

### genericSort

genericSort allows to sort any array-like structure fully or partially without allocating and without having to reimplementing any sort algorithm again.
You just have to implement a `compare` and `swap` methods that receive indices
in the array to compare and optionally a `shiftLeft` method (that fallbacks to use the `swap` one). The SortOps implementation is usually an `object` to prevent allocating.

```kotlin
fun <T> genericSort(subject: T, left: Int, right: Int, ops: SortOps<T>): T
abstract class SortOps<T> {
    abstract fun compare(subject: T, l: Int, r: Int): Int
    abstract fun swap(subject: T, indexL: Int, indexR: Int)
    open fun shiftLeft(subject: T, indexL: Int, indexR: Int)
}
```

So a simple implementation that would sort any `MutableList` could be:

```kotlin
val result = genericSort(arrayListOf(10, 30, 20, 10, 5, 3, 40, 7), 0, 7, ArrayListSortOps)
assertEquals(listOf(3, 5, 7, 10, 10, 20, 30, 40), result)

object ArrayListSortOps : SortOps<ArrayList<Int>>() {
    override fun compare(subject: ArrayList<Int>, l: Int, r: Int): Int {
        return subject[l].compareTo(subject[r])
    }

    override fun swap(subject: ArrayList<Int>, indexL: Int, indexR: Int) {
        val tmp = subject[indexA]
        subject[indexA] = subject[indexB]
        subject[indexB] = tmp
    }
}
```

## Geometry

### Angle

`Angle` is an inline class backed by a `Double` that represents an angle. It can be constructed from and converted to `degrees` and `radians` and offer several utilities and operators related to angles:

```kotlin
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

### BoundsBuilder

### PointArrayList

### Rectangle, Size, Anchor, Orientation and ScaleMode

## BinPacking

## Vector

### Constructing vectors with lines and curves

### Intersection, Union, Xor, Difference, Collision Test, Growing/Shrinking

### Triangulation

### Node and Point Path Finding

### Extra: Bezier tools

## Path Finding

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

### Path finding in