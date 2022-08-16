const hasHandler = { has }
const allHandlers = { has, get }
const globals = new Set()

let temp: any
let globalObj: any

if (typeof window !== 'undefined') 
    globalObj = window // eslint-disable-line
else if (typeof global !== 'undefined') 
    globalObj = global // eslint-disable-line
else if (typeof self !== 'undefined') 
    globalObj = self // eslint-disable-line

globalObj.$nxCompileToSandbox = toSandbox
globalObj.$nxClearSandbox = clearSandbox

export function expose(...globalNames) {
    for (let globalName of globalNames) {
        globals.add(globalName)
    }
}

export function hide(...globalNames) {
    for (let globalName of globalNames)
        globals.delete(globalName)
}

export function hideAll() {
    globals.clear()
}

function has(target, key) {
    return globals.has(key) ? (key in target) : true
}

function get(target, key) {
    return key in temp ? temp[key] : target[key]
}

function toSandbox(obj, tempVars) {
    if (tempVars) {
        temp = tempVars
        return new Proxy(obj, allHandlers)
    }

    return new Proxy(obj, hasHandler)
}

function clearSandbox() {
    temp = undefined
}