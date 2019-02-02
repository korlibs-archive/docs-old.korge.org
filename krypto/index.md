---
layout: default
title: "Krypto"
fa-icon: fa-lock
priority: 950
---

Krypto is a cryptography library for Multiplatform Kotlin 1.3.

<https://github.com/korlibs/krypto>

<div style="clear: both;"></div>

**Table of contents:**

{::options toc_levels="1..2" /}

* TOC
{:toc}

## SecureRandom

Krypto provides a `SecureRandom` class that extends the `kotlin.random.Random` class,
but generating cryptographic secure values.

It uses `SecureRandom` on the JVM + [`PRNGFixes`](https://android-developers.googleblog.com/2013/08/some-securerandom-thoughts.html){:target="_blank"} on Android.
On Native POSIX (including Linux, macOS and iOS), it uses `/dev/urandom`, on Windows
[`BCryptGenRandom`](https://docs.microsoft.com/en-us/windows/desktop/api/bcrypt/nf-bcrypt-bcryptgenrandom){:target="_blank"}

## Hash (MD5/SHA1/SHA256)

```kotlin
fun ByteArray.hash(algo: HashFactory): ByteArray
fun ByteArray.md5()
fun ByteArray.sha1()
fun ByteArray.sha256()

object MD5 : HashFactory
object SHA1 : HashFactory
object SHA256 : HashFactory

open class HashFactory(val create: () -> Hash) {
    fun digest(data: ByteArray): ByteArray
}

abstract class Hash {
    val chunkSize: Int
    val digestSize: Int
    fun reset(): Hash
    fun update(data: ByteArray, offset: Int, count: Int): Hash
    fun digest(): ByteArray
    fun digestOut(out: ByteArray)
}
```

## AES

```kotlin
object AES {
    fun decryptAes128Cbc(encryptedMessage: ByteArray, cipherKey: ByteArray): ByteArray
    fun encryptEes128Cbc(plainMessage: ByteArray, cipherKey: ByteArray): ByteArray
}
```
