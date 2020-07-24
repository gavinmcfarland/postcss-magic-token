import postcss from 'postcss';
import fs from 'fs-extra'

// let vars = new Map;

// vars.set('property', [
// 	['property'],
// 	['property', 'keyword']
// ])

// vars.set('element', [
// 	['element', 'property', 'keyword']
// ])

// for (let [key, value] of vars) {
// 	console.log(key, value);
// }

// console.log(vars.get('property'))

const regex = {
	ref: /\b(?:tok)\(([^()]*)\)/g,
	component: /\.?([A-Z]\w+)|(?=\S*['-])([\w-]+)/g,
	element: /(?<![:.])\b(\w+)\b/g,
	placeholder: /\{\{([^{}]*)\}\}/g

}

function getConfig(path) {
	var config;

	if (fs.existsSync(process.cwd() + '/' + path)) {
		config = require(process.cwd() + '/' + path)
	}

	return config
}

function replaceLookups(lookups, variant) {
	return lookups.map((value) => {
		return value.map((item) => {
			return item.replace(regex.placeholder, variant)
		})
	})
}

function getAttrs(rule) {
	// let rules = getConfig('config.js').token

	let attrs = {}

	// Get components from selector
	attrs.components = []
	rule.selector.split(' ').reverse().join(' ').replace(regex.component, (match, p1) => {
		attrs.components.push(p1.toLowerCase())
	})

	rule.walkDecls(decl => {

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

			if (array) attrs.keywords = array
		}

	})

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

		if (attrs.keywords) vars.get('property').push([attrs.property, ...attrs.keywords])

		if (attrs.element) {

			if (attrs.keywords) vars.get('element').push([attrs.element, attrs.property, ...attrs.keywords])
		}

		if (attrs.components) {

			let components = [];
			for (let component of attrs.components) {

				components.push(component)

				vars.get('component').push([...components, attrs.property])

				if (attrs.element) {
					if (attrs.keywords) vars.get('component').push([...components, attrs.element, attrs.property, ...attrs.keywords])
				}
			}

		}

	}

	return [...vars.get('property'), ...vars.get('element'), ...vars.get('component')]
}

function getRef(rule) {

	let attrs = getAttrs(rule)

	let ref = {
		attrs
	}

	return ref
}

function createString(vars) {


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

function replaceRef(value, ref) {

	return value.replace(regex.ref, () => {

		let children = [
			['top', 'block'],
			['right', 'inline'],
			['bottom', 'block'],
			['left', 'inline']
		]

		let array = []

		for (let child in children) {

			let vars = genVars(ref.attrs)

			array.push(createString(vars))
		}

		return array.join(' ')

	})
}


export default postcss.plugin('postcss-design-token', opts => {
	// console.log({ opts }); // eslint-disable-line no-console

	return (root) => {

		root.walkRules(rule => {

			let ref = getRef(rule)

			// console.log(ref)

			rule.walkDecls(decl => {

				decl.value = replaceRef(decl.value, ref)

			})
		})
	};
});
