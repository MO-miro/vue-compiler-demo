// 编译HTML模板
// 找到对应的属性值然后传给Watch方法
// import Watcher from '../observer/Watcher'
import parse from './parser/parse'
import optimize from './optimizer'

// const loScrateReg = () => new RegExp(/\{\{(.*)\}\}/g)
class Compiler {
	constructor(template) {
			this.template = template
			this.ast = this.compile()
	}

	getAST() {
		console.log('=============AST tree============')
		console.dir(this.ast)
	}
	
	optimizeAST() {
		console.log('=============After Optimize============')
		optimize(this.ast)
		console.dir(this.ast)
	}

	compile() {
		return parse(this.template)
	}
}

export default Compiler
