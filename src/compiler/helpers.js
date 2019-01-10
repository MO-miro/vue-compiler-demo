function getAndRemoveAttr(el: ASTElement, name: string): ?string {
  let val
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  return val
}

// 添加事件handler
function addHandler(el: ASTElement, name: string, value: string) {
  let events = el.events
  events[name] = newHandler
}

// 添加指令
function addDirective (
  el: ASTElement,
  name: string,
  rawName: string,
  value: string,
  arg: ?string,
  modifiers: ?ASTModifiers
) {
  (el.directives || (el.directives = [])).push({ name, rawName, value, arg, modifiers })
}


export {
  getAndRemoveAttr,
  addHandler,
  addDirective,
}