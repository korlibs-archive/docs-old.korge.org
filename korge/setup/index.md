---
layout: default
title: "Setup"
title_prefix: KorGE
fa-icon: fa-check-square
children: /korge/setup/
priority: 0
---

## Video-tutorial

{% include youtube.html video_id="ANMiHx3z_No" %}

## Editor

KorGE provides an IntelliJ plugin, that allows you to create KorGE projects among other things.

### <a href="/korge/setup/intellij-plugin"><i class="fa far fa-lightbulb"></i> Setup IntelliJ Plugin</a>

{% include picture.html alt="intellij3b" src="/korge/setup/plugin.png" %}

## Gradle

KorGE uses gradle as build system. The only special requirement to build KorGE is any supported Java JDK.

The easiest way to get started is to download the template project that includes a Gradle 5.1.1 wrapper, a preconfigured build-script and a small main and a test:

### <a href="https://github.com/korlibs/korge-hello-world/archive/master.zip"><i class="fa fa-download"></i> Download Project Template</a>

To know how to configure the gradle plugin by yourself, check the [Gradle Plugin section](/korge/setup/gradle-plugin).
