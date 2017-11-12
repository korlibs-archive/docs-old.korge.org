---
layout: default
title: "Geometry"
---

<img src="/about/korma.png" style="float:left;" />

KorGE uses [KorMA](https://github.com/soywiz/korma) as geometry mathematical library.

This library provides 2D Vectors, Rectangles, Matrix2D, ScaleMode, Size, Position... It provides interpolation facilities. Along as numeric functions.
Has Bezier curves calculation primitives.

<div style="clear:both;" />

It has a VectorPath with mixed straight + curved lines that can be triangulated.
You can do path finding in triangulated surfaces using TRA* algorithm.
You can calculate union, intersection, substraction, xor o collision among shapes.
It also provides a BinPacker for allocating rectangles in a surface (useful for atlas generation).


KorMA doesn't have any external dependency. So you can use it alone.
