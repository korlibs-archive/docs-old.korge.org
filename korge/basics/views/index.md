---
layout: default
title: Views
fa-icon: fa-object-ungroup
---

Korge's views works like [AS3's DisplayObject](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/DisplayObject.html) or the HTML DOM. It is intended for 2D rendering, though you can create custom views with 3D content rendering with KorAG.

![](table.gif)

It is **a tree structure** where `View` has a parent, and `Container` has other `View` as children.

Then when **KorAG performs the rendering**, it starts drawing from the bottom to the top. Just like [Painter's Algorithm](https://en.wikipedia.org/wiki/Painter%27s_algorithm).

![](painter1.png)

![](painter2.png)

### Properties

* **x, y**
* **scaleX, scaleY**
* **rotation**
* **skewX, skewY**
* **visible**
* **alpha**
* **blendingMode**
* **speed** -- controls the view's updating speed

### Computed Properties

* **globalX, globalY**
* **globalMatrix**

### Components

Each view can has components attached.

*TODO*

### Blending Modes

KorGE supports NORMAL, ADD, MULTIPLY and SUBTRACT blending modes.

![](blending.png)
