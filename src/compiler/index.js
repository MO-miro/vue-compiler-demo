// 编译HTML模板
// 找到对应的属性值然后传给Watch方法
// import Watcher from '../observer/Watcher'
import parse from './parser/parse'
import optimize from './optimizer'
import generate from './codegen/index'

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

	genCode() {
		console.log('=============Render code============')
		console.dir(generate(this.ast))

	}

	compile() {
		return parse(this.template)
	}
}

export default Compiler
