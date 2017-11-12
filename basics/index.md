---
layout: default
title: Basics
index_icon: <i class="fa fa-object-ungroup"></i>
---

KorGE has a `Stage` like AS3 and HTML DOM and a [display tree with `View` nodes](/basics/views).

KorGE defines `ResourcesRoot`, that is a mountable virtual file system that works with Korio's VfsFile.
It allows to load all kind of resources asynchronously from different sources and mount points.

* Using KorIO it can read ByteArray, Strings, XMLs, JSONs, YAMLs...
* Using KorIM it can load images
* And using KorAU can load sound files

It [defines `Scene` that act as a controller](/basics/scene) and a way to split the application in smaller parts.
It uses the `AsyncInjector` from Korio as an [IoC](https://en.wikipedia.org/wiki/Inversion_of_control) mechanism to declare dependencies to Scenes.

Optionally (not imposed) it can use the Korio's `Bus` for communicating different parts of the application.

You can do MVCS as Robot-legs. Or use your own way of programming. KorGE gives you some facilities for
some different programming strategies but without imposing anything.
