export function getAndRemoveAttr (el: ASTElement, name: string): ?string {
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