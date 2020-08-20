

export function extractString(str: string, delimiter: string): string[] {
    let strings: string[] = [];
    let tempStr = str[0]
    for (let i = 1; i < str.length; i++) {
        if (str[i] === delimiter) {
            strings.push(tempStr)
            tempStr = ""
        } else {
            tempStr += str[i]
        }
    }
    strings.push(tempStr)
    return strings
}