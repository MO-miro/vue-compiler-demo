// @flow
import { addHandler }  from '../helpers'

// 生成v-model的render代码
export function genAssignmentCode (
  value: string,
  assignment: string
): string {
  return `${value}=${assignment}`
}

export function genModel (
  el: ASTElement,
  value: string
): ?boolean {

  let valueExpression = '$event.target.value'
  let code = genAssignmentCode(value, valueExpression)
  // 判断是否是输入法编辑器触发的
  code = `if($event.target.composing)return;${code}`
  addHandler(el, 'change', code)
  addHandler(el, 'blur', '$forceUpdate()')

  return true
}
  

   
  