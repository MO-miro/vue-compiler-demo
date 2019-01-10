// @flow

const dataExpReg = () => new RegExp(/\{\{((?:.|\n)+?)\}\}/g)
export default function parseText(text: string) : ?string {
    const result: Array<string> = []
    const dataReg = dataExpReg()
    if (!dataReg.test(text)) {
        return
    }
    let lastIndex = 0
    let match
    dataReg.lastIndex = 0
    while ((match = dataReg.exec(text))) {
        const { index } = match
        if (index > lastIndex) {
            result.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        result.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
        result.push(JSON.stringify(text.slice(lastIndex)))
    }
    return result.join('+')
}
