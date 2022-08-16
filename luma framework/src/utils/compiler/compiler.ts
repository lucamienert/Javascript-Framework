import { parseCode, parseExpression } from "./parser"

const expressionCache = new Map()
const codeCache = new Map()

export function compileExpression(src: string) {
    let expression = expressionCache.get(src)
 
    if (!expression) {
        expression = parseExpression(src)
        expressionCache.set(src, expression)
    }

    if (typeof expression === 'function')
        return expression

    return function evaluateExpression(context, tempVars) {
        let value = expression.exec(context, tempVars)
        for (let filter of expression.filters) {
            const args = filter.argExpressions.map(evaluateArgExpression, context)
            value = filter.effect(value, ...args)
        }
        return value
    }
}

export function compileCode(src: string) {
    let code = codeCache.get(src)

    if (!code) {
        code = parseCode(src)
        codeCache.set(src, code)
    }

    if (typeof code === 'function')
        return code

    const context = {}
    return function evaluateCode(state, tempVars) {
        let i = 0
        function next() {
            Object.assign(context, tempVars)
            if (i < code.limiters.length) {
                const limiter = code.limiters[i++]
                const args = limiter.argExpressions.map(evaluateArgExpression, state)
                limiter.effect(next, context, ...args)
            } else {
                code.exec(state, tempVars)
            }
        }
        next()
    }
}

const evaluateArgExpression = (argExpression): any => argExpression(this)