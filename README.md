# PostCSS Magic Token [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Magic Token] references design tokens intelligently based on the current property and selector rules.

> This plugin is in experimentation at the moment.

__Current property__

```css
.example {
  color: tok(primary);
}
```

Will become

```css
.example {
  color: var(--color-primary);
}
```

__Component specific__

```css
.Component {
  color: tok(primary);
}
```

Will become

```css
.Component {
  color: var(--component-color-primary, --color-primary);
}
```

__Property specific__

```css
.example {
  padding: tok(small);
}
```

```css
.example {
  padding: var(--padding-inline-small, var(--padding-small)) var(--padding-block-small, var(--padding-small));
}
```



## Usage

Add [PostCSS Magic Token] to your project:

```bash
npm install postcss-magic-token --save-dev
```

Use **PostCSS Magic Token** to process your CSS:

```js
const postcssDesignToken = require('postcss-magic-token');

postcssDesignToken.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssDesignToken = require('postcss-magic-token');

postcss([
  postcssDesignToken(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

**PostCSS Magic Token** runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

...

[cli-img]: https://img.shields.io/travis/limitlessloop/postcss-magic-token/master.svg
[cli-url]: https://travis-ci.org/limitlessloop/postcss-magic-token
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-magic-token.svg
[npm-url]: https://www.npmjs.com/package/postcss-magic-token

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Magic Token]: https://github.com/limitlessloop/postcss-magic-token
