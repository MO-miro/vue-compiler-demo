import Compiler from './compiler'

document.getElementById('input').value = '<div name="coco"><span v-for="(val, key, index) in obj" >{{val}}</span><input type="text"/>hello {{name}}</div>'
const parsebtn = document.getElementById('parse')
parsebtn.addEventListener('click', () => {
	const tpl = document.getElementById('input').value
	console.log(tpl)
	const compiler = new Compiler(tpl)
	compiler.getAST()
})

const optimizebtn = document.getElementById('optimizer')
optimizebtn.addEventListener('click', () => {
	const tpl = document.getElementById('input').value
	console.log(tpl)
	const compiler = new Compiler(tpl)
	compiler.optimizeAST()
})
