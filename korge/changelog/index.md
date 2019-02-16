---
layout: default
title: "Changelog"
fa-icon: fa-newspaper
priority: 10000
status: new
---

## 1.1.1 (2019-02-19)
{:#v111}

### Improvements

* [KorIM: Native antialiased vector rendering on iOS and macOS](https://github.com/korlibs/korim/compare/aa4f37d5884696613c1eb1fa006fdf599d454be5..34dfdd8eddad137aa132020e6ad909ded5970376)
* [KorAU: Support 8-bits per sample WAV files](https://github.com/korlibs/korau/commit/ff6c16cf24903582d563b6fe3e5340a34d0f1eb6)
* [KorGE: Improved Graphics view supporting strokes and optimizing rendering](https://github.com/korlibs/korge/commit/cc228e3ebb8a26d03aa63ce254c24c5e7b743639)
* [KorGE: Make ViewsForTesting as fast as possible when testing tweens or time-related tasks](https://github.com/korlibs/korge/commit/4b28e49f04f3798b4e458c438c2514ed38ce76b1)
* [KorGE plugin: support mp3 and ogg on lipsync](https://github.com/korlibs/korge/commit/81834cd3c6e8ac61dcbafcf30490896988fe8491)

### Optimizations

* [KorGE: Fixed scene not being able to launch new coroutine jobs except when using the dispatcher of GameWindow](https://github.com/korlibs/korge/commit/4b28e49f04f3798b4e458c438c2514ed38ce76b1)
* [KorIO: Improves performance of Json decoding on JS](https://github.com/korlibs/korio/commit/a9ce16dde72929986f5005060ce8b076f61ba69e)
* [KorIO: Reduces allocations when decoding JSON](https://github.com/korlibs/korio/commit/974421cb5b0628356e2966243a8fa4fc7c493971)
* [KorIM: Optimizes readBitmap](https://github.com/korlibs/korim/commit/aa4f37d5884696613c1eb1fa006fdf599d454be5)
* [KorIM buffer vector rendering](https://github.com/korlibs/korim/compare/aa4f37d5884696613c1eb1fa006fdf599d454be5..34dfdd8eddad137aa132020e6ad909ded5970376)
* [KorGE dragonbones: Small optimizations](https://github.com/korlibs/korge/commit/20b1d905bf9cb0bc4f46c4fec00f072254041a63)
* [KorGE: ViewsForTesting fixes](https://github.com/korlibs/korge/commit/4b28e49f04f3798b4e458c438c2514ed38ce76b1)

### Fixes

* [KorGE: Fixes `runJs` on windows and linux](https://github.com/korlibs/korge/commit/e22f8e92bca783ae91f30a0497267844459f5b2b)
* [KorMA: Fixed BoundsBuilder with negative numbers](https://github.com/korlibs/korma/commit/336204b2e28fbf22b7f08a278ded98bcb6b17514)
* KorIO: Fixes Regression that prevented JS to read images and other resources directly from URLs [1](https://github.com/korlibs/korio/commit/b29f5517e1da8f22919aaf77a493341aafbdbc7a) [2](https://github.com/korlibs/korio/commit/95b00778703162e86653ec80be9393eb5fb06449) 
* [KorGW: JVM: Fixes window dimensions and mouse coordinates](https://github.com/korlibs/korui/commit/4d2643f9516ab7426e970c0b15567fa6b301c4d1)
* [KorGE: Misc ResourceProcessor fixes](https://github.com/korlibs/korge/commit/c21996a7fd6827df9e93a0306379b9b994be3f19)
* [KorGE plugin: Fix atlas packing](https://github.com/korlibs/korge/commit/2ebb52e1fa67a996d5555f661b802e6e508716d8)

## 1.1.0 (2019-02-11)
{:#v110}

### New features

* Supported resources processing at build time. Initially: Atlas, SWF and Lipsync
* Added `runJs` gradle task that starts a web server and opens a browser
* Gradle metadata is not required anymore
* Redistributed gradle tasks in korge-* categories

### Improvements

* [KorMA: Makes Angle comparable and adds additional methods](https://github.com/korlibs/korma/commit/5a4476d39ba06c56e7b97224d2b4e75f3c292002)
* [KorIO: tries to figure out resources folders in submodules in intellIJ](https://github.com/korlibs/korio/commit/4b0fcb941271b9724ee93475437ba1a8578b15bd)
* [KorIM: supports suggesting premultiplied when loading native images](https://github.com/korlibs/korim/commit/fa19c274578c2f8465145d78038dc33d1a0177fc)
* [KorGE: improved lipsync API](https://github.com/korlibs/korge/commit/b6fcbf899c00881d87090efc144db7e00e3c9f4a) [2](https://github.com/korlibs/korge/commit/a6cf0e82bd2ca89cdc61a9ec237a445b06ec8d92)
* [KorGE: prevent errors from crashing the application](https://github.com/korlibs/korge/commit/e00f67ef489abe7f7db1657f52277a9b7a55bed5)

### Fixes

* [KorIO: Fixed handing when listing local files on the JVM](https://github.com/korlibs/korio/commit/1d8547e54bae7a899d6195f282c6e63d157d358a)
* [KorIO: Fixed ObjectMapper with jvmFallback](https://github.com/korlibs/korio/commit/afe47716e9cf72d7f49eea2178210dd39a0309c8)
* [KorEV/KorGW: Support drag events on JavaScript](https://github.com/korlibs/korui/commit/1f84e9f2f15082ad0b681679fa17f6fab196fc45)
* [KorEV/KorGW: Support drag events on Windows Native](https://github.com/korlibs/korui/commit/db5900e2c6e525cb65d1464fc009d4157006876b)
* [KorGW: Several fixes on GameWindow including iOS (that stopped working) and other native targets](https://github.com/korlibs/korui/commit/5a8485031b4a1053dd0029276e83b971290b5a78)
* [KorGE plugin: Fixed generated Android build.gradle that was not properly escaping in windows](https://github.com/korlibs/korge/commit/6e48ed85d678a95eb3520ff9f69ab091fbd8d1da)

### Other

* [KorGE: Added View.tweenAsync](https://github.com/korlibs/korge/commit/a3faf4e04b7cc4da5ccc34331631083a016719dd)
* Added several more KorGE samples

## 1.0.3 (2019-02-03)
{:#v103}

### Fixes

* Fixed Bitmap32.hashCode that was causing everything to be super slow
* Fixed red-blue swapping on KorIM windows native decoder 
* Fixed KorGE gradle plugin extension icon property being immutable

## 1.0.0 (2019-02-01)
{:#v100}

First public version

