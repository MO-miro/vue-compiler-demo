// @flow
// 优化AST树
export default function optimize(root: ?ASTElement) {
    if (!root) return
    // 第一次遍历: 标记所有的静态节点.
    markStatic(root)
    // 第二次遍历：标记静态根节点
    markStaticRoots(root, false)
}

function markStatic(node: ASTNode) {
    node.static = isStatic(node)
    if (node.type === 1) {
        for (let i = 0, l = node.children.length; i < l; i++) {
            const child = node.children[i]
            markStatic(child)
            if (!child.static) {
              // 有一个子节点不是静态，则父节点也非静态
              node.static = false
            }
        }
    }
}

/**
 * 只有当一个节点是 static，拥有children且不只拥有一个的静态文本节点时才能被称为 static root。
 * 因为作者认为这种情况去做优化，其消耗会超过获得的收益。
 */
function markStaticRoots(node: ASTNode, isInFor: boolean) {
    if (node.type === 1) {
        if (node.static && node.children.length 
            && !(node.children.length === 1
            && node.children[0].type === 3)) {
                node.staticRoot = true
        } else {
            node.staticRoot = false
        }
        // 进行递归标记
        if (node.children) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                markStaticRoots(node.children[i], isInFor || !!node.for)
            }
        }
    }
}

// 是否静态节点
function isStatic(node: ASTNode): boolean {
    if (node.type === 2) { // expression
      return false
    }
    if (node.type === 3) { // text
      return true
    }
    return !!(!node.for && !node.events) // &&  Object.keys(node).every(isStaticKey)
}

// // 应该从options传入，这里写死
// const isStaticKey = () => {
//     // 'type,tag,attrsList,attrsMap,plain,parent,children,attrs' 存放静态属性
// }