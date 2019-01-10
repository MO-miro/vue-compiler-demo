// @flow
export function genComponentModel (
    el: ASTElement,
    value: string
  ): ?boolean {
    const baseValueExpression = '$$v'
    let valueExpression = baseValueExpression

    valueExpression = `_n(${valueExpression})`

    const assignment = `${value}=${valueExpression}`
  
    el.model = {
      value: `(${value})`,
      expression: `"${value}"`,
      callback: `function (${baseValueExpression}) {${assignment}}`
    }
  }

   
  