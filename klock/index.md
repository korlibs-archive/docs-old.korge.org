---
layout: default
title: Klock
hide_title: true
---

<img src="/i/logos/klock.svg" width="196" height="196" style="float: left;margin: 0 16px 16px 0;" alt="klock Date and Time" />

Consistent and portable date and time utilities for multiplatform kotlin (JVM, JS and COMMON)

  * Get time and local timezone as long and double
  * Generate, modify, stringify and parse dates
  * TimeSpan utilities

[https://github.com/korlibs/klock](https://github.com/korlibs/klock)

[![Build Status](https://travis-ci.org/korlibs/klock.svg?branch=master)](https://travis-ci.org/korlibs/klock)
[![Maven Version](https://img.shields.io/github/tag/korlibs/klock.svg?style=flat&label=maven)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22klock%22)

<div style="clear: both;"></div>

## Maven/Gradle:

Use with gradle (uploaded to maven central):

```groovy
compile "com.soywiz:klock:0.2.0" // jvm/android
compile "com.soywiz:klock-js:0.2.0" // js
compile "com.soywiz:klock-common:0.2.0" // common (just expect 2 decls in Klock)
```

## User guide:

### Getting the current unix time

Klock allows you to get the current time from [unix epoch](https://en.wikipedia.org/wiki/Unix_time) in UTC by generating a date.

`Klock.currentTimeMillis()` willd do the job. It is equivalent to Java's `System.currentTimeMillis()` or JS's `Date.now()`.

If you do not want to generate garbage in targets without native long support, you can also use `Klock.currentTimeMillisDouble()`

### Getting local timezone

Klock mainly works using UTC, but supports timezones. In order to get the current minute-based local timezone offset for an specific instant, just call `Klock.getLocalTimezoneOffset(unixTimestamp: Long)`.

### Constructing TimeSpan

Klock provides some nice property extensions to generate TimeSpan instances that provide full unit information. So, no more "is this in milliseconds/seconds/ticks/frames or what?"

And methods now can requires TimeSpan instead of milliseconds or seconds.

```kotlin
val oneSecond = 1.seconds
val halfSeconds = 0.5.seconds
val otherSecond = 1000.milliseconds
```

***Note:*** Using these extensions generate instances per call, so you will like to put them as constants on critical places.

### Constructing dates

`DateTime` instances support time offseting furthermore to UTC timezone.

You can get a new DateTime instance representing now or an specific unix timestamp with:

`DateTime.now()` or `DateTime.fromUnix(unix: Long)`

And you have local-time variants:

`DateTime.nowLocal()` or `DateTime.fromUnixLocal(unix: Long)`

If you want to construct it from a specific date:

`DateTime(2017, 12, 31, 23, 59, 59)`

You can convert between utc and localtime with:

```kotlin
val time = DateTime(2017, 12, 31, 23, 59, 59)
val utcTime = time.toUtc()
val localTime = time.toLocal()
val halfHourOffsetTime = time.toOffset(30)
```

### Modifying dates

If you want to manipulate your DateTime instance, you can construct `TimeDistance` using `.months`, `.days`... extension properties, and use `+` and `-` operators:

```kotlin
val now = DateTime.now()
val inAMonth = now + 1.months
val tomorrow = now + 1.days
val yeserday = now - 1.days
```

### Month and year methods

Sometimes we will need to know if a year is leap or how much days has a month in a specific year. With Klock you can fetch that information:

```kotlin
val is2017leap = Year.isLeap(2017)
val daysInJanuary2017 = Month.January.days(2017)
```

## Full API:

```kotlin
object Klock {
	val VERSION: String
	fun currentTimeMillis(): Long
	fun currentTimeMillisDouble(): Double
	fun getLocalTimezoneOffset(unix: Long): Int
}

data class TimeSpan {
	val milliseconds: Int
	val seconds: Double

	companion object {
		val ZERO = TimeSpan(0)
	}

	override fun compareTo(other: TimeSpan): Int
	operator fun plus(other: TimeSpan): TimeSpan
	operator fun minus(other: TimeSpan): TimeSpan
	operator fun times(scale: Int): TimeSpan
	operator fun times(scale: Double): TimeSpan
}

class SimplerDateFormat(val format: String) {
	companion object {
		val DEFAULT_FORMAT: SimplerDateFormat // "EEE, dd MMM yyyy HH:mm:ss z"
	}

	fun format(date: Long): String
	fun format(dd: DateTime): String
	fun parse(str: String): Long
	fun parseDate(str: String): DateTime
}

interface DateTime {
	companion object {
		val EPOCH: DateTime
		operator fun invoke(year: Int, month: Int, day: Int, hour: Int = 0, minute: Int = 0, second: Int = 0, milliseconds: Int = 0): DateTime
		operator fun invoke(time: Long): DateTime

		fun fromUnix(time: Long): DateTime
		fun fromUnixLocal(time: Long): DateTime

		fun nowUnix(): Long
		fun now(): DateTime
		fun nowLocal(): DateTime
		fun createAdjusted(year: Int, month: Int, day: Int, hour: Int = 0, minute: Int = 0, second: Int = 0, milliseconds: Int = 0): DateTime
		fun isLeapYear(year: Int): Boolean
		fun daysInMonth(month: Int, isLeap: Boolean): Int
		fun daysInMonth(month: Int, year: Int): Int
	}
	
	val year: Int
	val month: Int
	val dayOfWeekInt: Int
	val dayOfMonth: Int
	val dayOfYear: Int
	val hours: Int
	val minutes: Int
	val seconds: Int
	val milliseconds: Int
	val timeZone: String
	val unix: Long
	val offset: Int
	val utc: UtcDateTime
	fun add(deltaMonths: Int, deltaMilliseconds: Long): DateTime

	val dayOfWeek: DayOfWeek
	val month0: Int
	val month1: Int
	val monthEnum: Month
	
	fun toUtc(): DateTime
	fun toLocal(): DateTime
	fun addOffset(offset: Int): DateTime
	fun toOffset(offset: Int): DateTime
	fun addYears(delta: Int): DateTime
	fun addMonths(delta: Int): DateTime
	fun addHours(delta: Double): DateTime
	fun addMinutes(delta: Double): DateTime
	fun addSeconds(delta: Double): DateTime
	fun addMilliseconds(delta: Double): DateTime
	fun addMilliseconds(delta: Long): DateTime

	operator fun plus(delta: TimeDistance): DateTime
	operator fun minus(delta: TimeDistance): DateTime

	fun toString(format: String): String = SimplerDateFormat(format).format(this)
}

enum class DayOfWeek {
	Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday;
}

enum class Month {
	January, February, March, April, May, June,
	July, August, September, October, November, December;

	val index0: Int

	fun days(isLeap: Boolean): Int
	fun daysToStart(isLeap: Boolean): Int
	fun daysToEnd(isLeap: Boolean): Int

	fun days(year: Int): Int
	fun daysToStart(year: Int): Int
	fun daysToEnd(year: Int): Int
}

object Year {
    fun isLeap(year: Int): Boolean
}

data class TimeDistance(val years: Int = 0, val months: Int = 0, val days: Double = 0.0, val hours: Double = 0.0, val minutes: Double = 0.0, val seconds: Double = 0.0, val milliseconds: Double = 0.0) {
	operator fun unaryMinus(): TimeDistance
	operator fun minus(other: TimeDistance): TimeDistance
	operator fun plus(other: TimeDistance): TimeDistance
	operator fun times(times: Double): TimeDistance
}


inline val Int.years: TimeDistance
inline val Int.months: TimeDistance
inline val Number.days: TimeDistance
inline val Number.hours: TimeDistance
inline val Number.minutes: TimeDistance
inline val Number.seconds: TimeSpan
inline val Number.milliseconds: TimeSpan

```

## Examples:

### Stringify/Parsing dates:

```kotlin
class SimplerDateFormatTest {
	// Sun, 06 Nov 1994 08:49:37 GMT
	val format = SimplerDateFormat("EEE, dd MMM yyyy HH:mm:ss z")

	@Test
	fun testParse() {
		assertEquals(784111777000, format.parse("Sun, 06 Nov 1994 08:49:37 UTC"))
	}

	@Test
	fun testFormat() {
		assertEquals("Sun, 06 Nov 1994 08:49:37 UTC", format.format(784111777000))
	}

	@Test
	fun testParseFormat() {
		val dateStr = "Sun, 06 Nov 1994 08:49:37 UTC"
		assertEquals(dateStr, format.format(format.parse(dateStr)))
	}
}


```