---
layout: default
title: "Web (JS)"
title_prefix: KorGE Targets
fa-icon: fa-window-restore
priority: 2
#status: new
---

This target allows you to publish applications and games on any website.
Making it available to anyone with a browser or a mobile phone.

This target works on any web browser
supporting [WebGL](https://caniuse.com/#feat=webgl){:target="_blank",:rel="noopener"}
and [WebAudio](https://caniuse.com/#feat=audio-api){:target="_blank",:rel="noopener"} for sound,
that is almost modern web browser nowadays.

Features fast compilation time, small output size, fast startup time
and widely array of supported of devices with a single target.
Can also be used along the [Cordova Target](/korge/targets/cordova) to create full APPs.

{% include toc_include.md %}

## Executing

To compile, start an http-server and open a browser, use the gradle task:

```bash
./gradlew jsRun
```

## Packaging

```bash
./gradlew jsBrowserProductionWebpack # Outputs to /build/distributions
```

You can use any HTTP server to serve the files in your browser.
For example using: `npm -g install http-server` and then executing `hs build/distributions`.
Or using live-server: `npm -g install live-server` and then executing `live-server build/distributions`.
Or using Python3: changing directory to `build/distributions` and then executing `python -m http.server`.

You can also use `./gradlew -t jsWeb` to continuously building the JS sources and running
`hs build/web` in another terminal.
Here you can find a `testJs.sh` script doing exactly this for convenience.

You can run your tests using Node.JS by calling jsTest or in a headless chrome with jsTestChrome.

## Application Configuration

* The Application Icon would be rendered as a `favicon.ico`.
* The Application Title as the `<title>` tag.

## Recommendations: `runBlocking`

Remember that the JS and the Common target doesn't support blocking calls neither the `runBlocking` construct.
So when dealing with I/O you have to mark your functions as `suspend fun`.
Fortunately Korlibs are designed to be asynchronous, and reading resources is already suspending.
So you only have to propagate the suspend modifier when required and you are mostly safe here.
