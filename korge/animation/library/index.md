---
layout: default
title: AnLibrary
---

AnLibrary is your common interface to any kind of animation libraries. Either **SWF** files, or **ANI** files. Or any custom animation library you plug-in.



### Basic interface

```
class AnLibrary() {
  val views: Views

  val width: Int
  val height: Int

  val fps: Double
  val msPerFrameDouble: Double
  val msPerFrame: Int
  var bgcolor: Int
  var defaultSmoothing = true

  fun createMainTimeLine(): AnMovieClip
  fun create(name: String): AnElement
  fun createShape(name: String): AnShape
  fun createMovieClip(name: String): AnMovieClip
}
```
