# PostCSS Design Token [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Design Token] references design tokens intelligently based on the current property and the current selector.

> This plugin is still in experimentation.

## Usage

To reference the primary color for all `h2` elements you would write.

```css
h2 {
  color: tok(primary);
}
```

This equals the same as writing...

```css
h2 {
  color: var(--h2-color-primary, var(--h2-color, var(--color-primary, var(--color)));
}
```

In this example, first it looks for a token called `--h2-color-primary`, if this is not available it then looks for the default `--h2-color`, when this is not available it then looks to see if there is a `--color-primary`, and then finally looking for the default `--color`.

When a specific variant of a token is not available, it checks for the next available variant. Below are some examples (some variations have been removed for simplicity).

```css
:root {
  --component-element-property-arg: value;
  --component-element-property: value;
  --component-property-arg: value;
  --component-property: value;
  --element-property-arg: value;
  --element-property: value;
  --property-variant-arg: value;
  --property-arg: value;
  --property: value;
}
```

## Examples

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
  color: var(--color-primary, var(--color));
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
/* e.g. --component-color-primary: purple;
        --color-primary: purple; */
.Component {
  color: var(--component-color-primary, var(--color-primary, var(--color)));
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
        --padding-inline-small: 0.5em;
        --padding-small: 1em; */
.padding {
  padding: var(--padding-block-small, var(--padding-small, var(--padding)))
    var(--padding-inline-small, var(--padding-small, var(--padding)))
    var(--padding-block-small, var(--padding-small, var(--padding)))
    var(--padding-inline-small, var(--padding-small, var(--padding)));
}
```


## Usage

Add [PostCSS Design Token] to your project:

```bash
npm install postcss-design-token --save-dev
```

Use **PostCSS Design Token** to process your CSS:

```js
const postcssDesignToken = require('postcss-design-token');

postcssDesignToken.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssDesignToken = require('postcss-design-token');

postcss([
  postcssDesignToken(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[cli-img]: https://img.shields.io/travis/limitlessloop/postcss-design-token/master.svg
[cli-url]: https://travis-ci.org/limitlessloop/postcss-design-token
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-design-token.svg
[npm-url]: https://www.npmjs.com/package/postcss-design-token

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Design Token]: https://github.com/limitlessloop/postcss-design-token
