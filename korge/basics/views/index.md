---
layout: default
title: Views
fa-icon: fa-object-ungroup
priority: 0
---

Korge's views works like [AS3's DisplayObject](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/DisplayObject.html) or the HTML DOM. It is intended for 2D rendering, though you can create custom views with 3D content rendering with KorAG.

**Table of contents:**

{::options toc_levels="1..3" /}

* TOC
{:toc}

## Rendering

![](table.gif)

It is **a tree structure** where `View` has a parent, and `Container` has other `View` as children.

Then when **KorAG performs the rendering**, it starts drawing from the bottom to the top. Just like [Painter's Algorithm](https://en.wikipedia.org/wiki/Painter%27s_algorithm).

![](painter1.png)

![](painter2.png)

## Properties

### Basic Properties

* **x, y**
* **scaleX, scaleY**
* **rotation**: [Angle](/korma/#angle)
* **skewX, skewY**
* **visible**
* **alpha**
* **blendingMode**
* **speed**: Double -- controls the view's updating speed (being a ratio where 1 is 1x, 0.5 is 0.5x and 2 is 2x the speed)
* **colorMul**: [RGBA](/korim/#rgba)

### Computed Properties

* **globalX, globalY**
* **globalMatrix**

### Blending Modes

KorGE supports NORMAL, ADD, MULTIPLY and SUBTRACT blending modes.

![](blending.png)

## Components

Each view might have components attached. Each component is attached to a View.

```kotlin
interface Component {
    val view: View
}
fun <T : Component> T.attach() = this.apply { this.view.addComponent(this) }
fun <T : Component> T.detach() = this.apply { this.view.removeComponent(this) }
```

And there are several kind of `Components` that can hook View's behaviour. You can create components that implement several Component interfaces:

### Handling Updating

```kotlin
interface UpdateComponentWithViews : Component {
    fun update(views: Views, ms: Double)
}

interface UpdateComponent : Component {
    fun update(ms: Double)
}
```

### Handling Resizing

```kotlin
interface ResizeComponent : Component {
    fun resized(views: Views, width: Int, height: Int)
}
```

### Handling Events

```kotlin
interface EventComponent : Component {
    fun onEvent(event: Event)
}
```

### Handling Input Events

```kotlin
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

The lifecycle of that component is associated to the View. So when the View and the Component are no longer referenced,
they will be collected by the GC.

For example, a Component that would reposition views when the viewport is rezied would be like this:

```kotlin
fun <T : View> T.dockedTo(anchor: Anchor) = DockingComponent(this, anchor).attach()

class DockingComponent(override val view: View, var anchor: Anchor) : ResizeComponent {
	override fun resized(views: Views, width: Int, height: Int) {
		view.x = views.actualVirtualLeft.toDouble() + (views.actualVirtualWidth) * anchor.sx
		view.y = views.actualVirtualTop.toDouble() + (views.actualVirtualHeight) * anchor.sy
		view.invalidate()
		view.parent?.invalidate()
	}
}
```

## Standard Views

Each kind of standard view provides a normal constructor, plus a DSL constructor that have `Container` as receiver.

### Container & FixedSizeContainer

Container is a View that can have childs:

```kotlin
inline fun Container.container(callback: @ViewsDslMarker Container.() -> Unit = {})

open class Container : View() {
    // Gets the outer container. When attached, this should be the Stage instance.
    val containerRoot: Container get() = parent?.containerRoot ?: this
    
    // Methods to handle its children
    val children = arrayListOf<View>()
    fun addChildAt(view: View, index: Int)
    fun swapChildren(view1: View, view2: View)
    fun getChildIndex(view: View): Int = view.index
    fun getChildAt(index: Int): View = children[index]
    fun getChildByName(name: String): View? = children.firstOrNull { it.name == name }
    fun removeChild(view: View?)
    fun removeChildren()
    fun addChild(view: View)
    
    // addChild, removeChild shortcuts (+= and -=)
    operator fun plusAssign(view: View)
    operator fun minusAssign(view: View)
}
```

The Container `width` and `height` methods will depend on its children.

For container that has a fixed `width` and `height` properties, you can use the `FixedSizeContainer` class:

```kotlin
inline fun Container.fixedSizeContainer(width: Number, height: Number, callback: @ViewsDslMarker FixedSizeContainer.() -> Unit = {})

open class FixedSizeContainer(override var width: Double = 100.0, override var height: Double = 100.0) : Container()
```

### SolidRect

A SolidRect is a View that is a rectangle of a solid color. In the end it acts like a 1x1 white image with a tint.

```kotlin
inline fun Container.solidRect(width: Number, height: Number, color: RGBA, callback: @ViewsDslMarker SolidRect.() -> Unit = {})

class SolidRect {
    companion object {
        inline operator fun invoke(width: Number, height: Number, color: RGBA) = SolidRect(width.toDouble(), height.toDouble(), color)
    }
    
    var width: Double
    var height: Double
}
```

### Image

The Image view will display an image. In addition to containers, this is the most common view in 2d games.

It can be construced from `Bitmap` and `BmpSlice` from KorIM.
Internally it creates, uploads and destroy textures in the GPU automatically so you don't have to care about it.

```kotlin
inline fun Container.image(texture: BmpSlice, anchorX: Double = 0.0, anchorY: Double = 0.0, callback: @ViewsDslMarker Image.() -> Unit = {}): Image
inline fun Container.image(texture: Bitmap, anchorX: Double = 0.0, anchorY: Double = 0.0, callback: @ViewsDslMarker Image.() -> Unit = {}): Image

open class Image : View() {
    constructor(bitmap: BmpSlice, anchorX: Double = 0.0, anchorY: Double = anchorX, hitShape: VectorPath? = null, smoothing: Boolean = true)
	constructor(bitmap: Bitmap, anchorX: Double = 0.0, anchorY: Double = anchorX, hitShape: VectorPath? = null, smoothing: Boolean = true)

	var bitmap: BmpSlice get() = baseBitmap; set(v) = run { baseBitmap = v }
	var texture: BmpSlice get() = baseBitmap; set(v) = run { baseBitmap = v }
}
```

### SceneContainer

See the [Scenes page](/korge/basics/scene/#SceneContainer) for more information.

### Graphics

The Graphics view allows to place vector graphics on it. The current implementations uses KorIM to rasterize the vector shapes and generates an image out of it.
KorIM uses the platform specific API to render vector graphics when available, while defaulting to a Kotlin software rasterizer when no vector graphics API is available.
It implements the [`VectorBuilder`](/korim/#VectorBuilder) interface from KorIM so it offers the standard vector drawing API.

```kotlin
inline fun Container.graphics(callback: Graphics.() -> Unit = {}): Graphics

class Graphics : View, VectorBuilder {
	inline fun dirty(callback: () -> Unit)
	fun clear()
	fun lineStyle(thickness: Double, color: RGBA, alpha: Double)
	inline fun fill(color: RGBA, alpha: Number = 1.0, callback: () -> Unit)
	inline fun fill(paint: Context2d.Paint, callback: () -> Unit)
	fun beginFill(paint: Context2d.Paint) = dirty
	fun beginFill(color: RGBA, alpha: Double)
	inline fun shape(shape: VectorPath)
	fun endFill()
}

```

### Camera

```kotlin
inline fun Container.camera(callback: @ViewsDslMarker Camera.() -> Unit)

class Camera : Container() {
	fun getLocalMatrixFittingGlobalRect(rect: Rectangle): Matrix
	fun getLocalMatrixFittingView(view: View?): Matrix
	fun setTo(view: View?)
	fun setTo(rect: Rectangle)

	suspend fun tweenTo(view: View?, vararg vs: V2<*>, time: TimeSpan, easing: Easing = Easing.LINEAR)
	suspend fun tweenTo(rect: Rectangle, vararg vs: V2<*>, time: TimeSpan, easing: Easing = Easing.LINEAR)
}
```

### Mesh

Mesh allows to render a raw set of points as triangles o triangle strips.
Used for example by the skeleton-based animations with mesh deforms.

```kotlin
open class Mesh(
	var texture: BmpSlice? = null,
	var vertices: Float32Buffer = Float32BufferAlloc(0),
	var uvs: Float32Buffer = Float32BufferAlloc(0),
	var indices: Uint16Buffer = Uint16BufferAlloc(0),
	var drawMode: DrawModes = DrawModes.Triangles
) : View() {
	enum class DrawModes { Triangles, TriangleStrip }

	val textureNN get() = texture ?: Bitmaps.white
	var dirty: Int = 0
	var indexDirty: Int = 0

	var pivotX: Double = 0.0
	var pivotY: Double = 0.0

	fun updatedVertices()
}

fun <T : Mesh> T.pivot(x: Double, y: Double): T = this.apply { this.pivotX = x }.also { this.pivotY = y }
```

### NinePatch

NinePatch is similar to an Image, but when stretching or shrinking, it preserves the size of its sides:

```kotlin
inline fun Container.ninePatch(
	tex: BmpSlice, width: Double, height: Double, left: Double, top: Double, right: Double, bottom: Double,
	callback: @ViewsDslMarker NinePatch.() -> Unit
)

class NinePatch(
	var tex: BmpSlice,
	override var width: Double,
	override var height: Double,
	var left: Double,
	var top: Double,
	var right: Double,
	var bottom: Double
) : View() {
	var smoothing = true
}
```

There is an extended version of the NinePatch, that uses the KorIM's `NinePatchBitmap32`,
that is compatible with the IntelliJ 9-patch bitmaps:

```kotlin
inline fun Container.ninePatch(
	tex: NinePatchEx.Tex, width: Double, height: Double, callback: @ViewsDslMarker NinePatchEx.() -> Unit
)

inline fun Container.ninePatch(
	ninePatch: NinePatchBitmap32, width: Double = ninePatch.dwidth, height: Double = ninePatch.dheight,
	callback: @ViewsDslMarker NinePatchEx.() -> Unit
)

class NinePatchEx : View() {
	var smoothing = true

    constructor(ninePatch: NinePatchBitmap32, width: Double = ninePatch.width.toDouble(), height: Double = ninePatch.height.toDouble()): NinePatchEx
}
```

### ScaleView

`ScaleView` is a FixedSizeContainer where all its contents is renderized to a normal size into a texture and then scaled with or without filtering.
This enables pixelated retro games.

```kotlin
inline fun Container.scaleView(
	width: Int, height: Int, scale: Double = 2.0, filtering: Boolean = false,
	callback: @ViewsDslMarker Container.() -> Unit = {}
) = ScaleView(width, height, scale, filtering).addTo(this).apply(callback)

class ScaleView(width: Int, height: Int, scale: Double = 2.0, var filtering: Boolean = false) : FixedSizeContainer(), View.Reference {
	init {
		this.width = width.toDouble()
		this.height = height.toDouble()
		this.scale = scale
	}
}
```

### Text

`Text` is a view that renders texts with a BitmapFont. It supports a small set of HTML for formating.

```kotlin
inline fun Container.text(
	text: String, textSize: Double = 16.0, font: BitmapFont = Fonts.defaultFont,
	callback: @ViewsDslMarker Text.() -> Unit = {}
)

class Text : View(), IText, IHtml {
	companion object {
		operator fun invoke(
			text: String,
			textSize: Double = 16.0,
			color: RGBA = Colors.WHITE,
			font: BitmapFont = Fonts.defaultFont
		): Text
	}

	val textBounds = Rectangle(0, 0, 1024, 1024)
	var document: Html.Document? = null
	var filtering = true
	var bgcolor = Colors.TRANSPARENT_BLACK
	val fonts = Fonts.fonts

	fun setTextBounds(rect: Rectangle)
	fun unsetTextBounds()
	var format: Html.Format
	var text: String
	var html: String
	fun relayout()
}

interface IText { var text: String }
interface IHtml { var html: String }

fun View?.setText(text: String) = run { this.foreachDescendant { if (it is IText) it.text = text } }
fun View?.setHtml(html: String) = run { this.foreachDescendant { if (it is IHtml) it.html = html } }
```

## Filters

Views can have filters attached.

```kotlin
var View.filter: Filter? = null
```

### ComposedFilter

You can apply several filters to a view using this:

```kotlin
class ComposedFilter(val filters: List<Filter>) : Filter()
```

### ColorMatrixFilter

```kotlin
class ColorMatrixFilter(var colorMatrix: Matrix3D, var blendRatio: Double) : Filter() {
    companion object {
        val GRAYSCALE_MATRIX = Matrix3D.fromRows(
            0.33f, 0.33f, 0.33f, 0f,
            0.59f, 0.59f, 0.59f, 0f,
            0.11f, 0.11f, 0.11f, 0f,
            0f, 0f, 0f, 1f
        )
        
        val IDENTITY_MATRIX = Matrix3D.fromRows(
            1f, 0f, 0f, 0f,
            0f, 1f, 0f, 0f,
            0f, 0f, 1f, 0f,
            0f, 0f, 0f, 1f
        )
    }
}
```

### Convolute3Filter

```kotlin
class Convolute3Filter(var kernel: Matrix3D) : Filter() {
    companion object {
        val KERNEL_GAUSSIAN_BLUR: Matrix3D
        val KERNEL_BOX_BLUR: Matrix3D
        val KERNEL_IDENTITY: Matrix3D
        val KERNEL_EDGE_DETECTION: Matrix3D
    }
}
```

### IdentityFilter

This filter can be used to no apply filters at all. But serves for the subtree to be rendered in a texture.

```kotlin
object IdentityFilter : Filter()
```

### WaveFilter and PageFilter

Can be used to simulate pages from books:

```kotlin
class PageFilter(
    var hratio: Double = 0.5,
    var hamplitude0: Double = 0.0,
    var hamplitude1: Double = 10.0,
    var hamplitude2: Double = 0.0,
    var vratio: Double = 0.5,
    var vamplitude0: Double = 0.0,
    var vamplitude1: Double = 0.0,
    var vamplitude2: Double = 0.0
) : Filter()
```

```kotlin
class WaveFilter(
    var amplitudeX: Int = 10,
    var amplitudeY: Int = 10,
    var crestCountX: Double = 2.0,
    var crestCountY: Double = 2.0,
    var cyclesPerSecondX: Double = 1.0,
    var cyclesPerSecondY: Double = 1.0,
    var time: Double = 0.0
) : Filter()
```

### SwizzleColorsFilter

Serves to do component swizzling per pixel:

```kotlin
class SwizzleColorsFilter(var swizzle: String = "rgba") : Filter()
```
