#!/usr/bin/env kscript

import java.io.*

fun main(args: Array<String>) {
    updateSvgTarget(File("korlibs-deps.svg"))
}

// draw.io works pretty well, but doesn't set the target="_top" or target="_blank" for links, that is a problem when using <embed src="file.svg" />
fun updateSvgTarget(file: File) {
    val oldText = file.readText()
    val newText = oldText.replace(Regex("""<a\s+(?:target=.*?\s+)?xlink:href="(.*?)">""")) {
        val link = it.groupValues[1]
        """<a target="_top" xlink:href="$link">"""
    }.let {
        if (it.contains("<style>")) {
            it
        } else {
            it.replace("<defs>", "<style>a:hover rect { stroke: black; stroke-width: 2; }</style><defs>")
        }
    }
    file.writeText(newText)
}
