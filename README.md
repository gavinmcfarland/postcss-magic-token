# PostCSS Magic Token [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Magic Token] references design tokens intelligently based on the current property and selector rules.

> This plugin is still in experimentation.

Token lookup happens in the following order. When a specific token is not available, it checks for the next available token.

```
component
  -> element
    -> property
      -> variant
        -> value
```

### Default values

```css
.example {
  border: tok();
}
```

Becomes

```css
/* e.g. --border: 1px solid red; */
.example {
  border: var(--border);
}
```

### Current property

```css
.example {
  color: tok(primary);
}
```

Becomes

```css
/* e.g. --color-primary: red; */
.example {
  color: var(--color-primary);
}
```

### Element specific

```css
h2 {
  font-size: tok();
}
```

Becomes

```css
/* e.g. --h2-font-size: 2.5em; */
h2 {
  font-size: var(--h2-font-size, var(--font-size));
}
```

### Component specific

Indicate a component using either of the following formats `.Component`, `Component`, `com-ponent`.

```css
.Component {
  color: tok(primary);
}
```

Becomes

```css
/* e.g. --component-color-primary: purple; */
.Component {
  color: var(--component-color-primary, var(--color-primary));
}
```

###  Property variants

Some properties can include variants. For example margin and padding include variants for inline and block spacing.

```css
.example {
  padding: tok(small);
}
```

Becomes

```css
/* e.g. --padding-block-small: 1em;
        --padding-inline-small: 0.5em; */
.padding {
  padding: var(--padding-block-small, var(--padding-small))
    var(--padding-inline-small, var(--padding-small))
    var(--padding-block-small, var(--padding-small))
    var(--padding-inline-small, var(--padding-small));
}
```


## Usage

Add [PostCSS Magic Token] to your project:

```bash
npm install postcss-magic-token --save-dev
```

Use **PostCSS Magic Token** to process your CSS:

```js
const postcssMagicToken = require('postcss-magic-token');

postcssMagicToken.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssMagicToken = require('postcss-magic-token');

postcss([
  postcssMagicToken(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[cli-img]: https://img.shields.io/travis/limitlessloop/postcss-magic-token/master.svg
[cli-url]: https://travis-ci.org/limitlessloop/postcss-magic-token
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-magic-token.svg
[npm-url]: https://www.npmjs.com/package/postcss-magic-token

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Magic Token]: https://github.com/limitlessloop/postcss-magic-token
