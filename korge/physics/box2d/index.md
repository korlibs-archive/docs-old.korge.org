---
layout: default
title: Box2D
fa-icon: fa-boxes
priority: 200
---

You can use a port to Kotlin of the Box2D library:

```kotlin
dependencies {
    commonMainApi "com.soywiz.korlibs.korge:korge-box2d:$korgeVersion"
}
```

## Sample

```kotlin
suspend fun main() = Korge(quality = GameWindow.Quality.PERFORMANCE, title = "My Awesome Box2D Game!") {
	views.clearColor = Colors.DARKGREEN
	solidRect(300, 200, Colors.DARKCYAN)
	graphics {
		fill(Colors.DARKCYAN) {
			rect(-100, -100, 300, 200)
		}
		fill(Colors.AQUAMARINE) {
			circle(0, 0, 100)
		}
		fill(Colors.AQUAMARINE) {
			circle(100, 0, 100)
		}
		position(100, 100)
	}.interactive()
	worldView {
		position(400, 400).scale(20)

		createBody {
			setPosition(0, -10)
		}.fixture {
			shape = BoxShape(100, 20)
			density = 0f
		}.setViewWithContainer(solidRect(100, 20, Colors.RED).position(-50, -10).interactive())

		// Dynamic Body
		createBody {
			type = BodyType.DYNAMIC
			setPosition(0, 7)
		}.fixture {
			shape = BoxShape(2f, 2f)
			density = 0.5f
			friction = 0.2f
		}.setView(solidRect(2f, 2f, Colors.GREEN).anchor(.5, .5).interactive())

		createBody {
			type = BodyType.DYNAMIC
			setPosition(0.75, 13)
		}.fixture {
			shape = BoxShape(2f, 2f)
			density = 1f
			friction = 0.2f
		}.setView(graphics {
			fill(Colors.BLUE) {
				rect(-1f, -1f, 2f, 2f)
			}
		}.interactive())

		createBody {
			type = BodyType.DYNAMIC
			setPosition(0.5, 15)
		}.fixture {
			shape = CircleShape().apply { m_radius = 2f }
			density = 22f
			friction = 3f
		}.setView(graphics {
			fill(Colors.BLUE) {
				circle(0, 0, 200)
			}
			fill(Colors.DARKCYAN) {
				circle(100, 100, 20)
			}
			scale(1f / 100f)
		}.interactive())
	}
}

fun <T : View> T.interactive(): T = this.apply {
	alpha = 0.5
	onOver { alpha = 1.0 }
	onOut { alpha = 0.5 }
}
```