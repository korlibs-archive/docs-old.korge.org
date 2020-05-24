---
layout: default
title: KBigNum
fa-icon: fa-sort-numeric-up
priority: 200
---

Library for Big Numbers

<https://github.com/korlibs/kbignum/>

{% include stars.html project="kbignum" %}

{% include toc_include.md %}

## KBigNum

This class allow to represent precise Big Numbers (fixed point numbers) that do not overflow.

```kotlin
object KBigNum {
    val VERSION: String
}
```

## Extensions

```kotlin
// Big Integer
val Long.bi get() = BigInt(this)
val Int.bi get() = BigInt(this)
val String.bi get() = BigInt(this)
fun String.bi(radix: Int) = BigInt(this, radix)

// Big Number
val Double.bn get() = BigNum("$this")
val Long.bn get() = BigNum(this.bi, 0)
val Int.bn get() = BigNum(this.bi, 0)
val String.bn get() = BigNum(this)
```

## BigInt

This class allow to represent precise Big Integers that do not overflow.

```kotlin
// Constructors
fun BigInt(data: UInt16ArrayZeroPad, signum: Int): BigInt
fun BigInt(value: Long): BigInt
fun BigInt(value: Int): BigInt
fun BigInt(str: String, radix: Int = 10): BigInt

class BigInt private constructor {
    companion object {
        val ZERO = BigInt(0)
        val MINUS_ONE = BigInt(-1)
        val ONE = BigInt(1)
        val TWO = BigInt(2)
        val TEN = BigInt(10)
        val SMALL = BigInt(0xFFFF)
    }

    val isSmall: Boolean
    val isZero: Boolean
    val isNotZero: Boolean
    val isNegative: Boolean
    val isPositive: Boolean
    val isNegativeOrZero: Boolean
    val isPositiveOrZero: Boolean
    val maxBits: Boolean
    val significantBits: Boolean

    // Unary operators
    operator fun unaryPlus(): BigInt
    operator fun unaryMinus(): BigInt

    val absoluteValue: BigInt
    fun abs(): BigInt
    fun countBits(): Int
    fun trailingZeros(): Int
    fun leadingZeros(): Int

    // Arithmetic binary operators
    operator fun plus(other: BigInt): BigInt
    operator fun plus(other: Int): BigInt
    operator fun minus(other: BigInt): BigInt
    operator fun minus(other: Int): BigInt
    operator fun times(other: BigInt): BigInt
    operator fun times(other: Int): BigInt
    operator fun times(other: Long): BigInt
    operator fun div(other: BigInt): BigInt = divRem(other).div
    operator fun div(other: Int): BigInt
    operator fun rem(other: BigInt): BigInt = divRem(other).rem
    operator fun rem(other: Int): BigInt

    // Asumes positive non zero values this > 0 && other > 0
    data class DivRem(val div: BigInt, val rem: BigInt)
    fun divRem(other: BigInt): DivRem

    infix fun pow(exponent: BigInt): BigInt
    infix fun pow(exponent: Int): BigInt

    // Bit/Logical operations
    infix fun shl(count: Int): BigInt
    infix fun shr(count: Int): BigInt
    infix fun and(other: BigInt): BigInt
    infix fun or(other: BigInt): BigInt
    infix fun xor(other: BigInt): BigInt

    fun getBitInt(n: Int): Int
    fun getBit(n: Int): Boolean

    // Comparison
    operator fun compareTo(that: BigInt): Int
    override fun hashCode(): Int
    override fun equals(other: Any?): Boolean

    // Conversion
    override fun toString() = toString(10)
    fun toString(radix: Int): String
    fun toString2(): String
    fun toInt(): Int
    fun toBigNum(): BigNum
}
```

## BigNum

```kotlin
fun BigNum(str: String): BigNum
fun BigNum(int: BigInt, scale: Int): BigNum

class BigNum private constructor {
    companion object {
        val ZERO = BigNum(BigInt.ZERO, 0)
        val ONE = BigNum(BigInt.ONE, 0)
        val TWO = BigNum(BigInt.TWO, 0)
    }

    fun convertToScale(otherScale: Int): BigNum

    // Binary operators
    operator fun plus(other: BigNum): BigNum
    operator fun minus(other: BigNum): BigNum
    operator fun times(other: BigNum): BigNum
    operator fun div(other: BigNum): BigNum
    fun div(other: BigNum, precision: Int): BigNum
    infix fun pow(other: Int): BigNum
    fun pow(exponent: Int, precision: Int): BigNum

    // Comparison
    operator fun compareTo(other: BigNum): Int
    override fun equals(other: Any?): Boolean

    // Conversion
    override fun toString(): String
}
```
