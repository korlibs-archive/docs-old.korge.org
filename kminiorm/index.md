---
layout: default
title: KMiniOrm
fa-icon: fa-database
priority: 100
---

KMiniOrm is a ORM (only JVM at the moment).
It supports MongoDB, In-Memory for testing and JDBC sources like PosgreSQL, MySQL, SQLite and H2.

It has been designed to be a pleasure to use,
for querying, inserting and updating,
and to maintain your structure with as little manual migrations as possible.

It has scalability on mind, trying to avoid joins and providing a basic interface that can be implemented
on most databases. While still providing raw Query support on SQL-based implementations.

<https://github.com/korlibs/kminiorm/>{:target="_blank",:rel="noopener"}

{% include toc_include.md max_level="3" %}

## Small sample

```kotlin
data class MyTable(
    @DbPrimary val key: String,
    @DbIndex val value: Long
) : DbBaseModel

val sqliteFile = File("sample.sq3")
val db = JdbcDb(
    "jdbc:sqlite:${sqliteFile.absoluteFile.toURI()}",
    debugSQL = System.getenv("DEBUG_SQL") == "true",
    dialect = SqliteDialect,
    async = true
)

val table = db.table<MyTable>()
table.insert(
    MyTable("hello", 10L),
    MyTable("world", 20L),
    MyTable("this", 30L),
    MyTable("is", 40L),
    MyTable("a", 50L),
    MyTable("test", 60L),
    onConflict = DbOnConflict.IGNORE
)

table.where { it::value ge 20L }.limit(10).collect {
    println(it)
}
```

{% include using_with_gradle.md name="kminiorm" %}
