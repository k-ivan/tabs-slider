# Tabs
<p>
  <a href="https://www.npmjs.com/package/tabs-slider"><img src="https://img.shields.io/npm/v/tabs-slider.svg"></a>
  <a href="https://www.npmjs.com/package/tabs-slider"><img src="https://img.shields.io/bundlephobia/min/tabs-slider.svg"></a>
  <a href="https://www.npmjs.com/package/tabs-slider"><img src="https://img.shields.io/npm/l/tabs-slider.svg"></a>
  <a href="https://www.npmjs.com/package/tabs-slider"><img src="https://img.shields.io/npm/dt/tabs-slider.svg"></a>
</p>
Easy to use tabs slider, written in pure JavaScript.

## Please note:
Version 3 only supports **modern browsers**. To support older browsers (including IE) please use version 2 ([v2 branch](https://github.com/k-ivan/tabs-slider/tree/v2))

## Browser support
* Chrome
* Firefox
* Safari
* Android
* IOS

Thanks to [Browserstack](https://www.browserstack.com) for providing a free license, so we can start automating test in different browsers and devices.
<a href="https://www.browserstack.com">
  <img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" alt="Browserstack" width="150">
</a>

## Demo
[Codepen demo](https://codepen.io/k-ivan/full/XBEdep/)

## Simple to use
Include the plugin styles
```html
<link rel="stylesheet" href="css/tabs.css">
```
Or If you use SASS, you can import a sass source
```scss
@import './node_modules/tabs-slider/src/scss/tabs.scss';
```
We also need a simple markup
```html
<div class="tabs">
  <div class="tabs__bar-wrap">
    <div class="tabs__bar">
      <div class="tabs__controls">View</div>
      <div class="tabs__controls">General</div>
      <div class="tabs__controls">Advanced</div>
    </div>
  </div>
  <div class="tabs__content">
    <div class="tabs__section">
      I'm the first tab View
    </div>
    <div class="tabs__section">
      second tab - General<br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo eos, iusto laboriosam voluptatem at reiciendis vel, facilis repellendus totam excepturi earum saepe rerum ullam!
    </div>
    <div class="tabs__section">
      Welcome to third tab - Advanced
    </div>
  </div>
</div>
```
If you need the direction of flow from right to left, you must specify attribute `dir`
```html
<div class="tabs" dir="rtl">
```
and add an option when plugin initialization
```js
new TabsSlider('.tabs', {
  rtl: true
});
```

Add the plugin to the page
```html
<script src="js/tabsSlider.js"></script>
```
or if you are using a module bundler
```sh
npm i tabs-slider
```
```js
import TabsSlider from 'tabs-slider';
```

And now the hardest part is to initialize our plugin )
```js
new TabsSlider('.tabs');
```
And that's all.
## Options
But we can also use advanced plugin options. Available options and their default values.
```js
new TabsSlider(elem, {
  animate: true,
  slide: 0,
  rtl: false,
  draggable: true,
  underline: true,
  heightAnimate: true,
  duration: 500,
  easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
});

```
`elem` (string | HTMLElement)
  selector or element

`animate` (bool)
  animated tabs switching

`rtl` (bool)
  base direction

`slide` (integer)
  initial slide

`draggable` (bool)
  mouse or touch events

`underline`  (bool)
  active tab underline

`heightAnimate`  (bool)
  height animation, only if the animation option is true

`duration` (integer)
  animation time, only if the animation option is true

`easing` (string)

## Public methods
Public methods for working with the plugin

### `.show(index)`
This method allows you to programmatically navigate to the specified index to the slide.

### `.recalcStyles()`
This method allows you to recalculate styles, if a block with tabs was hidden or content was loaded into tabs.

### `.destroy()`
This method stops the plugin. To reinitialize, you need to call the constructor again.

## Events
Plugin provides an event for changing tabs
```js
var elem = document.querySelector('.tabs');
var tabs = new TabsSlider(elem);

elem.addEventListener('tabChange', function(evt) {
  console.log(evt.detail)
  // currentSlide
  // currentIndex
  // currentTab
  // prevIndex
})
```
