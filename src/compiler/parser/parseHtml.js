const tagNameReg = '([a-zA-Z_][\\w\\-\\.]*)'
const startTagOpenReg = new RegExp('^<' + tagNameReg)
const startTagCloseReg = /^\s*(\/?)>/
const endTagReg = new RegExp('^<\\/' + tagNameReg + '\\s*>')
const attrReg = /^\s+([\w_-]+)(?:=["']([\w\s\.\(\),]+)["'])?/
const doctypeReg = /^<!DOCTYPE [^>]+>/i
const commentReg = /^<!--/

export default function parseHtml(template, options) {
    let html = template,
        index = 0
        // 匹配结束标签
    const stack = []
    while (html = html.trim()) {
        if (~(index = html.indexOf('<'))) {
            if (index > 0) {
                options.handleContent(html.slice(0, index))
                advance(index)
            }
            // comment match
            const commentMatch = html.match(commentReg)
            if (commentMatch) {
                const commentEnd = html.indexOf('-->')
                advance(commentEnd + 3)
                continue
            }
            // doctype match
            const doctypeMatch = html.match(doctypeReg)
            if (doctypeMatch) {
                advance(doctypeMatch[0].length)
                continue
            }
            // tag match
            const endTagMatch = html.match(endTagReg)
            if (endTagMatch) {
                handleEndTag(endTagMatch)
                continue
            }
            const startTag = parseStartTag()
            if (startTag) {
                handleStartTag(startTag)
                continue
            }
        } else if (stack.length) {
            options.handleContent(html)
            html = ''
        } else {
            options.warn('tag not match')
            return
        }
    }

    function advance(n) {
        index += n
        html = html.substring(n)
    }

    function parseStartTag() {
        const match = html.match(startTagOpenReg)
        if (match) {
            advance(match[0].length)
            const tag = {
                tagName: match[1],
                attrsList: [],
            }
            let tagCloseMatch,
                attrMatch
            while (!(tagCloseMatch = html.match(startTagCloseReg))
                && (attrMatch = html.match(attrReg))) {
                if (attrMatch) {
                    tag.attrsList.push({
                        name: attrMatch[1],
                        value: attrMatch[2] || true,
                    })
                    advance(attrMatch[0].length)
                }
            }
            if (tagCloseMatch) {
                tag.unary = !tagCloseMatch[1]
                advance(tagCloseMatch[0].length)
            }
            return tag
        }
    }

    function handleStartTag(tag) {
        if (tag.unary) {
            stack.push(tag.tagName)
        }
        if (options.start) {
            options.start(tag)
        }
    }
    function handleEndTag(endMatch) {
        const startTagName = stack.pop() || ''
        if (startTagName !== endMatch[1]) {
            options.warn('tag is not closed correctly')
            html = ''
        } else {
            if (options.end) {
                options.end()
            }
            advance(endMatch[0].length)
        }
    }

}
