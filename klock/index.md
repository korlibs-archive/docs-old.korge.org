---
layout: default
title: Klock
hide_title: true
permalink: /klock/
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

* TOC
{:toc}

## Using with gradle

```
def klockVersion = "1.0.0"

repositories {
    maven { url "https://dl.bintray.com/soywiz/soywiz" }
}

dependencies {
    // For multiplatform projects
    implementation "com.soywiz:klock:$klockVersion"
}
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

## Date Information

Klock allows to get Date information: from how many days has a month, to whether a year is leap, to which month will be in three years and a six months.

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

## Date and Time distance



## Measuring time

As for Klock 1.0, there are two relevant functionality: the `measureTime`, `measureTimeWithResult` functions and the `PerformanceCounter` class.


