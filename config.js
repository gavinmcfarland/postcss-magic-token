module.exports = {
	rules: [
		{
			result: ({ selector, match, property, keywords, i, before }) => {
				if (/h1|h2|h3|h4|h5|h6/.test(selector.element)) {
					if (keywords) {
						before('property', ['heading', property, ...keywords])
					}
					else {
						before('property', ['heading', property])
					}
				}
			}
		},
		{
			property: /(?<property>padding|margin)(?:-(?<side>\w+))?/,
			result: ({ selector, match, property, keywords, i, before }) => {

				let sides = [
					['top', 'block'],
					['right', 'inline'],
					['bottom', 'block'],
					['left', 'inline']
				]

				let n = 0
				for (let side of sides) {
					if (match.groups.side === side[0]) {
						i = n
					}
					n++
				}

				before('property', [match.groups.property, sides[i][1], ...keywords])

				// console.log(`I'm a padding, margin rule`)
			}
		},
		{
			property: 'color',
			result: () => {
				// console.log(`I'm a color rule`)
			}
		}
	]
}
