import postcss from 'postcss';
// import fs from 'fs-extra'

const regex = {
	ref: /\b(?:tok)\(([^()]*)\)/g,
	component: /\.?([A-Z]\w+)|(?=\S*['-])([\w-]+)/g,
	element: /(?<![:.])\b(\w+)\b/g,
	placeholder: /\{\{([^{}]*)\}\}/g

}

// function getConfig(path) {
// 	var config;

// 	if (fs.existsSync(process.cwd() + '/' + path)) {
// 		config = require(process.cwd() + '/' + path)
// 	}

// 	return config
// }

function getAttrs(rule, decl) {
	// let rules = getConfig('config.js').token

	let attrs = {}

	// Get components from selector
	attrs.components = []
	rule.selector.split(' ').reverse().join(' ').replace(regex.component, (match, p1) => {
		attrs.components.push(p1.toLowerCase())
	})


	let values = decl.value.split(' ')

	// Get property from decl
	attrs.property = decl.prop

	// Get position of value in declaration

	for (let i = 0, len = values.length; i < len; i++) {

		let array = []

		// Get keywords from ref function
		values[i].replace(regex.ref, (match, p1) => {
			if (p1) array.push(p1.replace('--', ''))
		})

		if (array.length > 0) {
			attrs.keywords = array
		}
	}

	// Get element from selector
	rule.selector.split(' ').reverse().join(' ').replace(regex.element, (match, p1) => {
		attrs.element = p1
	})

	return attrs
}

function genVars(attrs) {

	let vars = new Map;

	vars.set('property', [])
	vars.set('element', [])
	vars.set('component', [])


	if (attrs.property) {
		vars.get('property').push([attrs.property])

		if (attrs.element) {
			vars.get('element').push([attrs.element, attrs.property])
		}

		if (attrs.components) {

			let components = [];
			for (let component of attrs.components) {

				components.push(component)

				vars.get('component').push([...components, attrs.property])

				if (attrs.element) {
					vars.get('component').push([...components, attrs.element, attrs.property])
				}
			}

		}

	}

	// To avoide messy code, we add the keywords afterwards
	if (attrs.keywords) {
		for (let [key, arrays] of vars) {
			for (let array of arrays) {
				array.push(...attrs.keywords)
			}

			// This is the only one which doesn't need the keywords
			if (key === 'property') {
				arrays.unshift([attrs.property])
			}
		}
	}

	return vars
}

function getRef(rule, decl) {

	let attrs = getAttrs(rule, decl)

	let ref = {
		attrs
	}

	return ref
}

function createString(vars) {

	vars = [...vars.get('property'), ...vars.get('element'), ...vars.get('component')]


	let string = '';


	for (let i = 0, len = vars.length; i < len; i++) {

		if (i < 1) {
			string = `var(--${vars[i].join('-')})`
		}
		else {
			string = `var(--${vars[i].join('-')}, ${string})`
		}
	}

	return string

}

function replaceRef(rule, decl) {


	var values = postcss.list.space(decl.value);


	if (decl.prop === 'padding') {

		if (values.length === 1) {
			values.push(values[0]);
		}
		if (values.length === 2) {
			values.push(values[0]);
		}
		if (values.length === 3) {
			values.push(values[1]);
		}
	}




	for (let i = 0, len = values.length; i < len; i++) {

		values[i] = values[i].replace(regex.ref, () => {

			let ref = getRef(rule, decl)
			let vars = genVars(ref.attrs)

			if (ref.attrs.property === 'padding') {

				let children = [
					['top', 'block'],
					['right', 'inline'],
					['bottom', 'block'],
					['left', 'inline']
				]

				vars.get('property').push([ref.attrs.property, children[i][1], ...ref.attrs.keywords])
			}

			return createString(vars)

		})

	}

	return values.join(' ')

}


export default postcss.plugin('postcss-design-token', () => {

	return (root) => {

		root.walkRules(rule => {

			rule.walkDecls(decl => {

				decl.value = replaceRef(rule, decl)

			})
		})
	};
});
