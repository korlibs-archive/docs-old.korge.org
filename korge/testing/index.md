---
layout: default
title: "Testing"
fa-icon: fa-vial
priority: 7500
#status: new
---

KorGE provide mechanisms for testing views, scenes and suspending functions.

## Basics

For simple tests not depending on views, you can use the `suspendTest` function exposed by KorIO:

```kotlin
fun suspendTest(callback: suspend () -> Unit)
```

In your test:

```kotlin
class MyTestClass {
    @Test fun test() = suspendTest {
        assertEquals("world", resourcesVfs["hello.txt"].readString())
    }
}
```

## Views

When testing views, scenes or transitions KorGE exposes the `ViewsForTesting` base class.
When using this class, tweens and everything that happens in time will be executed immediately in order
so the tests can run super fast without having to wait for animations, so it is pretty convenient.

### Declaration

```kotlin
open class ViewsForTesting(val frameTime: TimeSpan = 10.milliseconds, val size: SizeInt = SizeInt(640, 480)) {
    val elapsed get() = time - startTime
    
    // Method to call in our tests
    fun viewsTest(block: suspend Stage.() -> Unit): Unit
    
    // Simulate mouse actions
    suspend fun mouseMoveTo(x: Number, y: Number)
    suspend fun mouseDown()
    suspend fun mouseUp()
    
    // Simulate actions on the views
    suspend fun View.simulateClick()
    suspend fun View.simulateOver()
    suspend fun View.simulateOut()
    
    // Check if the view is visible to the user
    suspend fun View.isVisibleToUser(): Boolean    
}
```

### Example

```kotlin
class MyTest : ViewsForTesting() {
    @Test
    fun test() = viewsTest {
        val log = arrayListOf<String>()
        val rect = solidRect(100, 100, Colors.RED)
        rect.onClick {
            log += "clicked"
        }
        assertEquals(1, views.stage.children.size)
        rect.simulateClick()
        assertEquals(true, rect.isVisibleToUser())
        tween(rect::x[-102], time = 10.seconds)
        assertEquals(Rectangle(x=-102, y=0, width=100, height=100), rect.globalBounds)
        assertEquals(false, rect.isVisibleToUser())
        assertEquals(listOf("clicked"), log)
    }
}
```