import postcss from 'postcss';
import fs from 'fs-extra'

const regex = {
	ref: /\b(?:ref|tok)\(([^()]*)\)/g,
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

function getRef(rule) {
	let tokens = getConfig('config.js').tokens

	let ref = {
		args: '',
		property: '',
		element: '',
		components: [],
		outputs: [],
		position: '',
		length: '',
		lookups: []
	}

	let reversedString = rule.selector.split(' ').reverse().join(' ')

	reversedString.replace(regex.component, (match, p1) => {
		ref.components.push(p1.toLowerCase())
	})


	rule.walkDecls(decl => {
		ref.property = decl.prop

		let values = decl.value.split(' ')

		ref.length = values.length;

		for (let i = 0, len = values.length; i < len; i++) {
			ref.position = i
			let value = values[i]

			value.replace(regex.ref, (match, p1) => {
				if (p1) ref.args = p1
			})
		}

	})

	reversedString.replace(regex.element, (match, p1) => {
		ref.element = p1
	})

	// TODO: Needs refactoring so that logic is stored in config
	for (let token of tokens) {
		for (let property of token.property) {
			if (ref.property === property) {

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

	if (ref.property) {
		ref.lookups.push([ref.property])
	}

	if (ref.property && ref.args) {
		ref.lookups.push([ref.property, ref.args])
	}

	if (ref.property && ref.args && ref.outputs.length > 1) {
		ref.lookups.push([ref.property, '{{variant}}', ref.args])
	}

	if (ref.element && ref.property) {
		ref.lookups.push([ref.element, ref.property])
	}

	if (ref.element && ref.property && ref.args) {
		ref.lookups.push([ref.element, ref.property, ref.args])
	}

	if (ref.components) {
		let thing = [];
		for (let component of ref.components) {
			thing.push(component)

			// if (ref.property) {
			// 	ref.lookups.push([...thing, ref.property])
			// }

			if (ref.property && ref.args) {
				ref.lookups.push([...thing, ref.property, ref.args])
			}

			// if (ref.element && ref.property) {
			// 	ref.lookups.push([...thing, ref.element, ref.property])
			// }

			if (ref.element && ref.property && ref.args) {
				ref.lookups.push([...thing, ref.element, ref.property, ref.args])
			}


		}

	}


	return ref
}

function replaceRef(value, ref) {

	return value.replace(regex.ref, () => {
		let newValue = [];
		for (let variant of ref.outputs) {

			let string = '';

			let newLookups = replaceLookups(ref.lookups, variant)

			for (let i = 0, len = newLookups.length; i < len; i++) {

				if (i < 1) {
					string = `var(--${newLookups[i].join('-')})`
				}
				else {
					string = `var(--${newLookups[i].join('-')}, ${string})`
				}
			}
			newValue.push(string)
		}
		return newValue.join(' ');
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
