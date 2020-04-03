---
layout: default
title: "KorIO"
hide_title: true
fa-icon: fa-copy
priority: 40
---

# <img alt="KorIO" src="/i/logos/korio.svg" width="128" height="128" style="float: left;" />

KorIO is a library for Charsets, Encodings, Checksums, Compression, I/O, Streams, Virtual File System, Networking, Http, WebSockets, Serialization...

[https://github.com/korlibs/korio](https://github.com/korlibs/korio)

{% include toc_include.md max_level="4" %}
{% include using_with_gradle.md name="korio" %}

## Charset

Only UTF8 supported at the moment.

```kotlin
val ISO_8859_1: Charset
val LATIN1: SingleByteCharset
val UTF8: Charset
val UTF16_LE: UTF16Charset
val UTF16_BE: UTF16Charset
val ASCII: Charset

fun String.toByteArray(charset: Charset = UTF8): ByteArray
fun ByteArray.toString(charset: Charset): String
fun ByteArray.readStringz(o: Int, size: Int, charset: Charset = UTF8): String
fun ByteArray.readStringz(o: Int, charset: Charset = UTF8): String
fun ByteArray.readString(o: Int, size: Int, charset: Charset = UTF8): String

abstract class Charset(val name: String) {
	abstract fun encode(out: ByteArrayBuilder, src: CharSequence, start: Int = 0, end: Int = src.length)
	abstract fun decode(out: StringBuilder, src: ByteArray, start: Int = 0, end: Int = src.size)
}

open class SingleByteCharset(name: String, val conv: String) : Charset(name)
```

## Misc

```kotlin
// To get the simple name of a class in all the targets without reflection.
val <T : Any> KClass<T>.portableSimpleName: String

// To build a list. Analogous to buildString
inline fun <T> buildList(callback: ArrayList<T>.() -> Unit): List<T>

inline fun Int.compareToChain(callback: () -> Int): Int = if (this != 0) this else callback()

fun String.htmlspecialchars() = Xml.Entities.encode(this)

fun Regex.Companion.quote(str: String): String

// Ranges extensions
val IntRange.length: Int get() = (this.endInclusive - this.start) + 1
val LongRange.length: Long get() = (this.endInclusive - this.start) + 1

val IntRange.endExclusive: Int get() = this.endInclusive + 1
val LongRange.endExclusive: Long get() = this.endInclusive + 1
val LongRange.endExclusiveClamped: Long get() = if (this.endInclusive == Long.MAX_VALUE) Long.MAX_VALUE else this.endInclusive + 1
val LONG_ZERO_TO_MAX_RANGE = 0L..Long.MAX_VALUE
fun IntRange.toLongRange() = this.start.toLong()..this.endInclusive.toLong()
```

## Environment

```kotlin
// Uses querystring on JS/Browser, and proper env vars on the rest of the targets
expect object Environment {
	operator fun get(key: String): String?
	fun getAll(): Map<String, String>
}
```

## OS

```kotlin
object OS {
	val rawName: String
	val rawNameLC: String

	val platformName: String
	val platformNameLC: String

	val isWindows: Boolean
	val isUnix: Boolean
	val isPosix: Boolean
	val isLinux: Boolean
	val isMac: Boolean

	val isIos: Boolean
	val isAndroid: Boolean

	val isJs: Boolean
	val isNative: Boolean
	val isJvm: Boolean

	val isJsShell: Boolean
	val isJsNodeJs: Boolean
	val isJsBrowser: Boolean
	val isJsWorker: Boolean
	val isJsBrowserOrWorker: Boolean
}

```

## File System

### PathInfo

```kotlin
expect val File_separatorChar: Char

inline class PathInfo(val fullPath: String)
val String.pathInfo: PathInfo
interface Path { val pathInfo: PathInfo }

fun PathInfo.parts(): List<String>
fun PathInfo.normalize(): String 
fun PathInfo.combine(access: PathInfo): PathInfo
fun PathInfo.lightCombine(access: PathInfo): PathInfo
fun PathInfo.isAbsolute(): Boolean
fun PathInfo.normalizeAbsolute(): PathInfo

// Direct PathInfo
val PathInfo.fullPathNormalized: String
val PathInfo.folder: String
val PathInfo.folderWithSlash: String
val PathInfo.baseName: String
val PathInfo.fullPathWithoutExtension: String
fun PathInfo.fullPathWithExtension(ext: String): String
val PathInfo.baseNameWithoutExtension: String
val PathInfo.baseNameWithoutCompoundExtension: String
val PathInfo.fullNameWithoutExtension: String
val PathInfo.fullNameWithoutCompoundExtension: String
fun PathInfo.baseNameWithExtension(ext: String): String
fun PathInfo.baseNameWithCompoundExtension(ext: String): String
val PathInfo.extension: String
val PathInfo.extensionLC: String
val PathInfo.compoundExtension: String
val PathInfo.compoundExtensionLC: String
val PathInfo.mimeTypeByExtension: MimeType
fun PathInfo.getPathComponents(): List<String>
fun PathInfo.getPathFullComponents(): List<String>
val PathInfo.fullName: String

// For instances including a pathInfo
val Path.fullPathNormalized: String
val Path.folder: String
val Path.folderWithSlash: String
val Path.baseName: String
val Path.fullPathWithoutExtension: String
fun Path.fullPathWithExtension(ext: String): String
val Path.fullNameWithoutExtension: String
val Path.baseNameWithoutExtension: String
val Path.fullNameWithoutCompoundExtension: String
val Path.baseNameWithoutCompoundExtension: String
fun Path.baseNameWithExtension(ext: String): String
fun Path.baseNameWithCompoundExtension(ext: String): String
val Path.extension: String
val Path.extensionLC: String
val Path.compoundExtension: String
val Path.compoundExtensionLC: String
val Path.mimeTypeByExtension: MimeType
fun Path.getPathComponents(): List<String>
fun Path.getPathFullComponents(): List<String>
val Path.fullName: String
```

### VfsFile

```kotlin
data class VfsFile(
	val vfs: Vfs,
	val path: String
) : VfsNamed(path.pathInfo), AsyncInputOpenable, Extra by Extra.Mixin() {
	val parent: VfsFile
	val root: VfsFile
	val absolutePath: String

	operator fun get(path: String): VfsFile

	// @TODO: Kotlin suspend operator not supported yet!
	suspend fun set(path: String, content: String)
	suspend fun set(path: String, content: ByteArray)
	suspend fun set(path: String, content: AsyncStream)
	suspend fun set(path: String, content: VfsFile)

	suspend fun put(content: AsyncInputStream, attributes: List<Vfs.Attribute> = listOf()): Long
	suspend fun put(content: AsyncInputStream, vararg attributes: Vfs.Attribute): Long
	suspend fun write(data: ByteArray, vararg attributes: Vfs.Attribute): Long
	suspend fun writeBytes(data: ByteArray, vararg attributes: Vfs.Attribute): Long

	suspend fun writeStream(src: AsyncInputStream, vararg attributes: Vfs.Attribute, autoClose: Boolean = true): Long
	suspend fun writeFile(file: VfsFile, vararg attributes: Vfs.Attribute): Long
	suspend fun listNames(): List<String>
	suspend fun copyTo(target: AsyncOutputStream)
	suspend fun copyTo(target: VfsFile, vararg attributes: Vfs.Attribute): Long
	fun withExtension(ext: String): VfsFile
	fun withCompoundExtension(ext: String): VfsFile
	fun appendExtension(ext: String): VfsFile

	suspend fun open(mode: VfsOpenMode = VfsOpenMode.READ): AsyncStream
	suspend fun openInputStream(): AsyncInputStream

	override suspend fun openRead(): AsyncStream
	suspend inline fun <T> openUse(mode: VfsOpenMode
	suspend fun readRangeBytes(range: LongRange): ByteArray
	suspend fun readRangeBytes(range: IntRange): ByteArray

	suspend fun readAll(): ByteArray

	suspend fun read(): ByteArray
	suspend fun readBytes(): ByteArray

	suspend fun readLines(charset: Charset = UTF8): List<String>
	suspend fun writeLines(lines: List<String>, charset: Charset = UTF8)

	suspend fun readString(charset: Charset = UTF8): String
	suspend fun writeString(data: String, vararg attributes: Vfs.Attribute, charset: Charset = UTF8): Unit

	suspend fun readChunk(offset: Long, size: Int): ByteArray
	suspend fun writeChunk(data: ByteArray, offset: Long, resize: Boolean = false): Unit 

	suspend fun readAsSyncStream(): SyncStream

	suspend fun stat(): VfsStat
	suspend fun touch(time: DateTime, atime: DateTime = time): Unit
	suspend fun size(): Long
	suspend fun exists(): Boolean
	suspend fun isDirectory(): Boolean
	suspend fun setSize(size: Long): Unit
	suspend fun delete(): Unit
	suspend fun setAttributes(attributes: List<Vfs.Attribute>)
	suspend fun setAttributes(vararg attributes: Vfs.Attribute)

	suspend fun mkdir(attributes: List<Vfs.Attribute>)
	suspend fun mkdir(vararg attributes: Vfs.Attribute)

	suspend fun copyToTree(
		target: VfsFile,
		vararg attributes: Vfs.Attribute,
		notify: suspend (Pair<VfsFile, VfsFile>) -> Unit = {}
	): Unit

	suspend fun ensureParents(): VfsFile
	suspend fun renameTo(dstPath: String): Unit
	suspend fun list(): ReceiveChannel<VfsFile>
	suspend fun listRecursive(filter: (VfsFile) -> Boolean = { true }): ReceiveChannel<VfsFile>

	suspend fun exec(
		cmdAndArgs: List<String>,
		env: Map<String, String> = LinkedHashMap(),
		handler: VfsProcessHandler = VfsProcessHandler()
	): Int

	suspend fun execToString(
		cmdAndArgs: List<String>,
		env: Map<String, String> = LinkedHashMap(),
		charset: Charset = UTF8,
		captureError: Boolean = false,
		throwOnError: Boolean = true
	): String

	suspend fun execToString(vararg cmdAndArgs: String, charset: Charset = UTF8): String

	suspend fun passthru(
		cmdAndArgs: List<String>,
		env: Map<String, String> = LinkedHashMap(),
		charset: Charset = UTF8
	): Int

	suspend fun passthru(
		vararg cmdAndArgs: String,
		env: Map<String, String> = LinkedHashMap(),
		charset: Charset = UTF8
	): Int

	suspend fun watch(handler: suspend (Vfs.FileEvent) -> Unit): Closeable
	suspend fun redirected(pathRedirector: suspend VfsFile.(String) -> String): VfsFile
	fun jail(): VfsFile
	suspend fun getUnderlyingUnscapedFile(): FinalVfsFile
}

fun VfsFile.toUnscaped(): FinalVfsFile
fun FinalVfsFile.toFile(): VfsFile

data class FinalVfsFile(val file: VfsFile) {
    constructor(vfs: Vfs, path: String) : this(vfs[path])
    val vfs: Vfs
    val path: String
}

suspend inline fun <R> VfsFile.useVfs(callback: suspend (VfsFile) -> R): R
```

### Vfs

```kotlin
open class VfsNamed(override val pathInfo: PathInfo) : Path
```

```kotlin
interface SimpleStorage {
	suspend fun get(key: String): String?
	suspend fun set(key: String, value: String)
	suspend fun remove(key: String)
}
```

```kotlin
abstract class Vfs : AsyncCloseable {
	open fun getAbsolutePath(path: String): String
	
    val root: VfsFile
	open val supportedAttributeTypes: List<KClass<out Attribute>>()
	
    operator fun get(path: String): VfsFile
	fun file(path: String) = root[path]

	override suspend fun close(): Unit = Unit

	fun createExistsStat(
		path: String, isDirectory: Boolean, size: Long, device: Long = -1, inode: Long = -1, mode: Int = 511,
		owner: String = "nobody", group: String = "nobody", createTime: DateTime = DateTime.EPOCH, modifiedTime: DateTime = DateTime.EPOCH,
		lastAccessTime: DateTime = modifiedTime, extraInfo: Any? = null, id: String? = null
	): VfsStat

	fun createNonExistsStat(path: String, extraInfo: Any? = null): VfsStat

	suspend fun exec(path: String, cmdAndArgs: List<String>, handler: VfsProcessHandler = VfsProcessHandler()): Int

	open suspend fun exec(path: String, cmdAndArgs: List<String>, env: Map<String, String>, handler: VfsProcessHandler = VfsProcessHandler()): Int

	open suspend fun open(path: String, mode: VfsOpenMode): AsyncStream
	open suspend fun openInputStream(path: String): AsyncInputStream
	open suspend fun readRange(path: String, range: LongRange): ByteArray

	open suspend fun put(path: String, content: AsyncInputStream, attributes: List<Attribute> = listOf()): Long
	suspend fun put(path: String, content: ByteArray, attributes: List<Attribute> = listOf()): Long
	suspend fun readChunk(path: String, offset: Long, size: Int): ByteArray
	suspend fun writeChunk(path: String, data: ByteArray, offset: Long, resize: Boolean)
	open suspend fun setSize(path: String, size: Long)
	open suspend fun setAttributes(path: String, attributes: List<Attribute>): Unit
	open suspend fun stat(path: String): VfsStat
	open suspend fun list(path: String): ReceiveChannel<VfsFile>
	open suspend fun mkdir(path: String, attributes: List<Attribute>): Boolean
	open suspend fun rmdir(path: String): Boolean
	open suspend fun delete(path: String): Boolean
	open suspend fun rename(src: String, dst: String): Boolean
	open suspend fun watch(path: String, handler: (FileEvent) -> Unit): Closeable
	open suspend fun touch(path: String, time: DateTime, atime: DateTime)
	open suspend fun getUnderlyingUnscapedFile(path: String): FinalVfsFile

	interface Attribute
	inline fun <reified T> Iterable<Attribute>.get(): T?

	abstract class Proxy : Vfs() {
		protected abstract suspend fun access(path: String): VfsFile
		protected open suspend fun VfsFile.transform(): VfsFile = file(this.path)
		final override suspend fun getUnderlyingUnscapedFile(path: String): FinalVfsFile = initOnce().access(path).getUnderlyingUnscapedFile()
		protected open suspend fun init() = Unit
		var initialized = false
	}

	open class Decorator(val parent: VfsFile) : Proxy() {
		val parentVfs = parent.vfs
		override suspend fun access(path: String): VfsFile = parentVfs[path]
	}

	data class FileEvent(val kind: Kind, val file: VfsFile, val other: VfsFile? = null) {
		enum class Kind { DELETED, MODIFIED, CREATED, RENAMED }
	}
}

enum class VfsOpenMode(
    val cmode: String,
    val write: Boolean,
    val createIfNotExists: Boolean = false,
    val truncate: Boolean = false
) {
    READ("rb", write = false),
    WRITE("r+b", write = true, createIfNotExists = true),
    APPEND("a+b", write = true, createIfNotExists = true),
    CREATE_OR_TRUNCATE("w+b", write = true, createIfNotExists = true, truncate = true),
    CREATE("w+b", write = true, createIfNotExists = true),
    CREATE_NEW("w+b", write = true);
}

open class VfsProcessHandler {
    open suspend fun onOut(data: ByteArray): Unit = Unit
    open suspend fun onErr(data: ByteArray): Unit = Unit
}

class VfsProcessException(message: String) : IOException(message)

data class VfsStat(
    val file: VfsFile,
    val exists: Boolean,
    val isDirectory: Boolean,
    val size: Long,
    val device: Long = -1L,
    val inode: Long = -1L,
    val mode: Int = 511,
    val owner: String = "nobody",
    val group: String = "nobody",
    val createTime: DateTime = DateTime.EPOCH,
    val modifiedTime: DateTime = createTime,
    val lastAccessTime: DateTime = modifiedTime,
    val extraInfo: Any? = null,
    val id: String? = null
) : Path by file

val VfsStat.createDate: DateTime get() = createTime
val VfsStat.modifiedDate: DateTime get() = modifiedTime
val VfsStat.lastAccessDate: DateTime get() = lastAccessTime

suspend fun ByteArray.writeToFile(path: String) = localVfs(path).write(this)
suspend fun ByteArray.writeToFile(file: VfsFile) = file.write(this)
```

### Standard File Systems

```kotlin
var resourcesVfsDebug = false
val resourcesVfs: VfsFile
val rootLocalVfs: VfsFile
val applicationVfs: VfsFile
val applicationDataVfs: VfsFile
val cacheVfs: VfsFile
val externalStorageVfs: VfsFile
val userHomeVfs: VfsFile
val tempVfs: VfsFile
val localCurrentDirVfs: VfsFile
fun localVfs(path: String): VfsFile
fun jailedLocalVfs(base: String): VfsFile
```

#### IsoVfs

```kotlin
suspend fun IsoVfs(file: VfsFile): VfsFile
suspend fun IsoVfs(s: AsyncStream): VfsFile
suspend fun AsyncStream.openAsIso(): IsoVfs
suspend fun VfsFile.openAsIso(): IsoVfs
suspend fun <R> AsyncStream.openAsIso(callback: suspend (VfsFile) -> R): R
suspend fun <R> VfsFile.openAsIso(callback: suspend (VfsFile) -> R): R
```

#### JailVfs

```kotlin
fun VfsFile.jail(): VfsFile
fun JailVfs(jailRoot: VfsFile): VfsFile
```

#### LocalVfs

```kotlin
abstract class LocalVfs : Vfs() {
	companion object { operator fun get(base: String): VfsFile = localVfs(base) }
	override fun toString(): String = "LocalVfs"
}
```

#### LogVfs

```kotlin
fun VfsFile.log(): VfsFile = LogVfs(this).root

class LogVfs(val parent: VfsFile) : Vfs.Proxy() {
	val log: List<String>
	val logstr: Strin
	val modifiedFiles: Set<String>()
}
```

#### MapLikeStorageVfs

```kotlin
fun SimpleStorage.toVfs(): VfsFile = MapLikeStorageVfs(this).root
class MapLikeStorageVfs(val storage: SimpleStorage) : Vfs()
```

#### MemoryVfs

```kotlin
fun MemoryVfs(items: Map<String, AsyncStream> = LinkedHashMap(), caseSensitive: Boolean = true): VfsFile
fun MemoryVfsMix(
	items: Map<String, Any> = LinkedHashMap(),
	caseSensitive: Boolean = true,
	charset: Charset = UTF8
): VfsFile
fun MemoryVfsMix(vararg items: Pair<String, Any>, caseSensitive: Boolean = true, charset: Charset = UTF8): VfsFile
```

#### MergedVfs

```kotlin
open class MergedVfs(vfsList: List<VfsFile> = listOf()) : Vfs.Proxy() {
	operator fun plusAssign(other: VfsFile)
	operator fun minusAssign(other: VfsFile)
}
```

#### MountableVfs

```kotlin
interface Mountable {
	fun mount(folder: String, file: VfsFile): Mountable
	fun unmount(folder: String): Mountable
}

// VfsFile.vfs is Mountable
suspend fun MountableVfs(closeMounts: Boolean = false, callback: suspend Mountable.() -> Unit): VfsFile
```

#### NodeVfs

```kotlin
open class NodeVfs(val caseSensitive: Boolean = true) : Vfs() {
	val events = Signal<FileEvent>()
	val rootNode = Node("", isDirectory = true)

	open inner class Node() : Iterable<Node> {
		val name: String
		val isDirectory: Boolean
		parent: Node? = null
		val nameLC: String
		
		var parent: Node?
		var data: Any?
		val children: Map<String, Node>()
		val childrenLC: Map<String, Node>()
		val root: Node
		var stream: AsyncStream? = null

		fun child(name: String): Node?
		fun createChild(name: String, isDirectory: Boolean = false): Node

		operator fun get(path: String): Node

		fun getOrNull(path: String): Node?

		fun access(path: String, createFolders: Boolean = false): Node
		fun mkdir(name: String): Boolean
	}
}
```

#### UniversalVfs

```kotlin
val String.uniVfs: UniversalVfs
fun String.uniVfs(providers: UniSchemaProviders, base: VfsFile? = null): VfsFile 

object UniversalVfs {
	operator fun invoke(uri: String, providers: UniSchemaProviders, base: VfsFile? = null): VfsFile
}

class UniSchema(val name: String, val provider: (URL) -> VfsFile)

class UniSchemaProviders(val providers: Map<String, UniSchema>) {
	constructor(providers: Iterable<UniSchema>)
	constructor(vararg providers: UniSchema)
}

var defaultUniSchema = UniSchemaProviders(
	UniSchema("http") { UrlVfs(it) },
	UniSchema("https") { UrlVfs(it) },
	UniSchema("file") { rootLocalVfs[it.path] }
)

fun registerUniSchema(schema: UniSchema)

inline fun <T> registerUniSchemaTemporarily(schema: UniSchema, callback: () -> T): T

operator fun UniSchemaProviders.plus(other: UniSchemaProviders)
operator fun UniSchemaProviders.plus(other: UniSchema)

operator fun UniSchemaProviders.minus(other: UniSchemaProviders): UniSchemaProviders
operator fun UniSchemaProviders.minus(other: UniSchema)
```

#### UrlVfs

```kotlin
fun UrlVfs(url: String, client: HttpClient = createHttpClient()): VfsFile
fun UrlVfs(url: URL, client: HttpClient = createHttpClient()): VfsFile
fun UrlVfsJailed(url: String, client: HttpClient = createHttpClient()): VfsFile
fun UrlVfsJailed(url: URL, client: HttpClient = createHttpClient()): VfsFile

class UrlVfs(val url: String, val dummy: Unit, val client: HttpClient = createHttpClient()) : Vfs() {
	class HttpHeaders(val headers: Http.Headers) : Attribute

	fun getFullUrl(path: String): String {
		val result = url.trim('/') + '/' + path.trim('/')
		//println("UrlVfs.getFullUrl: url=$url, path=$path, result=$result")
		return result
	}
}
```

#### ZipVfs

```kotlin
// Create Zip File
suspend fun VfsFile.createZipFromTree(): ByteArray
suspend fun VfsFile.createZipFromTreeTo(s: AsyncStream)

// Opening Zip File
suspend fun VfsFile.openAsZip(caseSensitive: Boolean = true): VfsFile
suspend fun AsyncStream.openAsZip(caseSensitive: Boolean = true)suspend fun <R> VfsFile.openAsZip(caseSensitive: Boolean = true, callback: suspend (VfsFile) -> R): R
suspend fun <R> AsyncStream.openAsZip(caseSensitive: Boolean = true, callback: suspend (VfsFile) -> R): R
suspend fun ZipVfs(s: AsyncStream, zipFile: VfsFile? = null, caseSensitive: Boolean = true, closeStream: Boolean = false): VfsFile
```

## Streams

### FastByteArrayInputStream

```kotlin
fun ByteArray.openFastStream(offset: Int = 0): FastByteArrayInputStream

class FastByteArrayInputStream(val ba: ByteArray, var offset: Int = 0) {
	val length: Int
	val available: Int
	val hasMore: Boolean
	val eof: Boolean

	fun skip(count: Int)
	fun skipToAlign(count: Int)

	fun readS8(): Int
	fun readU8(): Int
	fun readS16LE(): Int
	fun readS16BE(): Int
	fun readU16LE(): Int
	fun readU16BE(): Int
	fun readS24LE(): Int
	fun readS24BE(): Int
	fun readU24LE(): Int
	fun readU24BE(): Int
	fun readS32LE(): Int
	fun readS32BE(): Int
	fun readU32LE(): Int
	fun readU32BE(): Int
	fun readF32LE(): Float
	fun readF32BE(): Float
	fun readF64LE(): Double
	fun readF64BE(): Double
	fun readBytes(count: Int): ByteArray
	fun readShortArrayLE(count: Int): ShortArray
	fun readShortArrayBE(count: Int): ShortArray
	fun readCharArrayLE(count: Int): CharArray
	fun readCharArrayBE(count: Int): CharArray
	fun readIntArrayLE(count: Int): IntArray
	fun readIntArrayBE(count: Int): IntArray
	fun readLongArrayLE(count: Int): LongArray
	fun readLongArrayBE(count: Int): LongArray
	fun readFloatArrayLE(count: Int): FloatArray
	fun readFloatArrayBE(count: Int): FloatArray
	fun readDoubleArrayLE(count: Int): DoubleArray
	fun readDoubleArrayBE(count: Int): DoubleArray
	fun readU_VL(): Int
	fun readS_VL(): Int
	fun readString(len: Int, charset: Charset = UTF8)
	fun readStringz(len: Int, charset: Charset = UTF8): String
	fun readStringz(charset: Charset = UTF8): String
	fun readStringVL(charset: Charset = UTF8): String
}
```

### Synchronous

```kotlin
interface SyncInputStream : OptionalCloseable {
	fun read(buffer: ByteArray, offset: Int = 0, len: Int = buffer.size - offset): Int
	fun read(): Int = smallBytesPool.alloc2 { if (read(it, 0, 1) > 0) it[0].unsigned else -1 }
}

interface SyncOutputStream : OptionalCloseable {
	fun write(buffer: ByteArray, offset: Int = 0, len: Int = buffer.size - offset): Unit
	fun write(byte: Int) = smallBytesPool.alloc2 { it[0] = byte.toByte(); write(it, 0, 1) }
	fun flush() = Unit
}

interface SyncPositionStream { var position: Long }
interface SyncLengthStream { var length: Long }
interface SyncRAInputStream { fun read(position: Long, buffer: ByteArray, offset: Int, len: Int): Int }

interface SyncRAOutputStream {
	fun write(position: Long, buffer: ByteArray, offset: Int, len: Int): Unit
	fun flush(): Unit = Unit
}

open class SyncStreamBase : Closeable, SyncRAInputStream, SyncRAOutputStream, SyncLengthStream {
	val smallTemp = ByteArray(16)
	fun read(position: Long): Int
}

class SyncStream(val base: SyncStreamBase, override var position: Long = 0L) : Extra by Extra.Mixin(), Closeable, SyncInputStream, SyncPositionStream, SyncOutputStream, SyncLengthStream {
	val available: Long
	fun clone() = SyncStream(base, position)
}

inline fun <T> SyncStream.keepPosition(callback: () -> T): T

class SliceSyncStreamBase(internal val base: SyncStreamBase, internal val baseStart: Long, internal val baseEnd: Long) :
	SyncStreamBase()

class FillSyncStreamBase(val fill: Byte, override var length: Long) : SyncStreamBase()

fun FillSyncStream(fillByte: Int = 0, length: Long = Long.MAX_VALUE)
fun MemorySyncStream(data: ByteArray = EMPTY_BYTE_ARRAY)
fun MemorySyncStream(data: ByteArrayBuilder)
inline fun MemorySyncStreamToByteArray(initialCapacity: Int = 4096, callback: SyncStream.() -> Unit): ByteArray
val SyncStream.hasLength: Boolean
val SyncStream.hasAvailable: Boolean
fun SyncStream.toByteArray(): ByteArray

class MemorySyncStreamBase(var data: ByteArrayBuilder) : SyncStreamBase() {
	constructor(initialCapacity: Int = 4096)
	var ilength: Int
	fun checkPosition(position: Long)
}

fun SyncStream.sliceStart(start: Long = 0L): SyncStream
fun SyncStream.sliceHere(): SyncStream

fun SyncStream.slice(range: IntRange): SyncStream
fun SyncStream.slice(range: LongRange): SyncStream
fun SyncStream.sliceWithBounds(start: Long, end: Long): SyncStream

fun SyncStream.sliceWithSize(position: Long, length: Long): SyncStream
fun SyncStream.sliceWithSize(position: Int, length: Int): SyncStream
fun SyncStream.readSlice(length: Long): SyncStream
fun SyncStream.readStream(length: Int): SyncStream
fun SyncStream.readStream(length: Long): SyncStream

fun SyncInputStream.readStringz(charset: Charset = UTF8): String
fun SyncInputStream.readStringz(len: Int, charset: Charset = UTF8): String
fun SyncInputStream.readString(len: Int, charset: Charset = UTF8): String
fun SyncOutputStream.writeString(string: String, charset: Charset = UTF8): Unit

fun SyncInputStream.readExact(out: ByteArray, offset: Int, len: Int): Unit

fun SyncInputStream.read(data: ByteArray): Int
fun SyncInputStream.read(data: UByteArray): Int

fun SyncInputStream.readBytesExact(len: Int): ByteArray
fun SyncOutputStream.writeStringz(str: String, charset: Charset = UTF8)
fun SyncOutputStream.writeStringz(str: String, len: Int, charset: Charset = UTF8)

fun SyncInputStream.readBytes(len: Int): ByteArray
fun SyncOutputStream.writeBytes(data: ByteArray): Unit
fun SyncOutputStream.writeBytes(data: ByteArray, position: Int, length: Int)

val SyncStream.eof: Boolean

fun SyncInputStream.readU8(): Int
fun SyncInputStream.readS8(): Int

fun SyncInputStream.readU16LE(): Int
fun SyncInputStream.readU24LE(): Int
fun SyncInputStream.readU32LE(): Long

fun SyncInputStream.readS16LE(): Int
fun SyncInputStream.readS24LE(): Int
fun SyncInputStream.readS32LE(): Int
fun SyncInputStream.readS64LE(): Long

fun SyncInputStream.readF32LE(): Float
fun SyncInputStream.readF64LE(): Double

fun SyncInputStream.readU16BE(): Int
fun SyncInputStream.readU24BE(): Int
fun SyncInputStream.readU32BE(): Long

fun SyncInputStream.readS16BE(): Int
fun SyncInputStream.readS24BE(): Int
fun SyncInputStream.readS32BE(): Int
fun SyncInputStream.readS64BE(): Long

fun SyncInputStream.readF32BE(): Float
fun SyncInputStream.readF64BE(): Double

fun SyncStream.readAvailable(): ByteArray

fun SyncInputStream.readUByteArray(count: Int): UByteArray

fun SyncInputStream.readShortArrayLE(count: Int): ShortArray
fun SyncInputStream.readShortArrayBE(count: Int): ShortArray

fun SyncInputStream.readCharArrayLE(count: Int): CharArray
fun SyncInputStream.readCharArrayBE(count: Int): CharArray

fun SyncInputStream.readIntArrayLE(count: Int): IntArray
fun SyncInputStream.readIntArrayBE(count: Int): IntArray

fun SyncInputStream.readLongArrayLE(count: Int): LongArray
fun SyncInputStream.readLongArrayBE(count: Int): LongArray

fun SyncInputStream.readFloatArrayLE(count: Int): FloatArray
fun SyncInputStream.readFloatArrayBE(count: Int): FloatArray

fun SyncInputStream.readDoubleArrayLE(count: Int): DoubleArray
fun SyncInputStream.readDoubleArrayBE(count: Int): DoubleArray

fun SyncOutputStream.write8(v: Int): Unit
fun SyncOutputStream.write16LE(v: Int): Unit
fun SyncOutputStream.write24LE(v: Int): Unit
fun SyncOutputStream.write32LE(v: Int): Unit
fun SyncOutputStream.write32LE(v: Long): Unit
fun SyncOutputStream.write64LE(v: Long): Unit
fun SyncOutputStream.writeF32LE(v: Float): Unit
fun SyncOutputStream.writeF64LE(v: Double): Unit

fun SyncOutputStream.write16BE(v: Int): Unit
fun SyncOutputStream.write24BE(v: Int): Unit
fun SyncOutputStream.write32BE(v: Int): Unit
fun SyncOutputStream.write32BE(v: Long): Unit
fun SyncOutputStream.write64BE(v: Long): Unit
fun SyncOutputStream.writeF32BE(v: Float): Unit
fun SyncOutputStream.writeF64BE(v: Double): Unit

fun SyncStreamBase.toSyncStream(position: Long = 0L): SyncStream
fun ByteArray.openSync(mode: String = "r"): SyncStream 
fun ByteArray.openAsync(mode: String = "r"): AsyncStream
fun String.openSync(charset: Charset = UTF8): SyncStream
fun String.openAsync(charset: Charset = UTF8): AsyncStream

fun SyncOutputStream.writeStream(source: SyncInputStream): Unit
fun SyncInputStream.copyTo(target: SyncOutputStream): Unit
fun SyncStream.writeToAlign(alignment: Int, value: Int = 0)
fun SyncStream.skip(count: Int): SyncStream
fun SyncStream.skipToAlign(alignment: Int)
fun SyncStream.truncate()
fun SyncOutputStream.writeCharArrayLE(array: CharArray)
fun SyncOutputStream.writeShortArrayLE(array: ShortArray)
fun SyncOutputStream.writeIntArrayLE(array: IntArray)
fun SyncOutputStream.writeLongArrayLE(array: LongArray)
fun SyncOutputStream.writeFloatArrayLE(array: FloatArray)
fun SyncOutputStream.writeDoubleArrayLE(array: DoubleArray)
fun SyncOutputStream.writeCharArrayBE(array: CharArray)
fun SyncOutputStream.writeShortArrayBE(array: ShortArray)
fun SyncOutputStream.writeIntArrayBE(array: IntArray)
fun SyncOutputStream.writeLongArrayBE(array: LongArray)
fun SyncOutputStream.writeFloatArrayBE(array: FloatArray)
fun SyncOutputStream.writeDoubleArrayBE(array: DoubleArray)

// Variable Length

fun SyncInputStream.readU_VL(): Int
fun SyncInputStream.readS_VL(): Int
fun SyncOutputStream.writeU_VL(v: Int): Unit
fun SyncOutputStream.writeS_VL(v: Int): Unit
fun SyncOutputStream.writeStringVL(str: String, charset: Charset = UTF8): Unit
fun SyncStream.readStringVL(charset: Charset = UTF8): String
fun SyncInputStream.readExactTo(buffer: ByteArray, offset: Int = 0, length: Int
```

### Asynchronous

```kotlin
interface AsyncBaseStream : AsyncCloseable
interface AsyncInputOpenable { suspend fun openRead(): AsyncInputStream }

interface AsyncInputStream : AsyncBaseStream {
	suspend fun read(buffer: ByteArray, offset: Int, len: Int): Int
	suspend fun read(): Int = default
}

interface AsyncOutputStream : AsyncBaseStream {
	suspend fun write(buffer: ByteArray, offset: Int = 0, len: Int = buffer.size - offset)
	suspend fun write(byte: Int) = default
}

interface AsyncGetPositionStream : AsyncBaseStream {
	suspend fun getPosition(): Long = throw UnsupportedOperationException()
}

interface AsyncPositionStream : AsyncGetPositionStream {
	suspend fun setPosition(value: Long): Unit = throw UnsupportedOperationException()
}

interface AsyncGetLengthStream : AsyncBaseStream {
	suspend fun getLength(): Long = throw UnsupportedOperationException()
}

interface AsyncLengthStream : AsyncGetLengthStream {
	suspend fun setLength(value: Long): Unit = throw UnsupportedOperationException()
}

interface AsyncPositionLengthStream : AsyncPositionStream, AsyncLengthStream
interface AsyncInputStreamWithLength : AsyncInputStream, AsyncGetPositionStream, AsyncGetLengthStream

fun List<AsyncInputStreamWithLength>.combine(): AsyncInputStreamWithLength

operator fun AsyncInputStreamWithLength.plus(other: AsyncInputStreamWithLength): AsyncInputStreamWithLength

suspend fun AsyncInputStreamWithLength.getAvailable(): Long
suspend fun AsyncInputStreamWithLength.hasAvailable(): Boolean

interface AsyncRAInputStream {
	suspend fun read(position: Long, buffer: ByteArray, offset: Int, len: Int): Int
}

interface AsyncRAOutputStream {
	suspend fun write(position: Long, buffer: ByteArray, offset: Int, len: Int)
}

fun AsyncBaseStream.toAsyncStream(): AsyncStream

open class AsyncStreamBase : AsyncCloseable, AsyncRAInputStream, AsyncRAOutputStream, AsyncLengthStream

suspend fun AsyncStreamBase.readBytes(position: Long, count: Int): ByteArray
fun AsyncStreamBase.toAsyncStream(position: Long = 0L): AsyncStream

class AsyncStream(val base: AsyncStreamBase, var position: Long = 0L) : Extra by Extra.Mixin(), AsyncInputStream, AsyncInputStreamWithLength, AsyncOutputStream, AsyncPositionLengthStream,
	AsyncCloseable {
	fun duplicate(): AsyncStream = AsyncStream(base, position)
}

suspend fun AsyncStream.hasLength(): Boolean
suspend fun AsyncStream.hasAvailable(): Boolean

inline fun <T> AsyncStream.keepPosition(callback: () -> T): T

suspend fun AsyncPositionLengthStream.getAvailable(): Long
suspend fun AsyncPositionLengthStream.eof(): Boolean

class SliceAsyncStreamBase(
	base: AsyncStreamBase,
	baseStart: Long,
	baseEnd: Long,
	closeParent: Boolean
) : AsyncStreamBase()

fun AsyncStream.buffered(blockSize: Int = 2048, blocksToRead: Int = 0x10): AsyncStream

class BufferedStreamBase(val base: AsyncStreamBase, val blockSize: Int = 2048, val blocksToRead: Int = 0x10) : AsyncStreamBase()

suspend fun AsyncBufferedInputStream.readBufferedLine(limit: Int = 0x1000, charset: Charset = UTF8)

fun AsyncInputStream.bufferedInput(bufferSize: Int = 0x2000): AsyncBufferedInputStream

class AsyncBufferedInputStream(val base: AsyncInputStream, val bufferSize: Int = 0x2000) : AsyncInputStream {
	suspend fun require(len: Int = 1)
	suspend fun readUntil(end: Byte, including: Boolean = true, limit: Int = 0x1000): ByteArray
}

suspend fun AsyncStream.sliceWithSize(start: Long, length: Long, closeParent: Boolean = false): AsyncStream
suspend fun AsyncStream.sliceWithSize(start: Int, length: Int, closeParent: Boolean = false): AsyncStream

suspend fun AsyncStream.slice(range: IntRange, closeParent: Boolean = false): AsyncStream

suspend fun AsyncStream.slice(range: LongRange, closeParent: Boolean = false): AsyncStream

suspend fun AsyncStream.sliceWithBounds(start: Long, end: Long, closeParent: Boolean = false): AsyncStream

suspend fun AsyncStream.sliceStart(start: Long = 0L, closeParent: Boolean = false): AsyncStream
suspend fun AsyncStream.sliceHere(closeParent: Boolean = false): AsyncStream

suspend fun AsyncStream.readSlice(length: Long): AsyncStream

suspend fun AsyncStream.readStream(length: Int): AsyncStream
suspend fun AsyncStream.readStream(length: Long): AsyncStream

suspend fun AsyncInputStream.readStringz(charset: Charset = UTF8): String
suspend fun AsyncInputStream.readStringz(len: Int, charset: Charset = UTF8): String
suspend fun AsyncInputStream.readString(len: Int, charset: Charset = UTF8): String

suspend fun AsyncOutputStream.writeStringz(str: String, charset: Charset = UTF8)

suspend fun AsyncOutputStream.writeStringz(str: String, len: Int, charset: Charset = UTF8)

suspend fun AsyncOutputStream.writeString(string: String, charset: Charset = UTF8): Unit

suspend fun AsyncInputStream.readExact(buffer: ByteArray, offset: Int, len: Int)

suspend fun AsyncInputStream.read(data: ByteArray): Int
suspend fun AsyncInputStream.read(data: UByteArray): Int

val EMPTY_BYTE_ARRAY = ByteArray(0)

suspend fun AsyncInputStream.readBytesUpToFirst(len: Int): ByteArray
suspend fun AsyncInputStream.readBytesUpTo(len: Int): ByteArray
suspend fun AsyncInputStream.readBytesExact(len: Int): ByteArray
suspend fun AsyncInputStream.readU8(): Int

suspend fun AsyncInputStream.readS8(): Int
suspend fun AsyncInputStream.readU16LE(): Int
suspend fun AsyncInputStream.readU24LE(): Int
suspend fun AsyncInputStream.readU32LE(): Long
suspend fun AsyncInputStream.readS16LE(): Int
suspend fun AsyncInputStream.readS24LE(): Int
suspend fun AsyncInputStream.readS32LE(): Int
suspend fun AsyncInputStream.readS64LE(): Long
suspend fun AsyncInputStream.readF32LE(): Float
suspend fun AsyncInputStream.readF64LE(): Double
suspend fun AsyncInputStream.readU16BE(): Int
suspend fun AsyncInputStream.readU24BE(): Int
suspend fun AsyncInputStream.readU32BE(): Long
suspend fun AsyncInputStream.readS16BE(): Int
suspend fun AsyncInputStream.readS24BE(): Int
suspend fun AsyncInputStream.readS32BE(): Int
suspend fun AsyncInputStream.readS64BE(): Long
suspend fun AsyncInputStream.readF32BE(): Float
suspend fun AsyncInputStream.readF64BE(): Double
suspend fun AsyncInputStream.readAll(): ByteArray
suspend fun AsyncInputStream.readAvailable(): ByteArray

suspend fun AsyncInputStream.skip(count: Int)

suspend fun AsyncInputStream.readUByteArray(count: Int): UByteArray
suspend fun AsyncInputStream.readShortArrayLE(count: Int): ShortArray
suspend fun AsyncInputStream.readShortArrayBE(count: Int): ShortArray
suspend fun AsyncInputStream.readCharArrayLE(count: Int): CharArray
suspend fun AsyncInputStream.readCharArrayBE(count: Int): CharArray
suspend fun AsyncInputStream.readIntArrayLE(count: Int): IntArray
suspend fun AsyncInputStream.readIntArrayBE(count: Int): IntArray
suspend fun AsyncInputStream.readLongArrayLE(count: Int): LongArray
suspend fun AsyncInputStream.readLongArrayBE(count: Int): LongArray
suspend fun AsyncInputStream.readFloatArrayLE(count: Int): FloatArray
suspend fun AsyncInputStream.readFloatArrayBE(count: Int): FloatArray
suspend fun AsyncInputStream.readDoubleArrayLE(count: Int): DoubleArray
suspend fun AsyncInputStream.readDoubleArrayBE(count: Int): DoubleArray

suspend fun AsyncOutputStream.writeBytes(data: ByteArray): Unit
suspend fun AsyncOutputStream.writeBytes(data: ByteArray, position: Int, length: Int): Unit
suspend fun AsyncOutputStream.write8(v: Int): Unit
suspend fun AsyncOutputStream.write16LE(v: Int): Unit
suspend fun AsyncOutputStream.write24LE(v: Int): Unit
suspend fun AsyncOutputStream.write32LE(v: Int): Unit
suspend fun AsyncOutputStream.write32LE(v: Long): Unit
suspend fun AsyncOutputStream.write64LE(v: Long): Unit
suspend fun AsyncOutputStream.writeF32LE(v: Float): Unit
suspend fun AsyncOutputStream.writeF64LE(v: Double): Unit

suspend fun AsyncOutputStream.write16BE(v: Int): Unit
suspend fun AsyncOutputStream.write24BE(v: Int): Unit
suspend fun AsyncOutputStream.write32BE(v: Int): Unit
suspend fun AsyncOutputStream.write32BE(v: Long): Unit
suspend fun AsyncOutputStream.write64BE(v: Long): Unit
suspend fun AsyncOutputStream.writeF32BE(v: Float): Unit
suspend fun AsyncOutputStream.writeF64BE(v: Double): Unit

fun SyncStream.toAsync(): AsyncStream
fun SyncStreamBase.toAsync(): AsyncStreamBase

fun SyncStream.toAsyncInWorker(): AsyncStream
fun SyncStreamBase.toAsyncInWorker(): AsyncStreamBase

class SyncAsyncStreamBase(val sync: SyncStreamBase) : AsyncStreamBase()
class SyncAsyncStreamBaseInWorker(val sync: SyncStreamBase) : AsyncStreamBase()

suspend fun AsyncOutputStream.writeStream(source: AsyncInputStream): Long
suspend fun AsyncOutputStream.writeFile(source: VfsFile): Long
suspend fun AsyncInputStream.copyTo(target: AsyncOutputStream, chunkSize: Int = 0x10000): Long

suspend fun AsyncStream.writeToAlign(alignment: Int, value: Int = 0)

suspend fun AsyncStream.skip(count: Int): AsyncStream
suspend fun AsyncStream.skipToAlign(alignment: Int)
suspend fun AsyncStream.truncate()

suspend fun AsyncOutputStream.writeCharArrayLE(array: CharArray)
suspend fun AsyncOutputStream.writeShortArrayLE(array: ShortArray)
suspend fun AsyncOutputStream.writeIntArrayLE(array: IntArray)
suspend fun AsyncOutputStream.writeLongArrayLE(array: LongArray)
suspend fun AsyncOutputStream.writeFloatArrayLE(array: FloatArray)
suspend fun AsyncOutputStream.writeDoubleArrayLE(array: DoubleArray)
suspend fun AsyncOutputStream.writeCharArrayBE(array: CharArray)
suspend fun AsyncOutputStream.writeShortArrayBE(array: ShortArray)
suspend fun AsyncOutputStream.writeIntArrayBE(array: IntArray)
suspend fun AsyncOutputStream.writeLongArrayBE(array: LongArray)
suspend fun AsyncOutputStream.writeFloatArrayBE(array: FloatArray)
suspend fun AsyncOutputStream.writeDoubleArrayBE(array: DoubleArray)
suspend fun AsyncInputStream.readUntil(endByte: Byte, limit: Int = 0x1000): ByteArray
suspend fun AsyncInputStream.readLine(eol: Char = '\n', charset: Charset = UTF8): String
fun SyncInputStream.toAsyncInputStream(): AsyncInputStreamWithLength

fun SyncOutputStream.toAsyncOutputStream(): AsyncOutputStream

fun AsyncStream.asVfsFile(name: String = "unknown.bin"): VfsFile

suspend fun AsyncStream.readAllAsFastStream(offset: Int = 0): FastByteArrayInputStream

inline fun AsyncStream.getWrittenRange(callback: () -> Unit): LongRange

suspend fun AsyncStream.writeU_VL(value: Int)
suspend fun AsyncStream.writeStringVL(str: String, charset: Charset = UTF8)
fun AsyncInputStream.withLength(length: Long): AsyncInputStream
class MemoryAsyncStreamBase(var data: com.soywiz.kmem.ByteArrayBuilder) : AsyncStreamBase() {
	constructor(initialCapacity: Int = 4096)
	var ilength: Int
	fun checkPosition(position: Long)
}

suspend fun asyncStreamWriter(bufferSize: Int = 1024, process: suspend (out: AsyncOutputStream) -> Unit): AsyncInputStream

suspend inline fun AsyncOutputStream.writeSync(hintSize: Int = 4096, callback: SyncStream.() -> Unit)
```

## Atomic

Korio includes atomic tools (they are less efficient that atomicfu, but do not require compiler plugins):

```kotlin
fun <T> korAtomic(initial: T): KorAtomicRef<T>
fun korAtomic(initial: Boolean): KorAtomicBoolean
fun korAtomic(initial: Int): KorAtomicInt
fun korAtomic(initial: Long): KorAtomicLong
```

## Indenter

```kotlin
fun Indenter(init: Indenter.() -> Unit): Indenter
fun Indenter(str: String): Indenter

class Indenter(internal val actions: ArrayList<Action> = arrayListOf()) {
    companion object {
        fun genString(init: Indenter.() -> Unit) = gen(init).toString()
        val EMPTY: Indenter
        inline fun gen(init: Indenter.() -> Unit): Indenter
        fun single(str: String): Indenter

        fun replaceString(templateString: String, replacements: Map<String, String>): String
    }

    object INDENTS {
        operator fun get(index: Int): String
    }

    interface Action {
        interface Text : Action { val str: String }
        data class Marker(val data: Any) : Action
        data class Inline(override val str: String) : Text
        data class Line(override val str: String) : Text
        data class LineDeferred(val callback: () -> Indenter) : Action
        object EmptyLineOnce : Action
        object Indent : Action
        object Unindent : Action
    }

    fun inline(str: String): Indenter
    fun line(indenter: Indenter): Indenter
    fun line(str: String): Indenter
    fun line(str: String?)
    fun mark(data: Any): Indenter
    fun linedeferred(init: Indenter.() -> Unit): Indenter

    inline fun line(str: String, callback: () -> Unit): Indenter
    inline fun line(str: String, after: String = "", after2: String = "", callback: () -> Unit): Indenter	inline fun indent(callback: () -> Unit): Indenter

    inline operator fun String.invoke(suffix: String = "", callback: () -> Unit)
    inline operator fun String.unaryPlus() = line(this)

    inline fun String.xml(callback: () -> Unit)

    fun toString(markHandler: ((sb: StringBuilder, line: Int, data: Any) -> Unit)?, doIndent: Boolean): String
    fun toString(markHandler: ((sb: StringBuilder, line: Int, data: Any) -> Unit)?): String
    fun toString(doIndent: Boolean = true, indentChunk: String = "\t"): String
    override fun toString(): String = toString(null, doIndent = true)
}

val Indenter.SEPARATOR: Unit
fun Indenter.EMPTY_LINE_ONCE()L Unit
fun Indenter.SEPARATOR(callback: Indenter.() -> Unit)

class XmlIndenter(val indenter: Indenter) {
    inline operator fun String.invoke(callback: () -> Unit)
}

fun Indenter.xml(callback: XmlIndenter.() -> Unit)
```

## StrReader

```kotlin
fun String.reader(file: String = "file", pos: Int = 0): StrReader = StrReader(this, file, pos)

class StrReader(val str: String, val file: String = "file", var pos: Int = 0) {
	companion object {
		fun literals(vararg lits: String): Literals
	}

	val length: Int
	val available: Int
	val eof: Boolean
	val hasMore: Boolean

	fun reset()
	fun createRange(range: IntRange): TRange
	fun createRange(start: Int = this.pos, end: Int = this.pos): TRange

	fun readRange(length: Int): TRange
	inline fun slice(action: () -> Unit): String?

	fun slice(start: Int, end: Int): String
	fun peek(count: Int): String
	fun peek(): Char
	fun peekChar(): Char
	fun read(count: Int): String
	fun skipUntil(char: Char)
	fun skipUntilIncluded(char: Char)
	inline fun skipWhile(filter: (Char) -> Boolean)
	inline fun skipUntil(filter: (Char) -> Boolean)
	inline fun matchWhile(check: (Char) -> Boolean): String?
	fun readUntil(char: Char): String?
	fun readUntilIncluded(char: Char): String?
	inline fun readWhile(filter: (Char) -> Boolean): String?
	inline fun readUntil(filter: (Char) -> Boolean): String?
	fun unread(count: Int = 1): StrReader
	fun readChar(): Char
	fun read(): Char
	fun readRemaining(): String
	fun readExpect(expected: String): String
	fun skipExpect(expected: Char)
	fun expect(expected: Char): String
	fun skip(count: Int = 1): StrReader
	fun tryLit(lit: String): String?
	fun tryLitRange(lit: String): TRange?
	fun matchLit(lit: String): String?
	fun matchLitRange(lit: String): TRange?
	fun matchLitListRange(lits: Literals): TRange?
	fun skipSpaces(): StrReader

	fun matchIdentifier(): String?
	fun matchSingleOrDoubleQuoteString(): String?
	fun tryRegex(v: Regex): String?
	fun tryRegexRange(v: Regex): TRange?
	fun matchStartEnd(start: String, end: String): String?

	fun clone(): StrReader

	fun tryRead(str: String): Boolean

	class Literals(
		lits: Array<String>,
        map: MutableMap<String, Boolean>,
		val lengths: Array<Int>
	) {
		companion object {
			fun invoke(vararg lits: String): Literals
			fun fromList(lits: Array<String>): Literals
		}
		fun contains(lit: String): Boolean
		fun matchAt(str: String, offset: Int): String?
	}

	class TRange(val min: Int, val max: Int, val reader: StrReader) {
		companion object {
			fun combine(a: TRange, b: TRange): TRange
			fun combineList(list: List<TRange>): TRange?
			fun createDummy(): TRange
		}

		fun contains(index: Int): Boolean
		val file: String
		val text: String

		fun startEmptyRange(): TRange
		fun endEmptyRange(): TRange
		fun displace(offset: Int): TRange
	}

	fun readStringLit(reportErrors: Boolean = true): String
	fun tryReadInt(default: Int): Int
	fun tryReadNumber(default: Double = Double.NaN): Double
	fun tryExpect(str: String): Boolean
	fun tryExpect(str: Char): Boolean
	fun peekOffset(offset: Int = 0): Char
	fun readFloats(list: FloatArrayList = FloatArrayList(7)): FloatArrayList
	fun readIds(list: ArrayList<String> = ArrayList(7)): ArrayList<String>
	fun readInts(list: IntArrayList = IntArrayList(7)): IntArrayList
	fun tryReadId(): String?
}
```

## UUID

```kotlin
fun UUID(str: String): UUID

class UUID(val data: UByteArrayInt) {
	companion object {
        // NOTE: You should provide the SecureRandom from Krypto here
		fun randomUUID(random: Random = Random): UUID
	}

	val version: Int
	val variant: Int

	override fun toString(): String
}

```

## Serialization

### JSON

```kotlin
object Json {
    fun parse(s: String): Any?
    fun parse(s: StrReader): Any?

    fun stringify(obj: Any?, pretty: Boolean = false): String
    fun stringify(obj: Any?, b: StringBuilder)
    fun stringifyPretty(obj: Any?, b: Indenter)

    interface CustomSerializer {
        fun encodeToJson(b: StringBuilder)
    }
}

fun String.fromJson(): Any? = Json.parse(this)
fun Map<*, *>.toJson(pretty: Boolean = false): String = Json.stringify(this, pretty)
```

### YAML

```kotlin
object Yaml {
    fun decode(str: String): Any?
    fun read(str: String): Any?

    // Pseudo-internal API
    fun StrReader.tokenize(): List<Token>
    interface Token {
        data class LINE(val str: String, val level: Int) : Token
        data class ID(val str: String) : Token
        data class STR(val str: String, val ustr: String) : Token
        data class SYMBOL(val str: String) : Token
    }
}
```

### XML

XML parser comes in two flavors.

The streaming API:

```kotlin
object Xml.Stream {
    fun parse(str: String): Iterable<Xml.Element>
    fun parse(r: StrReader): Iterable<Xml.Element>
}
sealed class Xml.Element {
    class ProcessingInstructionTag(val name: String, val attributes: Map<String, String>) : Xml.Element()
    class OpenCloseTag(val name: String, val attributes: Map<String, String>) : Xml.Element()
    class OpenTag(val name: String, val attributes: Map<String, String>) : Xml.Element()
    class CommentTag(val text: String) : Xml.Element()
    class CloseTag(val name: String) : Xml.Element()
    class Text(val text: String) : Xml.Element()
}
```

The SimpleXML-like API:

```kotlin
// Creating a new Xml from Data
fun Xml(str: String): Xml
fun String.toXml(): Xml
suspend fun VfsFile.readXml(): Xml

// Encoding and decoding Xml entities
object Xml.Entities {
    fun encode(str: String): String
    fun decode(str: String): String
    fun decode(r: StrReader): String
}

class Xml {
    companion object {
        // To create nodes
        fun Tag(tagName: String, attributes: Map<String, Any?>, children: List<Xml>): Xml
        fun Text(text: String): Xml
        fun Comment(text: String): Xml
        fun parse(str: String): Xml
    }

    enum class Type { NODE, TEXT, COMMENT }

    // Node Type Information
    val type: Type
    val isText: Boolean
    val isComment: Boolean
    val isNode: Boolean

    val name: String
    val nameLC: String

    val attributes: Map<String, String>
    val attributesLC: Map<String, T>

    val descendants: Iterable<Xml>
    val allChildren: List<Xml>
    val allChildrenNoComments: List<Xml>
    val allNodeChildren: List<Xml>

    val content: String
    val text: String

    val attributesStr: String
    val outerXml: String
    val innerXml: String

    fun toOuterXmlIndented(indenter: Indenter = Indenter()): Indenter
    fun childText(name: String): String?

    // Children access
    operator fun get(name: String): Iterable<Xml>
    fun children(name: String): Iterable<Xml>
    fun child(name: String): Xml?

    // Attribute reading
    fun hasAttribute(key: String): Boolean
    fun attribute(name: String): String?

    fun getString(name: String): String?
    fun getInt(name: String): Int?
    fun getLong(name: String): Long?
    fun getDouble(name: String): Double?
    fun getFloat(name: String): Float?

    fun double(name: String, defaultValue: Double = 0.0): Double
    fun float(name: String, defaultValue: Float = 0f): Float
    fun int(name: String, defaultValue: Int = 0): Int
    fun long(name: String, defaultValue: Long = 0): Long
    fun str(name: String, defaultValue: String = ""): String

    fun doubleNull(name: String): Double?
    fun floatNull(name: String): Float?
    fun intNull(name: String): Int?
    fun longNull(name: String): Long?
    fun strNull(name: String): String?

    override fun toString(): String = outerXml
}

fun Iterable<Xml>.str(name: String, defaultValue: String = ""): String
fun Iterable<Xml>.children(name: String): Iterable<Xml>
val Iterable<Xml>.allChildren: Iterable<Xml>
val Iterable<Xml>.allNodeChildren: Iterable<Xml>

val Iterable<Xml>.firstText: String?
val Iterable<Xml>.text: String
operator fun Iterable<Xml>.get(name: String): Iterable<Xml>
```

### Properties

```kotlin
class Props(private val props: LinkedHashMap<String, String> = LinkedHashMap<String, String>()) : MutableMap<String, String> by props {
	companion object {
		fun load(str: String): Props
	}

	fun deserializeAdd(str: String)
	fun deserializeNew(str: String)

	fun serialize(): String
}

suspend fun VfsFile.loadProperties(charset: Charset = UTF8): Props
suspend fun VfsFile.saveProperties(props: Props, charset: Charset = UTF8)
```

{:#kdynamic}
## KDynamic (Dynamic Access)

This functionality makes it easier to navigate from an untyped object hierarchy.

```kotlin
// To inject the KDynamic extensions in your scope
inline fun <T> KDynamic(callback: KDynamic.() -> T): T = callback(KDynamic)
inline fun <T, R> KDynamic(value: T, callback: KDynamic.(T) -> R): R = callback(KDynamic, value)

object KDynamic {
	val global: Any?

	interface Invokable {
		fun invoke(name: String, args: Array<out Any?>): Any?
	}

	fun Any?.dynamicInvoke(name: String, vararg args: Any?): Any?
	operator fun Any?.set(key: Any?, value: Any?)
	operator fun Any?.get(key: Any?): Any?

	val Any?.map: Map<Any?, Any?>
	val Any?.list: List<Any?>
	val Any?.keys: List<Any?>

	fun Any?.toNumber(): Number
	fun Any?.toBool(): Boolean
	fun Any?.toByte(): Byte
	fun Any?.toChar(): Char
	fun Any?.toShort(): Short
	fun Any?.toInt(): Int
	fun Any?.toLong(): Long
	fun Any?.toFloat(): Float
	fun Any?.toDouble(): Double

	fun Any?.toBoolOrNull(): Boolean?
	fun Any?.toIntOrNull(): Int?
	fun Any?.toLongOrNull(): Long?
	fun Any?.toDoubleOrNull(): Double?

	fun Any?.toIntDefault(default: Int = 0): Int
	fun Any?.toLongDefault(default: Long = 0L): Long
	fun Any?.toFloatDefault(default: Float = 0f): Float
	fun Any?.toDoubleDefault(default: Double = 0.0): Double

	val Any?.str: String
	val Any?.int: Int
	val Any?.bool: Boolean
	val Any?.float: Float
	val Any?.double: Double
	val Any?.long: Long

	val Any?.intArray: IntArray
	val Any?.floatArray: FloatArray
	val Any?.doubleArray: DoubleArray
	val Any?.longArray: LongArray
}
```

## Asynchronous Tools

### AsyncByteArrayDeque

```kotlin
class AsyncByteArrayDeque(bufferSize: Int = 1024) : AsyncOutputStream, AsyncInputStream {
    override suspend fun write(buffer: ByteArray, offset: Int, len: Int)
    override suspend fun read(buffer: ByteArray, offset: Int, len: Int): Int
    override suspend fun close()
}
```

### AsyncCache

```kotlin
class AsyncCache {
    suspend operator fun <T> invoke(key: String, gen: suspend () -> T): T
}

class AsyncCacheGen<T>(gen: suspend (key: String) -> T) {
    suspend operator fun invoke(key: String): T
}
```

### AsyncCloseable

```kotlin
interface AsyncCloseable {
	suspend fun close()
}
suspend inline fun <T : AsyncCloseable, TR> T.use(callback: T.() -> TR): TR

val AsyncCloseable.Companion.DUMMY: AsyncCloseable
```

### Klock integration

```kotlin
suspend fun delay(time: TimeSpan)
suspend fun CoroutineContext.delay(time: TimeSpan)
suspend fun <T> withTimeout(time: TimeSpan, block: suspend CoroutineScope.() -> T): T
```

### runBlockingNoSuspensions

When we want to execute a suspend function in all the targets including JavaScript
in the cases we know for sure that no suspensions will happen:

```kotlin
fun <T : Any> runBlockingNoSuspensions(callback: suspend () -> T): T
```

### Signals

```kotlin
class Signal<T>(onRegister: () -> Unit = {}) {
    // Dispatching
	operator fun invoke(value: T): Unit

    // Subscription manipulation
    val listenerCount: Int
    fun clear()

    // Registering/Subscribing/Waiting
	fun once(handler: (T) -> Unit): Closeable
	fun add(handler: (T) -> Unit): Closeable
	operator fun invoke(handler: (T) -> Unit): Closeable
	suspend fun waitOne(): T
    suspend fun listen(): ReceiveChannel<T>
}

fun <TI, TO> Signal<TI>.mapSignal(transform: (TI) -> TO): Signal<TO>
suspend fun Iterable<Signal<*>>.waitOne(): Any?
fun <T> Signal<T>.waitOneAsync(): Deferred<T>
suspend fun <T> Signal<T>.addSuspend(handler: suspend (T) -> Unit): Closeable
fun <T> Signal<T>.addSuspend(context: CoroutineContext, handler: suspend (T) -> Unit): Closeable
suspend fun <T> Signal<T>.waitOne(timeout: TimeSpan): T?
suspend fun <T> Signal<T>.waitOneOpt(timeout: TimeSpan?): T?
suspend inline fun <T> Map<Signal<Unit>, T>.executeAndWaitAnySignal(callback: () -> Unit): T
suspend inline fun <T> Iterable<Signal<T>>.executeAndWaitAnySignal(callback: () -> Unit): Pair<Signal<T>, T>
suspend inline fun <T> Signal<T>.executeAndWaitSignal(callback: () -> Unit): T
```

## Checksum

```kotlin
fun SimpleChecksum.compute(data: ByteArray, offset: Int = 0, len: Int = data.size - offset): Int
fun ByteArray.checksum(checksum: SimpleChecksum): Int

fun SyncInputStream.checksum(checksum: SimpleChecksum): Int
suspend fun AsyncInputStream.checksum(checksum: SimpleChecksum): Int
suspend fun AsyncInputOpenable.checksum(checksum: SimpleChecksum): Int

interface SimpleChecksum {
	val initialValue: Int
	fun update(old: Int, data: ByteArray, offset: Int = 0, len: Int = data.size - offset): Int
}
```

### Standard (Adler32, CRC32)

```kotlin
com.soywiz.korio.util.checksum.Adler32
com.soywiz.korio.util.checksum.CRC32
```

## Encoding

### Escaping and Quoting

```kotlin
// Escaping and quoting
fun String.escape(): String // C-Style \xNN
fun String.uescape(): String  // Unicode-Style \uNNNN

fun String?.quote(): String
fun String?.uquote(): String
val String?.quoted: String

// Unescaping and unquoting
fun String.unescape(): String

fun String.unquote(): String
val String.unquoted: String

// Check if quoted
fun String.isQuoted(): Boolean
```

### Base64

```kotlin
fun String.fromBase64IgnoreSpaces(): ByteArray
fun String.fromBase64(): ByteArray
fun ByteArray.toBase64(): String

object Base64 {
	fun decode(str: String): ByteArray
	fun decode(src: ByteArray, dst: ByteArray): Int

	fun encode(src: String, charset: Charset): String
	fun encode(src: ByteArray): String
}
```

You can create multiline base64 with:

```kotlin
myByteArray.chunked(64).joinToString("\n")
```

### Hex

```kotlin
val List<String>.unhexIgnoreSpaces: ByteArray
val String.unhexIgnoreSpaces: ByteArray
val String.unhex: ByteArray
val ByteArray.hex: String // Hex in lower case

val Int.hex: String // Adds 0x prefix
val Int.shex: String

object Hex {
	val DIGITS_UPPER: String
	val DIGITS_LOWER: String

	fun isHexDigit(c: Char): Boolean

	fun decodeChar(c: Char): Int // Returns -1 if not hex
	fun decode(str: String): ByteArray

	fun encodeCharLower(v: Int): Char
	fun encodeCharUpper(v: Int): Char
	fun encodeLower(src: ByteArray): String
	fun encodeUpper(src: ByteArray): String
}
```

### CType

```kotlin
fun Char.isWhitespaceFast(): Boolean // Faster than isWhitepsace specially on javascript because do not use regular expressions
fun Char.isDigit(): Boolean
fun Char.isLetter(): Boolean
fun Char.isLetterOrDigit(): Boolean
fun Char.isLetterOrUnderscore(): Boolean
fun Char.isLetterDigitOrUnderscore(): Boolean
fun Char.isLetterOrDigitOrDollar(): Boolean
val Char.isNumeric: Boolean
fun Char.isPrintable(): Boolean
val Char.isPossibleFloatChar: Boolean
```

{:#compression}
## Compression

Korio includes Deflate, GZIP, ZLib and LZMA compressions out of the box working on all the targets.

It defines a `CompressionMethod` interface:

```kotlin
// Asynchronous API
interface CompressionMethod {
    suspend fun uncompress(reader: BitReader, out: AsyncOutputStream): Unit
    suspend fun compress(i: BitReader, o: AsyncOutputStream, context: CompressionContext): Unit
}

// Synchronous API
fun CompressionMethod.uncompress(i: SyncInputStream, o: SyncOutputStream)
fun CompressionMethod.compress(i: SyncInputStream, o: SyncOutputStream, context: CompressionContext)
```

It also provides several extension methods for compressing/decompressing data:

```kotlin
fun ByteArray.uncompress(method: CompressionMethod, outputSizeHint: Int): ByteArray
fun ByteArray.compress(method: CompressionMethod, context: CompressionContext, outputSizeHint: Int): ByteArray

suspend fun AsyncInputStreamWithLength.uncompressed(method: CompressionMethod): AsyncInputStream
suspend fun AsyncInputStreamWithLength.compressed(method: CompressionMethod, context: CompressionContext): AsyncInputStream
```

{:#compression_standard}
### Standard (Deflate, GZIP, ZLib and LZMA)

And the CompressionMethod singletons/classes:

```kotlin
com.soywiz.korio.compression.deflate.Deflate
com.soywiz.korio.compression.deflate.GZIP
com.soywiz.korio.compression.deflate.GZIPNoCrc
com.soywiz.korio.compression.deflate.ZLib
com.soywiz.korio.compression.lzma.Lzma
```

## Language

```kotlin
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
enum class Language(val iso6391: String, val iso6392: String) {
	JAPANESE("ja", "jpn"),
	ENGLISH("en", "eng"),
	FRENCH("fr", "fra"),
	SPANISH("es", "spa"),
	GERMAN("de", "deu"),
	ITALIAN("it", "ita"),
	DUTCH("nl", "nld"),
	PORTUGUESE("pt", "por"),
	RUSSIAN("ru", "rus"),
	KOREAN("ko", "kor"),
	CHINESE("zh", "zho"),
	;

	companion object {
		val BY_ID: Map<String, Language>
		operator fun get(id: String): Language?

		val SYSTEM_LANGS: List<Language>
		val SYSTEM: Language

		var CURRENT: Language
	}
}
```

## Delegates

### Lazy

## lazyVar

```kotlin
class lazyVar<T : Any>(val callback: () -> T) {
    var current: T? = null
    operator fun getValue(obj: Any, property: KProperty<*>): T
    operator fun setValue(obj: Any, property: KProperty<*>, value: T)
}
```

## ThreadLocal

```kotlin
class threadLocal<T>(val gen: () -> T) {
	inline operator fun getValue(thisRef: Any?, property: KProperty<*>): T
	inline operator fun setValue(thisRef: Any?, property: KProperty<*>, value: T)
}

abstract class NativeThreadLocal<T>() {
    abstract fun initialValue(): T
	fun get(): T
	fun set(value: T)
}
```

### Redirected / Transformed

```kotlin
inline fun <V> (() -> KProperty0<V>).redirected(): RedirectFieldGen
inline fun <V> (() -> KMutableProperty0<V>).redirected(): = RedirectMutableFieldGen
inline fun <V> KMutableProperty0<V>.redirected(): RedirectMutableField
inline fun <V> KProperty0<V>.redirected(): RedirectField

fun <V, R> KMutableProperty0<V>.transformed(transform: (V) -> R, reverseTransform: (R) -> V): TransformedMutableField
fun <V, R> KProperty0<V>.transformed(transform: (V) -> R): TransformedField

class RedirectField<V>(val redirect: KProperty0<V>)
class RedirectMutableField<V>(val redirect: KMutableProperty0<V>)
class RedirectMutableFieldGen<V>(val redirect: () -> KMutableProperty0<V>)
class RedirectFieldGen<V>(val redirect: () -> KProperty0<V>)
class TransformedField<V, R>(val prop: KProperty0<V>, val transform: (V) -> R)
class TransformedMutableField<V, R>(val prop: KMutableProperty0<V>, val transform: (V) -> R, val reverseTransform: (R) -> V)
```

Example:

```kotlin
class A {
    var z: Int = 10
    val i: Int = 10
}

class B(val a: A) {
    var z: Int by a::z.redirected()
    val y: Int by this::z.redirected()
    val i: Int by a::i.redirected()
    val l: Int by { a::i }.redirected()
    val r: Int by { a::z }.redirected()
}
```

## Once and AsyncOnce

```kotlin
class Once {
	inline operator fun invoke(callback: () -> Unit)
}

class AsyncOnce<T> {
	suspend operator fun invoke(callback: suspend () -> T): T
}
```

## Number Tools

### Parsing

Allocation-free parsing from substrings (used in `StrReader`):

```kotlin
object NumberParser {
    fun parseInt(str: String, start: Int, end: Int, radix: Int = 10): Int
    fun parseDouble(str: String, start: Int = 0, end: Int = str.length): Double
}
```

### Stringifying

```kotlin
fun Int.toStringUnsigned(radix: Int): String
fun Long.toStringUnsigned(radix: Int): String

// Do not include .0 suffix
val Float.niceStr: String
val Double.niceStr: String

// Consistent toString on all the targets
fun Double.toStringDecimal(decimalPlaces: Int, skipTrailingZeros: Boolean = false): String
fun Float.toStringDecimal(decimalPlaces: Int, skipTrailingZeros: Boolean = false): String
```

## Array tools

```kotlin
inline operator fun ByteArray.set(o: Int, v: Int)
inline operator fun ByteArray.set(o: Int, v: Long)

fun List<BooleanArray>.join(): BooleanArray
fun List<ByteArray>.join(): ByteArray
fun List<ShortArray>.join(): ShortArray
//fun List<CharArray>.join(): CharArray
fun List<IntArray>.join(): IntArray
fun List<LongArray>.join(): LongArray
fun List<FloatArray>.join(): FloatArray
fun List<DoubleArray>.join(): DoubleArray

fun BooleanArray.indexOf(v: Boolean, startOffset: Int = 0, endOffset: Int = this.size, default: Int = -1): Int
fun ByteArray.indexOf(v: Byte, startOffset: Int = 0, endOffset: Int = this.size, default: Int = -1): Int
fun ShortArray.indexOf(v: Short, startOffset: Int = 0, endOffset: Int = this.size, default: Int = -1): Int
//fun CharArray.indexOf(v: Char, startOffset: Int = 0, endOffset: Int = this.size, default: Int = -1): Int
fun IntArray.indexOf(v: Int, startOffset: Int = 0, endOffset: Int = this.size, default: Int = -1): Int
fun LongArray.indexOf(v: Long, startOffset: Int = 0, endOffset: Int = this.size, default: Int = -1): Int
fun FloatArray.indexOf(v: Float, startOffset: Int = 0, endOffset: Int = this.size, default: Int = -1): Int
fun DoubleArray.indexOf(v: Double, startOffset: Int = 0, endOffset: Int = this.size, default: Int = -1): Int
```

## Network

### MimeType

```kotlin
fun VfsFile.mimeType(): MimeType

class MimeType(val mime: String, val exts: List<String>) : Vfs.Attribute {
	companion object {
		val APPLICATION_OCTET_STREAM = MimeType("application/octet-stream", listOf("bin"))
		val APPLICATION_JSON = MimeType("application/json", listOf("json"))
		val IMAGE_PNG = MimeType("image/png", listOf("png"))
		val IMAGE_JPEG = MimeType("image/jpeg", listOf("jpg", "jpeg"))
		val IMAGE_GIF = MimeType("image/gif", listOf("gif"))
		val TEXT_HTML = MimeType("text/html", listOf("htm", "html"))
		val TEXT_PLAIN = MimeType("text/plain", listOf("txt", "text"))
		val TEXT_CSS = MimeType("text/css", listOf("css"))
		val TEXT_JS = MimeType("application/javascript", listOf("js"))

		fun register(mimeType: MimeType)
		fun register(vararg mimeTypes: MimeType)
		fun register(mime: String, vararg exsts: String)

		fun getByExtension(ext: String, default: MimeType
	}
}
```

### QueryString

```kotlin
object QueryString {
	fun decode(str: CharSequence): Map<String, List<String>>
	fun encode(map: Map<String, List<String>>): String
	fun encode(vararg items: Pair<String, String>): String
}
```

### HostWithPort

```kotlin
data class HostWithPort(val host: String, val port: Int) {
	companion object {
		fun parse(str: String, defaultPort: Int): HostWithPort
	}
}
```

### URL

```kotlin
fun createBase64URLForData(data: ByteArray, contentType: String): String

fun URL(url: String): URL
fun URL(
    scheme: String?,
    userInfo: String?,
    host: String?,
    path: String,
    query: String?,
    fragment: String?,
    opaque: Boolean = false,
    port: Int = DEFAULT_PORT
): URL

data class URL {
    val isOpaque: Boolean,
    val scheme: String?,
    val userInfo: String?,
    val host: String?,
    val path: String,
    val query: String?,
    val fragment: String?,
    val defaultPort: Int

    val user: String?
    val password: String?
    val isHierarchical: Boolean

    val port: Int
    val fullUrl: String

    val fullUrlWithoutScheme: String
    val pathWithQuery: String

    fun toUrlString(includeScheme: Boolean = true, out: StringBuilder = StringBuilder()): StringBuilder

    val isAbsolute: Boolean

    override fun toString(): String
    fun toComponentString(): String
    fun resolve(path: URL): URL

    companion object {
        val DEFAULT_PORT = 0
        fun isAbsolute(url: String): Boolean
        fun resolve(base: String, access: String): String
        fun decodeComponent(s: String, charset: Charset = UTF8, formUrlEncoded: Boolean = false): String
        fun encodeComponent(s: String, charset: Charset = UTF8, formUrlEncoded: Boolean = false): String
    }
}
```

### TCP Client and Server

```kotlin
suspend fun createTcpClient(secure: Boolean = false): AsyncClient
suspend fun createTcpServer(port: Int = AsyncServer.ANY_PORT, host: String = "127.0.0.1", backlog: Int = 511, secure: Boolean = false): AsyncServer
suspend fun createTcpClient(host: String, port: Int, secure: Boolean = false): AsyncClient

interface AsyncClient : AsyncInputStream, AsyncOutputStream, AsyncCloseable {
    val connected: Boolean
    suspend fun connect(host: String, port: Int)
    override suspend fun read(buffer: ByteArray, offset: Int, len: Int): Int
    override suspend fun write(buffer: ByteArray, offset: Int, len: Int)
    override suspend fun close()

    object Stats {
        val writeCountStart: AtomicLong
        val writeCountEnd: AtomicLong
        val writeCountError: AtomicLong
    }

    companion object {
        suspend operator fun invoke(host: String, port: Int, secure: Boolean = false): AsyncClient
        suspend fun create(secure: Boolean = false): AsyncClient
        suspend fun createAndConnect(host: String, port: Int, secure: Boolean = false): AsyncClient
    }
}

interface AsyncServer {
    val requestPort: Int
    val host: String
    val backlog: Int
    val port: Int

    companion object {
        val ANY_PORT = 0
        suspend operator fun invoke(port: Int, host: String = "127.0.0.1", backlog: Int = -1): AsyncServer
    }

    suspend fun accept(): AsyncClient
    suspend fun listen(handler: suspend (AsyncClient) -> Unit): Closeable
    suspend fun listen(): ReceiveChannel<AsyncClient>
}
```

### Http Client and Server

#### Common

```kotlin
interface Http {
    companion object {
        val Date = DateFormat("EEE, dd MMM yyyy HH:mm:ss z")
        fun TemporalRedirect(uri: String): RedirectException
        fun PermanentRedirect(uri: String): RedirectException
    }

    enum class Methods : Method {
        ALL, OPTIONS, GET, HEAD,
        POST, PUT, DELETE,
        TRACE, CONNECT, PATCH,
    }

    interface Method {
        val name: String

        companion object {
            val OPTIONS = Methods.OPTIONS
            val GET = Methods.GET
            val HEAD = Methods.HEAD
            val POST = Methods.POST
            val PUT = Methods.PUT
            val DELETE = Methods.DELETE
            val TRACE = Methods.TRACE
            val CONNECT = Methods.CONNECT
            val PATCH = Methods.PATCH

            fun values(): List<Method>
            val valuesMap: Map<String, Method>

            operator fun get(name: String): Method
            operator fun invoke(name: String): Method = this[name]
        }
    }

    data class CustomMethod(val _name: String) : Method {
        val nameUC: String
        override val name: String
        override fun toString(): String
    }

    open class HttpException(
        val statusCode: Int,
        val msg: String = "Error$statusCode",
        val statusText: String = HttpStatusMessage.CODES[statusCode] ?: "Error$statusCode",
        val headers: Http.Headers = Http.Headers()
    ) : IOException("$statusCode $statusText - $msg") {
        companion object {
            fun unauthorizedBasic(realm: String = "Realm", msg: String = "Unauthorized"): Nothing
        }
    }

    data class Auth(
        val user: String,
        val pass: String,
        val digest: String
    ) {
        companion object {
            fun parse(auth: String): Auth
        }

        fun validate(expectedUser: String, expectedPass: String, realm: String
        suspend fun checkBasic(realm: String = "Realm", check: suspend Auth.() -> Boolean)
    }

    class Request(val uri: String, val headers: Http.Headers) {
        val path: String
        val queryString: String
        val getParams: QueryString
        val absoluteURI: String
    }

    class Response {
        val headers = arrayListOf<Pair<String, String>>()
        fun header(key: String, value: String)
    }

    data class Headers(val items: List<Pair<String, String>>) : Iterable<Pair<String, String>> {
        constructor(vararg items: Pair<String, String>)
        constructor(map: Map<String, String>)
        constructor(str: String?)

        override fun iterator(): Iterator<Pair<String, String>>

        operator fun get(key: String): String?
        fun getAll(key: String): List<String>
        fun getFirst(key: String): String?

        fun toListGrouped(): List<Pair<String, List<String>>>

        fun withAppendedHeaders(newHeaders: List<Pair<String, String>>): Headers

        fun withReplaceHeaders(newHeaders: List<Pair<String, String>>): Headers
        fun withAppendedHeaders(vararg newHeaders: Pair<String, String>): Headers
        fun withReplaceHeaders(vararg newHeaders: Pair<String, String>): Headers
        fun containsAll(other: Http.Headers): Boolean

        operator fun plus(that: Headers): Headers

        companion object {
            fun fromListMap(map: Map<String?, List<String>>): Headers
            fun parse(str: String?): Headers
            val ContentLength = "Content-Length"
            val ContentType = "Content-Type"
        }
    }

    data class RedirectException(val code: Int = 307, val redirectUri: String) : Http.HttpException(code, HttpStatusMessage(code))
}
```

#### Client

```kotlin
fun createHttpClient() = defaultHttpFactory.createClient()

abstract class HttpClient protected constructor() {
    var ignoreSslCertificates: Boolean = false

    data class Response(
        val status: Int,
        val statusText: String,
        val headers: Http.Headers,
        val content: AsyncInputStream
    ) {
        val success: Boolean = status < 400
        suspend fun readAllBytes(): ByteArray
        val responseCharset: Charset
        suspend fun readAllString(charset: Charset = responseCharset): String
        suspend fun checkErrors(): Response

        fun withStringResponse(str: String, charset: Charset = UTF8): Response
        fun <T> toCompletedResponse(content: T): CompletedResponse
    }

    data class CompletedResponse<T>(
        val status: Int,
        val statusText: String,
        val headers: Http.Headers,
        val content: T
    ) {
        val success = status < 400
    }

    data class RequestConfig(
        val followRedirects: Boolean = true,
        val throwErrors: Boolean = false,
        val maxRedirects: Int = 10,
        val referer: String? = null,
        val simulateBrowser: Boolean = false
    )

    suspend fun request(
        method: Http.Method,
        url: String,
        headers: Http.Headers = Http.Headers(),
        content: AsyncStream? = null,
        config: RequestConfig = RequestConfig()
    ): Response

    suspend fun requestAsString(
        method: Http.Method,
        url: String,
        headers: Http.Headers = Http.Headers(),
        content: AsyncStream? = null,
        config: RequestConfig = RequestConfig()
    ): CompletedResponse<String>

    suspend fun requestAsBytes(
        method: Http.Method,
        url: String,
        headers: Http.Headers = Http.Headers(),
        content: AsyncStream? = null,
        config: RequestConfig = RequestConfig()
    ): CompletedResponse<ByteArray>

    suspend fun readBytes(url: String, config: RequestConfig = RequestConfig()): ByteArray
    suspend fun readString(url: String, config: RequestConfig = RequestConfig()): String
    suspend fun readJson(url: String, config: RequestConfig = RequestConfig()): Any?
}

// Delayed
fun HttpClient.delayed(ms: Long) = DelayedHttpClient(ms, this)
open class DelayedHttpClient(val delayMs: Long, val parent: HttpClient) : HttpClient()

class FakeHttpClient(val redirect: HttpClient? = null) : HttpClient() {
    val log = arrayListOf<String>()
    fun getAndClearLog(): List<String>

    var defaultResponse =
        HttpClient.Response(200, "OK", Http.Headers(), "LogHttpClient.response".toByteArray(UTF8).openAsync())

    class ResponseBuilder {
        private var responseCode = 200
        private var responseContent = "LogHttpClient.response".toByteArray(UTF8)
        private var responseHeaders = Http.Headers()

        fun response(content: String, code: Int = 200, charset: Charset = UTF8)
        fun response(content: ByteArray, code: Int = 200)
        fun redirect(url: String, code: Int = 302): Unit

        fun ok(content: String)
        fun notFound(content: String = "404 - Not Found")
        fun internalServerError(content: String = "500 - Internal Server Error")
    }

    data class Rule(
        val method: Http.Method?,
        val url: String? = null,
        val headers: Http.Headers? = null
    ) {
        fun matches(method: Http.Method, url: String, headers: Http.Headers, content: ByteArray?): Boolean
    }

    fun onRequest(
        method: Http.Method? = null,
        url: String? = null,
        headers: Http.Headers? = null
    ): ResponseBuilder
}

fun LogHttpClient() = FakeHttpClient()

object HttpStatusMessage {
    val CODES: Map<Int, String>
    operator fun invoke(code: Int): String
}

object HttpStats {
    val connections: AtomicLong
    val disconnections: AtomicLong
    override fun toString(): String
}

interface HttpFactory {
    fun createClient(): HttpClient
    fun createServer(): HttpServer
}

class ProxiedHttpFactory(var parent: HttpFactory) : HttpFactory by parent

fun setDefaultHttpFactory(factory: HttpFactory)
fun httpError(code: Int, msg: String): Nothing
```

##### Endpoint and Rest

```kotlin
fun HttpFactory.createClientEndpoint(endpoint: String)
fun createHttpClientEndpoint(endpoint: String) = createHttpClient().endpoint(endpoint)

interface HttpClientEndpoint {
    suspend fun request(
        method: Http.Method,
        path: String,
        headers: Http.Headers = Http.Headers(),
        content: AsyncStream? = null,
        config: HttpClient.RequestConfig = HttpClient.RequestConfig()
    ): HttpClient.Response
}

internal data class Request(
    val method: Http.Method,
    val path: String,
    val headers: Http.Headers,
    val content: AsyncStream?
) {
    suspend fun format(format: String = "{METHOD}:{PATH}:{CONTENT}"): String
}

class FakeHttpClientEndpoint(val defaultMessage: String = "{}") : HttpClientEndpoint {
	private val log: ArrayList<Request>
	private var responsePointer = 0
	private val responses: ArrayList<HttpClient.Response>()

	fun addResponse(code: Int, content: String)
	fun addOkResponse(content: String)
	fun addNotFoundResponse(content: String)
	override suspend fun request(
		method: Http.Method,
		path: String,
		headers: Http.Headers,
		content: AsyncStream?,
		config: HttpClient.RequestConfig
	): HttpClient.Response

	suspend fun capture(format: String = "{METHOD}:{PATH}:{CONTENT}", callback: suspend () -> Unit): List<String>
}

fun HttpClient.endpoint(endpoint: String): HttpClientEndpoint
```

```kotlin
fun HttpClientEndpoint.rest(): HttpRestClient
fun HttpClient.rest(endpoint: String): HttpRestClient
fun HttpFactory.createRestClient(endpoint: String, mapper: ObjectMapper): HttpRestClient

class HttpRestClient(val endpoint: HttpClientEndpoint) {
    suspend fun request(method: Http.Method, path: String, request: Any?, mapper: ObjectMapper = Mapper): Any

    suspend fun head(path: String): Any
    suspend fun delete(path: String): Any
    suspend fun get(path: String): Any
    suspend fun put(path: String, request: Any): Any
    suspend fun post(path: String, request: Any): Any
}
```

#### Server (HTTP and WebSockets)

```kotlin
fun createHttpServer() = defaultHttpFactory.createServer()

open class HttpServer protected constructor() : AsyncCloseable {
    companion object {
        operator fun invoke() = defaultHttpFactory.createServer()
    }

    abstract class BaseRequest(
        val uri: String,
        val headers: Http.Headers
    ) : Extra by Extra.Mixin() {
        private val parts by lazy { uri.split('?', limit = 2) }
        val path: String by lazy { parts[0] }
        val queryString: String by lazy { parts.getOrElse(1) { "" } }
        val getParams by lazy { QueryString.decode(queryString) }
        val absoluteURI: String by lazy { uri }
    }

    abstract class WsRequest(
        uri: String,
        headers: Http.Headers,
        val scope: CoroutineScope
    ) : BaseRequest(uri, headers) {
        abstract fun reject()

        abstract fun close()
        abstract fun onStringMessage(handler: suspend (String) -> Unit)
        abstract fun onBinaryMessage(handler: suspend (ByteArray) -> Unit)
        abstract fun onClose(handler: suspend () -> Unit)
        abstract fun send(msg: String)
        abstract fun send(msg: ByteArray)

        fun sendSafe(msg: String)
        fun sendSafe(msg: ByteArray)

        fun stringMessageStream(): ReceiveChannel<String>
        fun binaryMessageStream(): ReceiveChannel<ByteArray>
        fun anyMessageStream(): ReceiveChannel<Any>
    }

    val requestConfig = RequestConfig()

    data class RequestConfig(
        val beforeSendHeadersInterceptors: MutableMap<String, suspend (Request) -> Unit> = LinkedHashMap()
    ) : Extra by Extra.Mixin() {
        // TODO:
        fun registerComponent(component: Any, dependsOn: List<Any>): Unit = TODO()
    }

    abstract class Request constructor(
        val method: Http.Method,
        uri: String,
        headers: Http.Headers,
        val requestConfig: RequestConfig = RequestConfig()
    ) : BaseRequest(uri, headers), AsyncOutputStream {
        val finalizers = arrayListOf<suspend () -> Unit>()

        fun getHeader(key: String): String?
        fun getHeaderList(key: String): List<String>
        fun removeHeader(key: String)
        fun addHeader(key: String, value: String)
        fun replaceHeader(key: String, value: String)

        protected abstract suspend fun _handler(handler: (ByteArray) -> Unit)
        protected abstract suspend fun _endHandler(handler: () -> Unit)
        protected abstract suspend fun _sendHeader(code: Int, message: String, headers: Http.Headers)
        protected abstract suspend fun _write(data: ByteArray, offset: Int = 0, size: Int = data.size - offset)
        protected abstract suspend fun _end()

        suspend fun handler(handler: (ByteArray) -> Unit)
        suspend fun endHandler(handler: () -> Unit)

        suspend fun readRawBody(maxSize: Int = 0x1000): ByteArray
        fun setStatus(code: Int, message: String = HttpStatusMessage(code))

        override suspend fun write(buffer: ByteArray, offset: Int, len: Int)
        suspend fun end()
        suspend fun end(data: ByteArray)
        suspend fun write(data: String, charset: Charset = UTF8)
        suspend fun end(data: String, charset: Charset = UTF8)
        override suspend fun close()
    }

    suspend fun allHandler(handler: suspend (BaseRequest) -> Unit)
    open val actualPort: Int = 0

    suspend fun websocketHandler(handler: suspend (WsRequest) -> Unit): HttpServer
    suspend fun httpHandler(handler: suspend (Request) -> Unit): HttpServer
    suspend fun listen(port: Int = 0, host: String = "127.0.0.1"): HttpServer
    suspend fun listen(port: Int = 0, host: String = "127.0.0.1", handler: suspend (Request) -> Unit): HttpServer
    final override suspend fun close()
}

class FakeRequest(
    method: Http.Method,
    uri: String,
    headers: Http.Headers = Http.Headers(),
    val body: ByteArray = EMPTY_BYTE_ARRAY,
    requestConfig: HttpServer.RequestConfig
) : HttpServer.Request(method, uri, headers, requestConfig) {
    var outputHeaders: Http.Headers = Http.Headers()
    var outputStatusCode: Int = 0
    var outputStatusMessage: String = ""
    var output: String = ""
    val log = arrayListOf<String>()
}
```

### WebSocket Client

```kotlin
suspend fun WebSocketClient(
    url: String,
    protocols: List<String>? = null,
    origin: String? = null,
    wskey: String? = "wskey",
    debug: Boolean = false
): WebSocketClient

abstract class WebSocketClient {
    val url: String
    val protocols: List<String>?

    val onOpen: Signal<Unit>
    val onError: Signal<Throwable>
    val onClose: Signal<Unit>

    val onBinaryMessage: Signal<ByteArray>
    val onStringMessage: Signal<String>
    val onAnyMessage: Signal<Any>

    open fun close(code: Int = 0, reason: String = ""): Unit
    open suspend fun send(message: String): Unit
    open suspend fun send(message: ByteArray): Unit
}

suspend fun WebSocketClient.readString(): String
suspend fun WebSocketClient.readBinary(): ByteArray

class WebSocketException(message: String) : IOException(message)
```

## StringExt

```kotlin
operator fun String.Companion.invoke(arrays: IntArray, offset: Int = 0, size: Int
fun String_fromIntArray(arrays: IntArray, offset: Int = 0, size: Int = arrays.size - offset): Stringarrays.size - offset): String
fun String_fromCharArray(arrays: CharArray, offset: Int = 0, size: Int
fun String.format(vararg params: Any): String
fun String.splitKeep(regex: Regex): List<String>
fun String.replaceNonPrintableCharacters(replacement: String = "?"): String
fun String.toBytez(len: Int, charset: Charset = UTF8): ByteArray
fun String.toBytez(charset: Charset = UTF8): ByteArray
fun String.indexOfOrNull(char: Char, startIndex: Int = 0): Int?
fun String.lastIndexOfOrNull(char: Char, startIndex: Int = lastIndex): Int?
fun String.splitInChunks(size: Int): List<String>
fun String.substr(start: Int): String
fun String.substr(start: Int, length: Int): String
fun String.eachBuilder(transform: StringBuilder.(Char) -> Unit): String
fun String.transform(transform: (Char) -> String): String
fun String.parseInt(): Int
val String.quoted: String
fun String.toCharArray(): CharArray
```