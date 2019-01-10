import Compiler from './compiler'

document.getElementById('input').value = '<div name="coco"><span>{{data}}</span><input type="text"/>hello {{name}}</div>'
let parsebtn = document.getElementById('parse')
parsebtn.addEventListener("click", function(){
	const tpl = document.getElementById('input').value
	console.log(tpl)
	const compiler = new Compiler(tpl)
	compiler.getAST()
})
