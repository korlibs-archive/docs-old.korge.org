#!/usr/bin/env kscript

import java.io.*

fun main(args: Array<String>) {
    updateSvgTarget(File("korlibs-deps.svg"))
}

// draw.io works pretty well, but doesn't set the target="_top" or target="_blank" for links, that is a problem when using <embed src="file.svg" />
fun updateSvgTarget(file: File) {
    val oldText = file.readText()

    val svgHead = Regex("<svg(.*?)>").find(oldText)?.groupValues?.get(0) ?: error("Not a svg file")

    val newText = oldText
        // This adds target=_top so it works fine.
        .let {
            it.replace(Regex("""<a\s+(?:target=.*?\s+)?xlink:href="(.*?)">""")) {
                val link = it.groupValues[1]
                """<a target="_top" xlink:href="$link">"""
            }
        }
        // This adds a style to highlight rects with links.
        .let {
            if (it.contains("<style>")) {
                it
            } else {
                it.replace("<defs>", "\n<style>a:hover rect { stroke: black; stroke-width: 2; }</style>\n<defs>")
            }
        }
        // This adds a viewBox so styling the embed with max-width scales the SVG.
        .let {
            if (it.contains("viewBox=")) {
                it
            } else {
                val width = Regex("""width="(\d+)""").find(svgHead)?.groupValues?.get(1)?.toInt() ?: error("SVG width not set")
                val height = Regex("""height="(\d+)""").find(svgHead)?.groupValues?.get(1)?.toInt() ?: error("SVG height not set")
                it.replace(Regex("<svg(.*)width=")) {
                    val pre = it.groupValues[1]
                    """<svg$pre viewBox="0 0 $width $height" width="""
                }
            }
        }
    file.writeText(newText)
}
