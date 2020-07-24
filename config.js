module.exports = {
	rules: [
		{
			property: [/(padding|margin)(?:-(\w+))?/],
			result: ({ req, i, before }) => {
				let children = [
					['top', 'block'],
					['right', 'inline'],
					['bottom', 'block'],
					['left', 'inline']
				]

				before('property', [req.property, children[i][1], ...req.keywords])

				// console.log(`I'm a padding, margin rule`)
			}
		},
		{
			property: ['color'],
			result: () => {
				// console.log(`I'm a color rule`)
			}
		}
	]
}
