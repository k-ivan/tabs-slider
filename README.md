# Tabs
Easy to use tabs slider, written in pure JavaScript.

## Demo
[Codepen demo](https://codepen.io/k-ivan/full/XBEdep/)

## Simple to use
Include the plugin styles
```html
<link rel="stylesheet" href="css/tabs.css">
```
Or If you use SASS, you can import a sass source
```scss
@import 'tabs';
```
We also need a simple markup
```html
<div class="tabs">
  <div class="tabs__content">
    <div class="tabs__section">
      I'm the first tab
    </div>
    <div class="tabs__section">
      second tab - more text<br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo eos, iusto laboriosam voluptatem at reiciendis vel, facilis repellendus totam excepturi earum saepe rerum ullam!
    </div>
    <div class="tabs__section">
      Welcome to third tab
    </div>
  </div>
</div>
```
Add the plugin to the page
```html
<script src="js/tabsSlider.js"></script>
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
  draggable: true,
  underline: true,
  heightAnimate: true,
  duration: 500,
  easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
});

```
**`elem`** (string | HTMLElement)  
  selector or element

**`animate`** (bool)  
  animated tabs switching

**`slide`** (integer)  
  initial slide

**`draggable`** (bool)  
  mouse or touch events

**`underline`**  (bool)  
  active tab underline

**`heightAnimate`**  (bool)  
  height animation, only if the animation option is true

**`duration`** (integer)  
  animation time, only if the animation option is true

**`easing`** (string)

## Public methods
Public methods for working with the plugin

### `.show(index)`
This method allows you to programmatically navigate to the specified index to the slide.

### `.destroy()`
This method stops the plugin. To reinitialize, you need to call the constructor again.

## Events
Plugin provides an event for changing tabs
```js
var elem = document.querySelector('.tabs');
var tabs = new TabsSlider(tabs);

elem.addEventListener('tabChange', function(evt) {
  console.log(evt.detail)
  // currentSlide
  // currentIndex
  // currentTab
  // prevIndex
})
```
