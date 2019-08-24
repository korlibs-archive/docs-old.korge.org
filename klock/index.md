---
layout: default
title: Klock
hide_title: true
fa-icon: fa-clock
priority: 10
---

<img src="/i/logos/klock.svg" width="196" height="196" style="float: left;margin: 0 16px 16px 0;" alt="klock Date and Time" />

Klock is a Date & Time library for Multiplatform Kotlin 1.3.

It is designed to be as allocation-free as possible using Kotlin inline classes,
to be consistent and portable across targets since all the code is written in Common Kotlin,
and to provide an API that is powerful, fun and easy to use.

[https://github.com/korlibs/klock](https://github.com/korlibs/klock)

[![Build Status](https://travis-ci.org/korlibs/klock.svg?branch=master)](https://travis-ci.org/korlibs/klock)
[![Maven Version](https://img.shields.io/github/tag/korlibs/klock.svg?style=flat&label=maven)](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22klock%22)

<div style="clear: both;"></div>

**Table of contents:**

{::options toc_levels="1..2" /}

* TOC
{:toc}
{:.multicolumn}

## Using with gradle

### `build.gradle`

```groovy
def klockVersion = "1.5.1"

repositories {
    jcenter()
}

kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation "com.soywiz.korlibs.klock:klock:$klockVersion" // Common 
                //implementation "com.soywiz.korlibs.klock:klock-jvm:$klockVersion" // If we are just using JVM
            }
        }
    }
}
```

### `settings.gradle`

```groovy
enableFeaturePreview('GRADLE_METADATA')
```

## Dates

To represent instants with date and time information, there are two classes: `DateTime` and `DateTimeTz`.

* `DateTime` class is used to represent instants in UTC time. This class is `inline` and it is represented internally as a `Double` in a way that it is allocation-free on all targets including JS.
* `DateTimeTz` class is used to represent instants with an offset in a TimeZone. It includes a `DateTime` and a offset. And it is different from `DateTime` itself.

### Current Time

```kotlin
val utc = DateTime.now()
val local = DateTimeTz.nowLocal()
```

### Unix Timestamp

To get the current UTC Unix TimeStamp:

```kotlin
val unix = DateTime.now().unixMillis
val unix = DateTime.nowUnix()
```

To construct a UTC date from an Unix TimeStamp:

```kotlin
val date = DateTime.fromUnix(unix)
```

### Components

```kotlin
val time = DateTime.now()

val year: Year = time.year
val year: Int = time.yearInt

val month: Month = time.month
val month0: Int = time.month0
val month1: Int = time.month1

val yearMonth: YearMonth = time.yearMonth
val dayOfMonth: Int = time.dayOfMonth

val dayOfWeek: DayOfWeek = time.dayOfWeek
val dayOfWeek: Int = time.dayOfWeekInt

val dayOfYear: Int = time.dayOfYear

val hours: Int = time.hours
val minutes: Int = time.minutes
val seconds: Int = time.seconds
val milliseconds: Int = time.milliseconds
```

### From DateTime to DateTimeTz 

```kotlin
time.localUnadjusted
time.toOffsetUnadjusted(offset: TimezoneOffset)

time.local
time.toOffset(offset: TimezoneOffset)
```

### Formating and Parsing Dates

The `DateFormat` interface allows to parse and format dates from/to Strings.

```kotlin
val dateFormat: DateFormat = DateFormat("EEE, dd MMM yyyy HH:mm:ss z") // Construct a new DateFormat from a String
val date: DateTimeTz = dateFormat.parse("Sat, 08 Sep 2018 04:08:09 UTC") // Parse a Date from a String
val dateStr: String = DateTime.now().format(dateFormat) // Format a Date using a specific DateFormat.
```

### TimeZones

As for 1.0 Klock doesn't have direct TimeZone support. But support offseted DateTime using `DateTimeTz`.

What Klock allows to do here is to get the UTC offset of the operating system TimeZone in a specific moment (having into account daylight changes when supported by the OS).

## Date Information

Klock allows to get Date information: from how many days has a month, to whether a year is leap, to which month will be in three years and a six months.
This UTC offset is represented by the class `TimezoneOffset` that just wraps the `TimeSpan` class.

### DayOfWeek enum

DayOfWeek is an enum with all seven days of the week: 
`Sunday(0)`, `Monday(1)`, `Tuesday(2)`, `Wednesday(3)`, `Thursday(4)`, `Friday(5)`, `Saturday(6)`

* Constructing a DayOfWeek from an integer where Sunday=0: `DayOfWeek[index0]`
* Getting index0 (sunday=0) and index1 (sunday=1) representations: `dayOfWeek.index0`, `dayOfWeek.index1`

### Month enum

Month is an enum with all twelve months on it:
`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`.

Months are a set of 28-31 days. The number of days of each month is always the same, except for `February` that has 28 days in normal years, and 29 in leap years. 

* Getting next and previous month (cyclic): `month.next`, `month.prev`
* Getting the number of days in a common and leap year: `month.daysCommon`, `month.daysLeap`
* Getting the number of days for a specific year or a leap year: `month.days(year)`, `month.days(leap = true)`
* Getting a Month from a one-based representation (where January is 1 and December is 12), while wrapping outside numbers: `Month(month1)`
* Getting the month zero-based (January=0) and one-based (January=1) representation: `month.index0`, `month.index1`
* Add or subtract months: `month + 11`

### Year class

The `Year` class represents a normal Year and it is an inline class. It supports from year 1 to 9999 where the leap year formulas are valid.

* Construct a Year: `Year(2018)`
* Get the number of days of a specific year: `Year(2018).days`
* Determine if a year is leap: `Year(2018).isLeap`
* How many days have passed since year 1 to the beginning of a specific year: `Year(2018).daysSinceOne`
* Construct a year using the number of days since year 1: `Year.fromDays(730_000)`

### YearMonth class

The `YearMonth` class is an inline class representing a pair of `Year` and `Month`. This pair has information about the number of days in a month
and can be useful to represent calendars.

* The current YearMonth: `DateTime.now().yearMonth`
* Number of days in a YearMonth: `yearMonth.days`
* Number of days since the start of the year to reach the beginning of the month: `yearMonth.daysToStart`
* Number of days since the start of the year to reach the end of the month: `yearMonth.daysToEnd`
* Get the components year and the month: `yearMonth.year` and `yearMonth.month`
* Add or subtract months of years: `yearMonth - 1.years + 1.months`

## TimeSpan

Klock offers a `TimeSpan` inline class using a Double to be allocation-free on all targets, and it serves to represent durations without start references.
It has millisecond precision up to `2 ** 52`, which means that it can represent up to **142808 years** with millisecond precision.
It has a special `TimeSpan.NULL` value (internally represented as NaN) to represent an absence of time without having to use nullable types that are not allocation-free.

### Constructing instances

There are extension properties for `Number` to generate `TimeSpan` instances. The extensions use `Number`, but are inline, so no allocation is done. 

```kotlin
val time = 1_000_000_000.nanoseconds
val time = 1_000_000.microseconds
val time = 1_000.milliseconds
val time = 1.seconds
val time = 0.5.seconds
val time = 60.minutes
val time = 24.hours
val time = 1.days
val time = 1.weeks
```

You can represent from nanoseconds to weeks. Months and years are not included here but included as part of `MonthSpan` since months and years work different because leap years.

### Arithmetic

```kotlin
val time = 4.seconds
val doubleTheTime = time * 2
val negatingTime = -time
val twoHundredMillisecondsMore = time + 200.milliseconds
```

### External Arithmetic

```kotlin
val now = DateTime.now()
val inTenSeconds = now + 10.seconds
```

### Comparison

`TimeSpan` implements `Comparable<TimeSpan>` so you can compare times independently to the unit used to instantiate them:

```kotlin
val isTrue = 4001.milliseconds > 4.seconds
```

### Converting between units

`TimeSpan` has several properties to get the instance time interpreted in different units of measure:

```kotlin
val value: Double = 1.seconds.nanoseconds // 1.seconds as nanoseconds (1_000_000_000)
val value: Double = 1.seconds.microseconds // 1.seconds as microseconds (1_000_000)
val value: Double = 1.seconds.milliseconds // 1.seconds as milliseconds (1000)
val value: Double = 1.seconds.seconds // 1.seconds as seconds (1)
val value: Double = 1.seconds.minutes // 1.seconds as minutes (1.0/60)
val value: Double = 1.seconds.hours // 1.seconds as hours (1.0/3_600)
val value: Double = 1.seconds.days // 1.seconds as days (1.0/86_4000)
```

For milliseconds there are a couple of additional properties to get it as Long and Int:

```kotlin
val value: Long = 1.seconds.millisecondsLong // 1.seconds as milliseconds (1000L)
val value: Int  = 1.seconds.millisecondsInt  // 1.seconds as milliseconds (1000)
```

## MonthSpan

MonthSpan allows to represent `month` and `year` durations (with month precission) where `TimeSpan` simply can't work because month distance depends on specific moments to have into account leap years.

### Constructing instances

```kotlin
val time = 1.months
val time = 5.years
```

### Arithmetic

```kotlin
val time: MonthSpan = 5.years + 2.months
val time: MonthSpan = 5.years * 2
val time: DateTimeSpan = 5.years + 5.days
```

### External Arithmetic

```kotlin
val now = DateTime.now()
val inTwoMonths = now + 2.months
```

### Components

```kotlin
val time = 5.years + 2.months + 4.months

val years : Int = time.years  // 5
val months: Int = time.months // 6

val totalYears : Double = time.totalYears  // 5.0
val totalMonths: Int    = time.totalMonths // 5 * 12 + 6 = 66
```

## DateTimeSpan

DateTimeSpan is a combination of `MonthSpan` and `TimeSpan`.

This class is not inline, so whenever it is possible use `MonthSpan` or `TimeSpan` to alter `DateTime` directly.

## DateTimeRange

DateTimeRange is a range between two DateTime.

### Constructing Instances

```kotlin
val today = DateTime.now()
val tomorrow = DateTime.now() + 1.days

val rangeOpen = today until tomorrow
val rangeClosed = today .. tomorrow
```

### Contains

```kotlin
val inTenMinutes = now + 10.minutes
val contains: Boolean = inTenMinutes in rangeOpen
```

### Span and Duration

```kotlin
val duration: TimeSpan     = rangeOpen.duration
val span    : DateTimeSpan = rangeOpen.span
```

### Days Between two DateTime

```kotlin
val inFourMonths = today + 4.month
val days = (today until inFourMonths).span.days
``` 

## Measuring Time

As for Klock 1.0, there are two relevant functionality: the `measureTime`, `measureTimeWithResult` functions and the `PerformanceCounter` class.

### measureTime

This function is inline and allocation-free, and can be used for expensive computations as well as for asynchronous blocks:

```kotlin
val time: TimeSpan = measureTime {
    // expensive or asynchronous computation
}
```

### measureTimeWithResult

This function is inline but it allocates a TimedResult instance, so it is not suitable for critical places, but allows to return a result along the time:

```kotlin
val timedResult: TimedResult<String> = measureTimeWithResult {
    // expensive or asynchronous computation
    "result"
}
val time: TimeSpan = timedResult.time
val result: String = timedResult.result
```

### PerformanceCounter

This class offers a performance counter that will increase over time but that cannot be used as reference in time. Only can be used as relative time to compute deltas:

```kotlin
val start: Double = PerformanceCounter.microseconds
// ...
val end: Double = PerformanceCounter.microseconds
val elapsed: TimeSpan = (end - start).microseconds 
```

## Localization

Starting with Klock 1.3.0, there is support for multiple languages.
English support works out of the box, but to prevent adding growing the size of the library without DCE/Tree shaking,
there is a separate artifact called `klock-locale` that add support for additional languages.
Each language is added via an extension method to the `KlockLocale` companion object.

### Month localized names

```kotlin

val name = Month.February.localName(KlockLocale.japanese) // "2月"
val name = Month.February.localName(KlockLocale.spanish) // "febrero"
val name = Month.February.localShortName(KlockLocale.spanish) // "feb"
```

### Day of week localized names

```kotlin
val name = DayOfWeek.Monday.localName(KlockLocale.japanese) // "月曜日"
val name = DayOfWeek.Monday.localShortName(KlockLocale.japanese) // "月"
```

### Formating dates in a specific language

```kotlin
val date = DateTime(year = 2019, month = Month.March, day = 13, hour = 21, minute = 36, second = 45, milliseconds = 512)
val locale = KlockLocale.spanish

// A generic format with a specific locale
date.toString(DateFormat.DEFAULT_FORMAT.withLocale(locale)) // Mié, 13 Mar 2019 21:36:45 UTC

// Locale-specific formats
locale.formatDateTimeMedium.format(date) // 13/03/2019 21:36:45
locale.formatDateTimeShort.format(date) // 13/03/19 21:36
locale.formatDateFull.format(date) // Miércoles, 13 de Marzo de 2019
locale.formatDateLong.format(date) // 13 de Marzo de 2019
locale.formatDateMedium.format(date) // 13/03/2019
locale.formatDateShort.format(date) // 13/03/19
locale.formatTimeMedium.format(date) // 21:36:45
locale.formatTimeShort.format(date) // 21:36
```

## ISO8601 (serialization and parsing)

ISO-86601 is a date, time and interval serialization specification defined here: <https://en.wikipedia.org/wiki/ISO_8601>.

### Serializing dates

```kotlin
val date = DateTime(2019, Month.April, 14)
assertEquals("2019-04-14", date.format(ISO8601.DATE_CALENDAR_COMPLETE))
assertEquals("2019-04-14", date.format(ISO8601.DATE_CALENDAR_COMPLETE.extended))
assertEquals("20190414", date.format(ISO8601.DATE_CALENDAR_COMPLETE.basic))
```

### Serializing times

```kotlin
val time = 15.hours + 30.minutes + 12.seconds
assertEquals("15:30:12", ISO8601.TIME_LOCAL_COMPLETE.format(time))
assertEquals("153012", ISO8601.TIME_LOCAL_COMPLETE.basic.format(time))
```

### Serializing intervals

```kotlin
val time = 1.years + 0.months + 27.days + 11.hours + 9.minutes + 11.seconds
assertEquals("P1Y0M27DT11H9M11S", ISO8601.INTERVAL_COMPLETE0.format(time))
```

## TimeProvider

Sometimes you will need a source of time that can be mocked. Klock includes a `TimeProvider` interface with a default implementation using `DateTime`.
