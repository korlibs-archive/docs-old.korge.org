---
layout: default
title: Kds
hide_title: true
permalink: /kds/
fa-icon: fa-tree
priority: 20
---

<img src="/i/logos/kds.svg" width="196" height="196" style="float: left;margin: 0 16px 16px 0;" alt="Data Structures" />

Kds is a Data Structure library for Multiplatform Kotlin 1.3.


[https://github.com/korlibs/kds](https://github.com/korlibs/kds)

[![Build Status](https://travis-ci.org/korlibs/kds.svg?branch=master)](https://travis-ci.org/korlibs/kds)
[![Maven Version](https://img.shields.io/github/tag/korlibs/kds.svg?style=flat&label=maven)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22kds%22)

<div style="clear: both;"></div>

**Table of contents:**

{::options toc_levels="1..2" /}

* TOC
{:toc}
{:.multicolumn}

## Using with gradle

Requires `Gradle 4.7` (`JVM 8~10`) for building and `Kotlin >=1.3.11` for running:

```
def kdsVersion = "1.9.2"

repositories {
    maven { url "https://dl.bintray.com/korlibs/korlibs" }
}

dependencies {
    // For multiplatform projects
    implementation "com.soywiz.korlibs.kds:kds:$kdsVersion"
    
    // For JVM/Android only
    implementation "com.soywiz.korlibs.kds:kds-jvm:$kdsVersion"
    // For JS only
    implementation "com.soywiz.korlibs.kds:kds-js:$kdsVersion"
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

```kotlin
val map = FastIntMap<String>()
assertEquals(0, map.size)
map[1] = "a"
map[2] = "b"
assertEquals(listOf(1, 2), map.keys.sorted())
assertEquals(2, map.size)
assertEquals("a", map[1])
assertEquals("b", map[2])
assertEquals(null, map[3])
```


## IntMap: `IntMap`, `IntIntMap`, `IntFloatMap`
{: #IntMap }

Variants of a hashmap implementation using int as keys without boxing (and Object, int or float for values). The implementation requires just a couple of arrays for working (no nodes at all). It uses a multihash approach for filling as much as possible with a logarithmic stash. Just allocates when growing.

```kotlin
val m = IntIntMap()
m[0] = 98
assertEquals(1, m.size)
assertEquals(98, m[0])
assertEquals(0, m[1])
```

## IntSet
{: #IntSet }

A set working with integers without boxing.

```kotlin
val set = intSetOf(1, 2, 4)
assertEquals(3, set.size)

assertEquals(true, 1 in set)
assertEquals(true, 2 in set)
assertEquals(false, 3 in set)
assertEquals(true, 4 in set)

set.remove(2)
assertEquals(2, set.size)
assertEquals(true, 1 in set)
assertEquals(false, 2 in set)
assertEquals(true, 4 in set)
```

## ListReader
{: #ListReader }

A reader for lists. It can `peek`, `read` or `expect` a specific value in order.

```kotlin
val reader = listOf(1, 2, 3).reader()
assertEquals(true, reader.hasMore)
assertEquals(1, reader.peek())
assertEquals(1, reader.peek())
assertEquals(1, reader.read())
assertEquals(2, reader.read())
assertEquals(3, reader.expect(3))
assertEquals(false, reader.hasMore)
```

## Pool
{: #Pool }

A simple pool implementation allowing to preallocate, to reset objects and to temporally allocate (freeing automatically) using an inline function.
It accepts an instance allocator, and an optional function to reset instances.

```kotlin
val pool = Pool { Demo() }
pool.alloc { demo ->
    println("Temporarilly allocated $demo")
}
```

```kotlin
val pool = Pool(reset = {
    totalResetCount++
    it.x = 0
    it.y = 0
},  gen = {
    totalAllocCount++
    Demo()
})
val a = pool.alloc()
val b = pool.alloc()

assertEquals(0, pool.itemsInPool)
pool.free(c)
assertEquals(1, pool.itemsInPool)
pool.free(b)

pool.alloc {
    assertEquals(1, pool.itemsInPool)
}
assertEquals(2, pool.itemsInPool)

assertEquals(5, totalResetCount) // Number of resets
assertEquals(3, totalAllocCount) // Number of allocs
```

## PriorityQueue: `PriorityQueue`, `IntPriorityQueue`, `FloatPriorityQueue`, `DoublePriorityQueue`
{: #PriorityQueue }

Provides a PriorityQueue that allows to insert items in a Queue by priority. It allows reordering specific items after modification.

```kotlin
val pq = IntPriorityQueue()
pq.add(10)
pq.add(15)
pq.add(5)
assertEquals(5, pq.removeHead())
assertEquals(10, pq.removeHead())
assertEquals(15, pq.removeHead())
assertEquals(0, pq.size)
```

Allows to provide a custom `Comparator`:

```kotlin
val pq = IntPriorityQueue { a, b -> (-a).compareTo(-b) }
pq.addAll(listOf(1, 2, 3, 4))
assertEquals(listOf(4, 3, 2, 1), pq.toList())
```

And to repriorize objects after modification:

```kotlin
val item = Item(10)
pq.add(item)
item.value = 20
pq.updateObject(item)
```

It is implemented using a Min Heap so addition, removing and updating happens in *O(log(n))*.

## Queue: `Queue`, `IntQueue`, `FloatQueue`, `DoubleQueue`
{: #Queue }

A FIFO (First In First Out) collection.

```kotlin
val queue = IntQueue()
queue.enqueue(1)
queue.enqueue(2)
assertEquals(1, queue.dequeue())
```

Internally implemented using a `Deque`.

## Stack: `Stack`, `IntStack`, `FloatStack`, `DoubleStack`
{: #Stack }

A LIFO (Last In First Out) collection.

```kotlin
val queue = IntStack()
queue.push(1)
queue.push(2)
assertEquals(2, queue.pop())
```

Internally implemented using an `ArrayList`.

## WeakMap
{: #WeakMap }

Provides a WeakMap data structure that internally uses JS's `WeakMap`, JVM's `WeakHashMap` and Native's `WeakReference`. WeakProperty allow to define external/extrinsic properties to objects that are collected once the object is not referenced anymore.

```kotlin
val map = WeakMap<Demo, String>()
val demo1 = Demo()
map[demo1] = "hello"

assertEquals("hello", map[demo1])
```

Note that using this primitive on JavaScript requires ES6 support (and it doesn't work on IE10 or lower). Check the [JS's WeakMap compatibility table](https://kangax.github.io/compat-table/es6/#test-WeakMap) for more information.
{: .note }

## MapList extensions
{: #MapList }

Instead of providing a `MutableMap<K, MutableList<V>>` implementation. Kds provides a set of methods and extension methods to easily work with those kind of maps.

```kotlin
val map = linkedHashMapListOf("a" to 10, "a" to 20, "b" to 30)

assertEquals(10, map.getFirst("a"))
assertEquals(20, map.getLast("a"))

assertEquals(30, map.getFirst("b"))
assertEquals(30, map.getLast("b"))

assertEquals(null, map.getLast("c"))

assertEquals(listOf("a" to 10, "a" to 20, "b" to 30), map.flatten())
```

## binarySearch: `genericBinarySearch`, `binarySearch`
{: #genericBinarySearch }

Kds provides binarySearch for its collections limiting the indices used. Also provides a `genericBinarySearch` to execute the algorithm in any possible kind of collection. It allows to get exact possitions or nearest positionss when no value is found:

```kotlin
val v = intArrayOf(10, 20, 30, 40, 50)
assertEquals(0, v.binarySearch(10).index)
assertEquals(1, v.binarySearch(20).index)
assertEquals(2, v.binarySearch(30).index)
assertEquals(3, v.binarySearch(40).index)
assertEquals(4, v.binarySearch(50).index)

assertEquals(true, v.binarySearch(10).found)
assertEquals(false, v.binarySearch(11).found)

assertEquals(2, v.binarySearch(21).nearIndex)
```

## genericSort

`genericSort` allows to sort any array-like structure fully or partially without allocating and without having to reimplementing any sort algorithm again.
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

## mapWhile: `mapWhile`, `mapWhileArray`, `mapWhileInt`, `mapWhileFloat`, `mapWhileDouble`
{: #mapWhile }

This method allows to generate a collection by providing a condition and a generator:

```kotlin
val iterator = listOf(1, 2, 3).iterator()
assertEquals(listOf(1, 2, 3), mapWhile({ iterator.hasNext() }) { iterator.next()})
```

## getCyclic: `List.getCyclic`, `Array.getCyclic`
{: #getCyclic }

For lists and arrays Kds defines a `getCyclic` extension method to get an element wrapping its bounds. So `list.getCylic(-1)` would return the last element of the List, and `list.getCyclic(size)` would return the element at 0:

```kotlin
assertEquals("a", arrayOf("a", "b").getCyclic(2))
assertEquals("b", arrayOf("a", "b").getCyclic(-1))
```

## Property Delegates: `Extra.Property`, `Computed`, `WeakProperty`
{: #Delegates }

### Extra

Provides a Extra funtionality to define extrinsic properties to an object that has been decorated with Extra interface implemented by Extra.Mixin. It just adds a extra hashmap to the object, so it can be used to externally define properties. The idea is similar to `WeakProperty` but doesn't require weak references at all. But just works with objects that implements Extra interface.

```kotlin
class Demo : Extra by Extra.Mixin() {
    val default = 9
}

// Externally defined for classes implementing Extra
var Demo.demo by Extra.Property { 0 }
var Demo.demo2 by Extra.PropertyThis<Demo, Int> { default }

val demo = Demo()
assertEquals(0, demo.demo)
assertEquals(9, demo.demo2)
demo.demo = 7
assertEquals(7, demo.demo)
assertEquals("{demo=7, demo2=9}", demo.extra.toString())
```

### Computed

Allows to create nullable properties with a parent object that tries to get its value from the parent or from a default when it is not defined locally:

```kotlin
class Format(override var parent: Format? = null) : Computed.WithParent<Format> {
    var size: Int? = null

    val computedSize by Computed(Format::size) { 10 }
}

val f2 = Format()
val f1 = Format(f2)
assertEquals(10, f1.computedSize)
f2.size = 12
assertEquals(12, f1.computedSize)
f1.size = 15
assertEquals(15, f1.computedSize)
```

### WeakProperty

Similar to Extra, to extend objects, but do not require the objects to implement the `Extra` interface. Each externally defined property creates a WeakMap whose keys are the objects that are going to contain the extra properties. But those properties do not retain the object themselves, so they can be collected when not referenced anywhere else.

```kotlin
class C {
    val value = 1
}

var C.prop by WeakProperty { 0 }
var C.prop2 by WeakPropertyThis<C, String> { "${value * 2}" }

val c1 = C()
val c2 = C()
assertEquals(0, c1.prop)
assertEquals(0, c2.prop)
c1.prop = 1
c2.prop = 2
assertEquals(1, c1.prop)
assertEquals(2, c2.prop)

assertEquals("2", c2.prop2)
c2.prop2 = "3"
assertEquals("3", c2.prop2)
```
