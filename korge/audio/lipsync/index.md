---
layout: default
title: "Lipsync"
fa-icon: fa-comments
status: outdated
---

KorGE is integrated with [Rhubarb Lip-Sync](https://github.com/DanielSWolf/rhubarb-lip-sync).
It can load audio files `XXXXX.voice.wav`, `XXXXX.voice.mp3` or `XXXXX.voice.ogg`,
process using Rhubarb Lip-Sync, and generate lip synchronization files, that KorGE understands in a lightweight form.

You can use lipsync just including the maven module: [`com.soywiz:korge-ext-lipsync`](https://github.com/soywiz/korge/tree/master/korge-ext-lipsync)

[![](/korge/audio/lipsync/sample.jpg)](https://www.youtube.com/watch?v=OX_K387EKoI)

## Adobe Flash integration

In order to integrate with Adobe Flash Player. Lipsync plugin provides an automatic handler for the property `lipsync`. Where the value is the *character* name.
You should tag an instance that will hold a timeline with mouth shapes.

![](/korge/audio/lipsync/flash1.png)

Inside that symbol, the timeline should have labels for each mouth shape:

![](/korge/audio/lipsync/flash2.png)

**Label names:** ABCDEFGHX

![A](/korge/audio/lipsync/ken-A.png)
![B](/korge/audio/lipsync/ken-B.png)
![C](/korge/audio/lipsync/ken-C.png)
![D](/korge/audio/lipsync/ken-D.png)
![E](/korge/audio/lipsync/ken-E.png)
![F](/korge/audio/lipsync/ken-F.png)
![G](/korge/audio/lipsync/ken-G.png)
![H](/korge/audio/lipsync/ken-H.png)
![X](/korge/audio/lipsync/ken-X.png)

You can find [the whole mouth shapes description here](https://github.com/DanielSWolf/rhubarb-lip-sync#mouth-shapes).

## Spriter integration

*TO DO + TO WRITE*

## IntelliJ integration

IntelliJ/Gradle plugins will generate `.voice.lipsync` files from `voice.wav`, `voice.mp3` or `voice.ogg` files.

You can also preview voice files + mouth shapes directly in intelliJ.

![](/audio/lipsync/lipsync-preview.png)

## Code Usage

You can read a Voice file using:

```
suspend fun VfsFile.readVoice(views: Views): Voice
```

or injecting with an associated `@Path`.

```
class MainScene(
	@Path("lipsync/simple.voice.wav") val myvoice: Voice
) : Scene()
```

![](/audio/lipsync/code1.png)

You can use `Voice.play(name: String)` method to play a voice file.
Or `Views.lipSync.play(voice: Voice, name: String)`.
That will emit `data class LipSyncEvent(var name: String, var timeMs: Int, var lip: Char)` events to the stage. You can register a handler for it in a `View` or in a View's `Component` for manually handling it.

Also you can manually use the `LipSyncComponent` component that is automatically registered for the property `lipsync`.
