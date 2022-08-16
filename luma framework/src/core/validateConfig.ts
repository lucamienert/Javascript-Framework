const validateConfig = (rawConfig) => {
    if(rawConfig === undefined)
        rawConfig = {}

    const resultConfig: any = {}

    if (typeof rawConfig.state === 'boolean' || rawConfig.state === 'inherit')
        resultConfig.state = rawConfig.state
    else if (typeof rawConfig.state === 'object')
        resultConfig.state = rawConfig.state
    else if (rawConfig.state === undefined)
        resultConfig.state = true
    else
        throw new Error('invalid state config: ' + rawConfig.state)
    
    if (typeof rawConfig.isolate === 'boolean' || rawConfig.isolate === 'middlewares')
        resultConfig.isolate = rawConfig.isolate
    else if (rawConfig.isolate === undefined)
        resultConfig.isolate = false
    else
        throw new Error(`invalid isolate config: ${rawConfig.isolate}, must be a boolean, undefined or 'middlewares'`)
    
    if (typeof rawConfig.root === 'boolean')
        resultConfig.root = rawConfig.root
    else if (rawConfig.root === undefined)
        resultConfig.root = false
    else
        throw new Error('invalid root config: ' + rawConfig.root)
    
    if (typeof rawConfig.heavy === 'boolean')
      resultConfig.heavy = rawConfig.heavy
    else if (rawConfig.heavy === undefined)
        resultConfig.heavy = false
    else
        throw new Error('invalid heavy config: ' + rawConfig.heavy)
    
    if (resultConfig.root && (resultConfig.isolate === true || !resultConfig.state))
      throw new Error('root components must have a state and must not be isolated')

    if (typeof rawConfig.element === 'string') {
      resultConfig.element = rawConfig.element
      resultConfig.class = 'extension'
    } else if (rawConfig.element === undefined)
      resultConfig.class = 'custom'
    else
      throw new Error(`invalid element config: ${rawConfig.element}, must be the name of a native element`)

    return resultConfig
}

export default validateConfig