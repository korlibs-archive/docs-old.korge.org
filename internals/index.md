---
layout: default
title: Internals
fa-icon: fa-cogs
priority: 999
---

{% include toc_include.md %}

## `easy-kotlin-mpp-gradle-plugin`
{:#easy-kotlin-mpp-gradle-plugin}

Since all the korlibs share its build process, there is a gradle plugin with all that common code:

<https://github.com/korlibs/easy-kotlin-mpp-gradle-plugin>

It is published at the main plugins.gradle repository and bintray:

* <https://plugins.gradle.org/plugin/com.soywiz.korlibs.easy-kotlin-mpp-gradle-plugin>
* <https://bintray.com/korlibs/korlibs/easy-kotlin-mpp-gradle-plugin>

This plugin configures all the targets in a known way and provides several tasks:

* `./gradlew releaseVersion -PnextReleaseVersion=x.y.z` - releases a specific version
* `./gradlew releaseQuickVersion` - releases the snapshot and increments the patch version

These commands, will update the `gradle.properties` version, will make a commit and a push
and will do the same for a SNAPSHOT version.
So there is only one commit with a non-snapshot version in the repository.
This should be performed in the master branch from a contributor.

### internally used by travis 

* `./gradlew actuallyPublishBintray`
* `./gradlew localPublishToBintrayIfRequired`
* `./gradlew dockerMultiPublishToBintray`

## Releasing a new version
{:#new-version}

The plugin provides a way

## Travis publishing
{:#travis-publishing}

### Envs

Artifact publishing is done via travis.
Each travis repository is configured with two private envs:
`BINTRAY_USER` and `BINTRAY_KEY` that are used to publish to bintray.

### Build stages

Korlibs use [travis build stages](https://docs.travis-ci.com/user/build-stages/) to first test the repository,
then upload the artifacts to bintray when on the master branch and non SNAPSHOT versions,
and then publish them.

You can check an example checking a [.travis.yml](https://github.com/korlibs/klock/blob/master/.travis.yml).

#### test stage

This stage includes three jobs, one per operating system and check the libraries in different operating systems and configurations:

* Linux: java-linux+native-linux+chrome+nodejs+android
* Windows: windows-native
* MacOS: macos-native + other

#### bintray stage

This stage upload all the artifacts to bintray.
It only happens on the master branch, and only when the version@`gradle.properties` does not end by `-SNAPSHOT`.
Since you cannot use mac to generate windows artifacts, it has:

* Windows: builds and uploads windows-native artifacts
* MacOS: build and uploads all the artifacts excepts the windows one (including linux-native using crosscompilation)

#### publish stage

This stage just calls the publish API that will make all the uploaded artifacts from the previous stage
available to everyone, only if everything went fine. 
  
* Linux: calls the [bintray publish API](https://bintray.com/docs/api/#_publish_discard_uploaded_content) using `./gradlew actuallyPublishBintray` provided by the `easy-kotlin-mpp-gradle-plugin`
