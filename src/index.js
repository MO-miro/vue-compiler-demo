import Compiler from './compiler'

let input = document.getElementById('input')
input.value = '<div name="coco"><span v-for="(val, key, index) in obj" >{{val}}</span><input type="text" v-model="name"/>hello {{name}}</div>'
const parsebtn = document.getElementById('parse')
let tpl = document.getElementById('input').value
let compiler = new Compiler(tpl)
input.addEventListener('change',(e) => {
	tpl = e.target.value
	compiler = new Compiler(tpl)
})

parsebtn.addEventListener('click', () => {
	console.log(tpl)
	compiler.getAST()
})

const optimizebtn = document.getElementById('optimizer')
optimizebtn.addEventListener('click', () => {
	console.log(tpl)
	compiler.optimizeAST()
})

const genbtn = document.getElementById('gen')
genbtn.addEventListener('click', () => {
	console.log(tpl)
	compiler.genCode()
})