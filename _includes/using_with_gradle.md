## Using with gradle

### `build.gradle.kts`

Requires `Gradle 6.2.2` (`JVM 8~13`) for building and `Kotlin >=1.3.71` for running:

```kotlin
val {{ include.name }}Version = "{{ site.data.versions[include.name] }}"

repositories {
    maven { url("https://dl.bintray.com/korlibs/korlibs") }
    jcenter()
}

// For multiplatform projects
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation("com.soywiz.korlibs.{{ include.name }}:{{ include.name }}:${{ include.name }}Version") 
            }
        }
    }
}

dependencies {
    // For JVM only
    implementation("com.soywiz.korlibs.{{ include.name }}:{{ include.name }}-jvm:${{ include.name }}Version") 
    // For Android only
    implementation("com.soywiz.korlibs.{{ include.name }}:{{ include.name }}-android:${{ include.name }}Version") 
    // For JS only
    implementation("com.soywiz.korlibs.{{ include.name }}:{{ include.name }}-js:${{ include.name }}Version") 
}

```

### `settings.gradle.kts`

```kotlin
enableFeaturePreview("GRADLE_METADATA")
```
