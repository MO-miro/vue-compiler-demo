// @flow
export  function genHandlers (
    events: ASTElementHandlers,
    native: boolean
  ): string {
    let res = native ? 'nativeOn:{' : 'on:{'
    for (const name in events) {
      const handler = events[name]
      res += `"${name}":${genHandler(name, handler)},`
    }
    return res.slice(0, -1) + '}'
}

function genHandler (
    name: string,
    handler: ASTElementHandler | Array<ASTElementHandler>
  ): string {
    if (!handler) {
      return 'function(){}'
    }
  
    if (Array.isArray(handler)) {
      return `[${handler.map(handler => genHandler(name, handler)).join(',')}]`
    }
    return  `function($event){${handler.value}}` // inline statement
  }
