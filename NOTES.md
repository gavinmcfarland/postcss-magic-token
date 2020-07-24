# Outputs

```js
{
  lookups: [
    // Component
    ['component', 'element', 'property', 'keyword'],

    ['component', 'property', 'keyword'],

    // Element
    ['element', 'property', 'keyword'],
    

    // Property
    // ['group', 'property', 'keyword']
    // ['property', 'variant', 'keyword'],
    ['property', 'keyword'],

    ['property']
  ]
}


```


```js
vars: (ref) => {
  if (ref.element = 'h1' || 'h2' || 'h3' || 'h4' || 'h5' || 'h6') {
    ref.group = 'heading'
  }
}
```

```js
let ref = [
  { args: '' },
  { property: '' },
  { element: '' },
  { components: [] }
]

let ref = {
  01: {
    args: ''
  },
  02: {
    property: ''
  },
  03: {
    element: ''
  },
  04: {
    components: []
  }
}

let ref = {
  properties: [
    { args: '' },
    { property: '' },
    { element: '' },
    { components: [] }
  ],
  position: 1,
  length: 2,
  outputs: []
}


let value = {
  properties: [
    { args: '' },
    { property: '' },
    { element: '' },
    { components: [] }
  ],
  position: 1,
  length: 2,
  outputs: []
}

for (let property in properties) {
  if (property.element === 'h1' || 'h2') {
    element.before({property: 'group', value: 'heading'})
  }
}


let property = {
  name: 'padding',
  parts: [
    { args: [] },
    { element: '' },
    { components: [] }
  ]
}
```



```js

let vars = []


for (let part of parts) {
  let array = []

  array.push(part)

  function pushArray(part, args) {
    if (args) {
      for (let arg of args) {
        array.push(part, args)
      }
    }
  }

  if (part.element) {
    pushArray(part, args)
  }

  if (part.component) {
    pushArray(part, args)
  }

}

```



```js

function getAttrs() {
  // let ref = {
  //   attrs: {
  //     keywords: [],
  //     property: '',
  //     element: '',
  //     components: []
  //   }
  // }

  // Get components from selector
	rule.selector.split(' ').reverse().join(' ').replace(regex.component, (match, p1) => {
		ref.attrs.components.push(p1.toLowerCase())
  })

  rule.walkDecls(decl => {

    // Get property from decl
		ref.attrs.property = decl.prop


    // Get number of values from declaration
		ref.length = decl.value.split(' ').length;

    // Get position of value in declaration
		for (let i = 0, len = ref.length; i < len; i++) {

			ref.position = i

      // Get keywords from ref function
			values[i].replace(regex.ref, (match, p1) => {
				if (p1) ref.args = p1.replace('--', '')
			})
		}

  })
  
  // Get element from selector
  reversedString.replace(regex.element, (match, p1) => {
		ref.element = p1
	})
  
}

function replaceRef() {

}

```




```js
let vars = new Map;

vars.set('property', [
	['property'],
	['property', 'keyword']
])

vars.set('element', [
	['element', 'property', 'keyword']
])

for (let [key, value] of vars) {
	console.log(key, value);
}
```


```
getAttrs
getMeta
getVars
replaceRef




