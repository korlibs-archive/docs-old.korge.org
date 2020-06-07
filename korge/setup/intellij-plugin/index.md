---
layout: default
title: IntelliJ Plugin
title_prefix: Setup KorGE
fa-icon: far fa-lightbulb
priority: 1
---

The simplest way to start with KorGE is by using its IntelliJ plugin.
The plugin works on Android Studio and IntelliJ IDEA Community and Ultimate.

{% include toc_include.md %}

## Video-tutorial

{% include youtube.html video_id="ANMiHx3z_No" %}

## Intalling KorGE IntelliJ Plugin
{:#install}

First we open IntelliJ. If we don't have it installed, check the [Toolbox section](#toolbox).
After opening IntelliJ we should see a window similar to this one:

{% include picture.html alt="intellij1" src="/korge/setup/intellij-plugin/plugin1.png" %}

We have to click on `Configure` -> `Plugins`: 

{% include picture.html alt="intellij2" src="/korge/setup/intellij-plugin/plugin2.png" width="300" %}

Then in the `Marketplace` tab, we have to search for `korge`, and then press the `Install` button.

{% include picture.html alt="intellij3" src="/korge/setup/intellij-plugin/plugin3.png" %}

After downloading, the `Install` button will be changed with `Restart IDE`.
We press that button.

{% include picture.html alt="intellij3b" src="/korge/setup/intellij-plugin/plugin3b.png" %}

After installed, we have to be sure that the Korge
plugin is **enabled** in the plugins `Installed` tab.

{% include picture.html alt="intellij4" src="/korge/setup/intellij-plugin/plugin4.png" %}

## Creating a new project
{:#project}

First, we open IntelliJ and press the `Create New Project` button.

{% include picture.html alt="project1" src="/korge/setup/intellij-plugin/project1.png" %}

Then we select `Korge` from the list of templates of the left, and without changing
anything else, we press the `Next` button.

{% include picture.html alt="project2" src="/korge/setup/intellij-plugin/project2.png" %}

Optionally, we can choose the GroupId, ArtifactId and Version for the project.
Then press `Next`.

{% include picture.html alt="project3" src="/korge/setup/intellij-plugin/project3.png" %}

Now we choose the `Project name` and press the `Finish` button.

{% include picture.html alt="project4" src="/korge/setup/intellij-plugin/project4.png" %}

Our entrypoint is at `src/commonMain/kotlin/main.kt`.
Unfortunately at this point we can't use the play gutter icon. To execute
our game, we have to go to the `Gradle` tab, then `Tasks` -> `korge-run` -> `runJvm`.

{% include picture.html alt="project5" src="/korge/setup/intellij-plugin/project5.png" %}

Right click on the task and `Run 'project [runJvm]'`:

{% include picture.html alt="project6" src="/korge/setup/intellij-plugin/project6.png" %}

Now we have our project up and running!

{% include picture.html alt="project7" src="/korge/setup/intellij-plugin/project7.png" %}

## Installing JetBrains Toolbox
{:#toolbox}

The Toolbox application allows us to install several JetBrain-based IDEs. 

You can download it here: <https://www.jetbrains.com/toolbox-app/>{:target="_blank",:rel="noopener"}

{% include picture.html alt="toolbox" src="/korge/setup/intellij-plugin/toolbox.png" width="400" %}

## Suggested IntelliJ configuration

I suggest you to configure IntelliJ IDEA with:

* Editor → Code Style → Kotlin → Imports → Use imports with '*'
* Build, Execution, Deployment → Build Tools → Gradle → Runner → Delegate IDE build/run actions to gradle and Run tests using Gradle test runner
* Editor → General → Code Completion → Match Case - NO, Show the parameter info popup in 0 ms
