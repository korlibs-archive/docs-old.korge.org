---
layout: default
title: Contributing
css-icon: fab fa-github
priority: 1000
status: updated
---

{% include toc_include.md %}

## Development

All new development happens in the `korge-next` repository:

<https://github.com/korlibs/korge-next>

You can fork the repository, make changes and create a PR proposing them.

## Building

You can build `korge-next` with:

```kotlin
git clone https://github.com/korlibs/korge-next.git
cd korge-next
./gradlew publishToMavenLocal
```

This publishes all the libraries with the version `2.0.0.999` in the `~/.m2` folder.

## Using `korge-next` in a KorGE project

To use korge-next in a KorGE project, just build and publish it locally and replace your version with `2.0.0.999`.
