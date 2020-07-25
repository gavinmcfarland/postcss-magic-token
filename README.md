# PostCSS Magic Token [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

A function for referencing design tokens and CSS variables intelligently based on the current property and the current selector.

## Usage

To reference the primary color for all `h2` elements you would write.

```css
h2 {
    color: tok(--primary);
}
```

This equals the same as writing...

```css
h2 {
    color: var(--h2-color-primary, var(--heading-color-primary, var(--color-primary, var(--color))));
}
```

In this example, first it looks for a token called `--h2-color-primary`, if this is not available it then looks to see if there is a token for `--heading-color-primary` then `--color-primary`, and then finally as a fallback `--color`.

When a specific variant of a token is not available, it checks for the next available variant. Below are some examples (some variations have been removed for simplicity).

```css
:root {
    --component-element-property-keyword: value;
    --component-property-keyword: value;
    --element-property-keyword: value;
    --property-variant-keyword: value;
    --property-keyword: value;
    --property: value;
}
```

## Examples

### Default values

```css
.default {
    border: tok();
}
```

Becomes

```css
/* e.g. --border: 1px solid red; */
.default {
    border: var(--border);
}
```

### Keyword values

```css
.keyword {
    color: tok(--primary);
}
```

Becomes

```css
/* e.g. --color-primary: red;
        --color: black; */
.keyword {
    color: var(--color-primary, var(--color));
}
```

### Element specific

```css
button {
    font-size: tok();
}
```

Becomes

```css
/* e.g. --button-font-size: 2.5em;
        --font-size: 1em; */
button {
    font-size: var(--button-font-size, var(--font-size));
}
```

### Component specific

Indicate a component using either of the following formats `.Component`, `Component`, `com-ponent`.

```css
.Component {
    color: tok(--primary);
}
```

Becomes

```css
/* e.g. --component-color-primary: purple;
        --color-primary: blue;
        --color: black; */
.Component {
    color: var(--component-color-primary, var(--color-primary, var(--color)));
}
```

###  Property variants

Some properties can include variants. For example margin and padding include variants for inline and block spacing.

```css
.variants {
    padding: tok(--small);
}
```

Becomes

```css
/* e.g. --padding-block-small: 1em;
        --padding-inline-small: 0.5em;
        --padding-small: 1em; */
.variants  {
    padding: var(--padding-block-small, var(--padding-small, var(--padding)))
        var(--padding-inline-small, var(--padding-small, var(--padding)))
        var(--padding-block-small, var(--padding-small, var(--padding)))
        var(--padding-inline-small, var(--padding-small, var(--padding)));
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
