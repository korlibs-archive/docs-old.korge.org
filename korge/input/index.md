---
layout: default
title: Input
fa-icon: fa-gamepad
priority: 30
---

**Table of contents:**

{::options toc_levels="1..3" /}

* TOC
{:toc}

## Raw Input

You can handle RAW input by creating components that handle events.

```kotlin
// Handling all the Events
interface EventComponent : Component {
    fun onEvent(event: Event)
}

// Handling just Input Events
interface TouchComponent : Component {
    fun onTouchEvent(views: Views, e: TouchEvent)
}

interface MouseComponent : Component {
    fun onMouseEvent(views: Views, event: MouseEvent)
}

interface KeyComponent : Component {
    fun onKeyEvent(views: Views, event: KeyEvent)
}

interface GamepadComponent : Component {
    fun onGamepadEvent(views: Views, event: GamePadButtonEvent)
    fun onGamepadEvent(views: Views, event: GamePadStickEvent)
    fun onGamepadEvent(views: Views, event: GamePadConnectionEvent)
}
```

## High Level APIs

KorGE provides higher level APIs to handle events:

### Mouse/Touch Events

```kotlin
// Configuring MouseEvents
val View.mouse: MouseEvents
inline fun <T> View.mouse(callback: MouseEvents.() -> T): T = mouse.run(callback)

// Shortcuts
inline fun <T : View?> T?.onClick(noinline handler: (MouseEvents) -> Unit)
inline fun <T : View?> T?.onOver(noinline handler: (MouseEvents) -> Unit)
inline fun <T : View?> T?.onOut(noinline handler: (MouseEvents) -> Unit)
inline fun <T : View?> T?.onDown(noinline handler: (MouseEvents) -> Unit)
inline fun <T : View?> T?.onDownFromOutside(noinline handler: (MouseEvents) -> Unit)
inline fun <T : View?> T?.onUp(noinline handler: (MouseEvents) -> Unit)
inline fun <T : View?> T?.onUpOutside(noinline handler: (MouseEvents) -> Unit)
inline fun <T : View?> T?.onUpAnywhere(noinline handler: (MouseEvents) -> Unit)
inline fun <T : View?> T?.onMove(noinline handler: (MouseEvents) -> Unit)

class MouseEvents(override val view: View) : MouseComponent, UpdateComponentWithViews {
	val onClick: Signal<MouseEvents>
	val onOver: Signal<MouseEvents>
	val onOut: Signal<MouseEvents>
	val onDown: Signal<MouseEvents>
	val onDownFromOutside: Signal<MouseEvents>
	val onUp: Signal<MouseEvents>
	val onUpOutside: Signal<MouseEvents>
	val onUpAnywhere: Signal<MouseEvents>
	val onMove: Signal<MouseEvents>
	val onMoveAnywhere: Signal<MouseEvents>
	val onMoveOutside: Signal<MouseEvents>

	val startedPos = Point()
	val lastPos = Point()
	val currentPos = Point()
	
	val hitTest: View?

	var downPos = Point()
	var upPos = Point()
	var clickedCount = 0
	val isOver: Boolean
}
```

### Keys Events

```kotlin
// Configuring KeysEvents
val View.keys: KeysEvents
inline fun <T> View.keys(callback: KeysEvents.() -> T): T

// Shortcuts
inline fun <T : View?> T?.onKeyDown(noinline handler: suspend (KeyEvent) -> Unit)
inline fun <T : View?> T?.onKeyUp(noinline handler: suspend (KeyEvent) -> Unit)
inline fun <T : View?> T?.onKeyTyped(noinline handler: suspend (KeyEvent) -> Unit)

class KeysEvents(override val view: View) : KeyComponent {
	val onKeyDown = AsyncSignal<KeyEvent>()
	val onKeyUp = AsyncSignal<KeyEvent>()
	val onKeyTyped = AsyncSignal<KeyEvent>()

    // Handlers for a specific Key 
	fun down(key: Key, callback: (key: Key) -> Unit): Closeable
	fun up(key: Key, callback: (key: Key) -> Unit): Closeable
	fun typed(key: Key, callback: (key: Key) -> Unit): Closeable

    // Handlers for any keys
	fun down(callback: (key: Key) -> Unit): Closeable
	fun up(callback: (key: Key) -> Unit): Closeable
	fun typed(callback: (key: Key) -> Unit): Closeable
}
```

### Gamepad Events

```kotlin
// Configuring GamePadEvents
val View.gamepad: GamePadEvents
inline fun <T> View.gamepad(callback: GamePadEvents.() -> T): T

class GamePadEvents(override val view: View) : GamepadComponent {
	val stick = Signal<GamePadStickEvent>()
	val button = Signal<GamePadButtonEvent>()
	val connection = Signal<GamePadConnectionEvent>()

	fun stick(playerId: Int, stick: GameStick, callback: (x: Double, y: Double) -> Unit)
	fun down(playerId: Int, button: GameButton, callback: () -> Unit)
	fun up(playerId: Int, button: GameButton, callback: () -> Unit)
	fun connected(playerId: Int, callback: () -> Unit)
	fun disconnected(playerId: Int, callback: () -> Unit)
	override fun onGamepadEvent(views: Views, event: GamePadButtonEvent)
	override fun onGamepadEvent(views: Views, event: GamePadStickEvent)
	override fun onGamepadEvent(views: Views, event: GamePadConnectionEvent)
}

```