import postcss from 'postcss';
import fs from 'fs-extra'

const regex = {
	ref: /\b(?:ref|tok)\(([^()]*)\)/g,
	component: /\.?([A-Z]\w+)|(?=\S*['-])([\w-]+)/g,
	element: /(?<![:.])\b(\w+)\b/g

}

function getConfig(path) {
	var config;

	if (fs.existsSync(process.cwd() + '/' + path)) {
		config = require(process.cwd() + '/' + path)
	}

	return config
}

function getRef(rule) {
	let tokens = getConfig('config.js').tokens

	let ref = {
		parts: {
			args: '',
			property: '',
			element: '',
			components: []
		},
		outputs: [],
		position: '',
		length: ''
	}

	let reversedString = rule.selector.split(' ').reverse().join(' ')

	/* Push component to array */
	reversedString.replace(regex.component, (match, p1) => {
		ref.parts.components.push(p1.toLowerCase())
	})

	// if (ref.components)

	if (ref.parts.components) {

		ref.parts.components.reverse()

	}


	rule.walkDecls(decl => {
		ref.parts.property = decl.prop

		let values = decl.value.split(' ')

		ref.length = values.length;

		for (let i = 0, len = values.length; i < len; i++) {
			ref.position = i
			let value = values[i]

			value.replace(regex.ref, (match, p1) => {
				if (p1) ref.parts.args = p1
			})
		}

	})

	/* Add element if element present */
	reversedString.replace(regex.element, (match, p1) => {
		ref.parts.element = p1
	})

	for (let token of tokens) {
		for (let property of token.property) {
			if (ref.parts.property === property) {

				if (ref.length === 1) {
					ref.outputs.push(token.children[0][1]);
					ref.outputs.push(token.children[1][1]);
					ref.outputs.push(token.children[2][1]);
					ref.outputs.push(token.children[3][1]);
				}

				if (ref.length === 2) {
					if (ref.position === 0) {
						ref.outputs.push(token.children[0][1]);
						ref.outputs.push(token.children[2][1]);
					}
					if (ref.position === 1) {
						ref.outputs.push(token.children[1][1]);
						ref.outputs.push(token.children[3][1]);
					}
				}

				if (ref.length === 3) {
					if (ref.position === 0) {
						ref.outputs.push(token.children[0][1]);
					}
					if (ref.position === 1) {
						ref.outputs.push(token.children[1][1]);
						ref.outputs.push(token.children[3][1]);
					}
					if (ref.position === 2) {
						ref.outputs.push(token.children[2][1]);
					}
				}
			}

		}
	}

	if (ref.outputs.length === 0) {
		ref.outputs = ['']
	}

	return ref
}

function replaceRef(value, ref) {

	return value.replace(regex.ref, () => {

		let newValue = []

		for (let variant of ref.outputs) {


			let array = []
			let array2 = []

			for (let [key, value] of Object.entries(ref.parts)) {

				if (key === 'property') {
					if (variant != '') {
						array.push(variant)
					}
				}

				if (Array.isArray(value)) {
					if (value != '') {
						array.push(...value.reverse())
					}
				}
				else {
					if (value != '') {
						array.push(value)
					}

				}
			}

			array.reverse()


			for (let i = 0, len = array.length; i < len; i++) {
				array2.push(array.join('-'))
				array.shift()
			}


			array2.reverse()


			let string = ''
			for (let i = 0, len = array2.length; i < len; i++) {
				if (i < 1) {
					string = `var(--${array2[i]})`
				}
				else {
					string = `var(--${array2[i]}, ${string})`
				}

			}

			newValue.push(string)
		}


		return newValue.join(' ')

	})
}


export default postcss.plugin('postcss-design-token', opts => {
	console.log({ opts }); // eslint-disable-line no-console

	return (root) => {

		root.walkRules(rule => {

			let ref = getRef(rule)

			rule.walkDecls(decl => {

				decl.value = replaceRef(decl.value, ref)
			})
		})
	};
});
