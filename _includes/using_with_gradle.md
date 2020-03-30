## Using with gradle

### `build.gradle`

Requires `Gradle 6.2.2` (`JVM 8~13`) for building and `Kotlin >=1.3.71` for running:

```groovy
def {{ include.name }}Version = "{{ site.data.versions[include.name] }}"

repositories {
    maven { url "https://dl.bintray.com/korlibs/korlibs" }
    jcenter()
}

// For multiplatform projects
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation "com.soywiz.korlibs.{{ include.name }}:{{ include.name }}:${{ include.name }}Version" 
            }
        }
    }
}

dependencies {
    // For JVM/Android only
    implementation "com.soywiz.korlibs.{{ include.name }}:{{ include.name }}-jvm:${{ include.name }}Version" 
    // For JS only
    implementation "com.soywiz.korlibs.{{ include.name }}:{{ include.name }}-js:${{ include.name }}Version" 
}

```

### `settings.gradle`

```groovy
enableFeaturePreview('GRADLE_METADATA')
```
