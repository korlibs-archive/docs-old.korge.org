---
layout: default
title: Views
fa-icon: fa-object-ungroup
priority: 0
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
* **rotation**: [Angle](/korma/#angle)
* **skewX, skewY**
* **visible**
* **alpha**
* **blendingMode**
* **speed**: Double -- controls the view's updating speed (being a ratio where 1 is 1x, 0.5 is 0.5x and 2 is 2x the speed)

### Computed Properties

* **globalX, globalY**
* **globalMatrix**

### Components

Each view can has components attached.

*TODO*

### Blending Modes

KorGE supports NORMAL, ADD, MULTIPLY and SUBTRACT blending modes.

![](blending.png)
