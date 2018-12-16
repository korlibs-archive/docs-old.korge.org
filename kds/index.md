---
layout: default
title: Kds
hide_title: true
permalink: /kds/
---

<img src="/i/logos/kds.svg" width="196" height="196" style="float: left;margin: 0 16px 16px 0;" alt="Data Structures" />

Kds is a Date Structure library for Multiplatform Kotlin 1.3.


[https://github.com/korlibs/kds](https://github.com/korlibs/kds)

[![Build Status](https://travis-ci.org/korlibs/kds.svg?branch=master)](https://travis-ci.org/korlibs/kds)
[![Maven Version](https://img.shields.io/github/tag/korlibs/kds.svg?style=flat&label=maven)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22kds%22)

<div style="clear: both;"></div>

**Table of contents:**

{::options toc_levels="1..2" /}

* TOC
{:toc}

## Using with gradle

Requires `Gradle 4.7` (`JVM 8~10`) for building and `Kotlin >=1.3.11` for running:

```
def kdsVersion = "1.0.0"

repositories {
    maven { url "https://dl.bintray.com/soywiz/soywiz" }
}

dependencies {
    // For multiplatform projects
    implementation "com.soywiz:kds:$kdsVersion"
    
    // For JVM/Android only
    implementation "com.soywiz:kds-jvm:$kdsVersion"
    // For JS only
    implementation "com.soywiz:kds-js:$kdsVersion"
}

// settigs.gradle
enableFeaturePreview('GRADLE_METADATA')
```

## ArrayList: `IntArrayList`, `FloatArrayList` and `DoubleArrayList`
{: #ArrayList }

Kds provides specialized equivalents of `ArrayList` so it doesn't involve object allocation through boxing. It uses typed arrays internally to store the elements of the ArrayList so it just requires one additional object allocation per list (the `Array`). It will just allocate a new object when the capacity of the list is exhausted.

### *arrayListOf

You can construct literals using the `*arrayListOf` constructors:

```kotlin
val ilist = intArrayListOf(10, 20)
val flist = floatArrayListOf(10f, 20f)
val dlist = doubleArrayListOf(10.0, 20.0)
```

### Expected behaviour

`IntArrayList`, `FloatArrayList` and `DoubleArrayList` work like a normal `ArrayList` but without incurring into boxing.

```kotlin
val list = IntArrayList()
list += 10
list += 20
list[0] = 15
println(list[0])
println(list.toList().map { it * 20 })
println(list.getCyclic(-1))
```

### Optimized collection transformations

`mapInt`, `mapFloat` and `mapDouble` generate optimized `*ArrayList`. And `*ArrayList` have an specialized `filter` function too.

```kotlin
val filter = (0 until 10).mapInt { it * 3 }.filter { it % 2 == 0 }
```

## Array2: `Array2`, `IntArray2`, `FloatArray2`, `DoubleArray2`
{: #Array2 }

Array2 is a bidimensional version of Array variants. It includes a `width` and a `height` instead of size (length) measuing its dimensions.

It provides bidimensional indexers and some convenience methods.

```kotlin
val biarray = IntArray2(64, 64) { 0 }
val biarray = IntArray2(64, 64, 0)
biarray[0, 0] = 1
biarray.width == 64
biarray.height == 64
```

Internally it is represented as a single 1D Array and actual indices are computed using simple arithmetic.

## BitSet
{: #BitSet }

`BitSet` structure that works like a `BoolArray` but it is more efficient in terms of memory usage.

```kotlin
val array = BitSet(100) // Stores 100 bits
array[99] = true
val bool: Boolean = array[99]
```

It packs bits in an `IntArray` internally so it requires up to eight times less space than a BoolArray that potentially uses internally a ByteArray.

## CacheMap
{: #CacheMap }

Works like a `LinkedHashMap` with a limited amount of elements. When inserting new elements after reaching the maximum amount of elements, the oldest element inserted is deleted.

```kotlin
val cache = CacheMap<String, Int>(maxSize = 2)
cache["a"] = 1
cache["b"] = 2
cache["c"] = 3
assertEquals("{b=2, c=3}", cache.toString())
```

## CaseInsensitiveStringMap
{: #CaseInsensitiveStringMap }

Map with `String` keys considered case insensitive. Case of the original keys is preserved, but keys can be accessed with any case.

```kotlin
val map = CaseInsensitiveStringMap("hELLo" to 1, "World" to 2)
assertEquals(2, map.size)
assertEquals(1, map["hello"])
assertEquals(2, map["world"])
```

It is possible to convert a normal `Map<String, *>` to a CaseInsensitive one with the `toCaseInsensitiveMap` extension:

```kotlin
val map = mapOf("hELLo" to 1, "World" to 2).toCaseInsensitiveMap()
```

## Deque/CircularList: `Deque`, `ByteDeque`, `IntDeque`, `FloatDeque`, `DoubleDeque`
{: #Deque }

`Deque` variants (and its `CircularList` typealias) allows to insert and delete elements to/from the start or the end of the deque in constant time except when growing the collection. It can be used to implement queues or produce/consumers in an efficient way. The typed variants allow to reduce memory and allocation usage.

```kotlin
val l = IntDeque()
for (n in 0 until 1000) l.addFirst(n)
for (n in 0 until 1000) l.removeFirst()
for (n in 0 until 1000) l.addLast(n)
```

## FastMap: `FastIntMap`, `FastStringMap`
{: #FastMap }

Simpler Map-like structures that uses native specific implementations to improve performance and reduce allocations.

## IntMap: `IntMap`, `IntIntMap`, `IntFloatMap`
{: #IntMap }

Variants of a hashmap implementation using int as keys without boxing (and Object, int or float for values). The implementation requires just a couple of arrays for working (no nodes at all). It uses a multihash approach for filling as much as possible with a logarithmic stash. Just allocates when growing.

## IntSet
{: #IntSet }

A set working with integers without boxing.

## ListReader
{: #ListReader }

A reader for lists.

## Pool
{: #Pool }

A simple pool implementation allowing to preallocate, to reset objects and to temporally allocate (freeing automatically) using an inline function.

## PriorityQueue: `PriorityQueue`, `IntPriorityQueue`, `FloatPriorityQueue`, `DoublePriorityQueue`
{: #PriorityQueue }

Provides a PriorityQueue that allows to insert items in a Queue by priority.

## Queue: `Queue`, `IntQueue`, `FloatQueue`, `DoubleQueue`
{: #Queue }

Kds provides a stack and a queue implementation and variants for Int and Double.

Stack, IntStack, DoubleStack
Queue, IntQueue, DoubleQueue
Stack uses a simple ArrayList or Int/Double variants. While Queue uses an efficient CircularList.

## Stack: `Stack`, `IntStack`, `FloatStack`, `DoubleStack`
{: #Stack }

Kds provides a stack and a queue implementation and variants for Int and Double.

Stack, IntStack, DoubleStack
Queue, IntQueue, DoubleQueue
Stack uses a simple ArrayList or Int/Double variants. While Queue uses an efficient CircularList.

## WeakMap
{: #WeakMap }

Provides a WeakMap data structure that internally uses JS's WeakMap and/or JVM's WeakHashMap. WeakProperty allow to define external/extrinsic properties to objects that are collected once the object is not referenced anymore.

## MapList extensions
{: #MapList }

## `genericBinarySearch` and `mapWhile`
{: #genericBinarySearch }

## Property Delegates: `Extra.Property`, `Computed`, `WeakProperty`
{: #Delegates }

### Extra

Provides a Extra funtionality to define extrinsic properties to an object that has been decorated with Extra interface implemented by Extra.Mixin. It just adds a extra hashmap to the object, so it can be used to externally define properties. The idea is similar to WeakProperty but doesn't require weak references at all. But just works with objects that implements Extra interface.

### Computed

### WeakProperty
