export default {
  supportCSS3(prop) {
    let prefix = ['-webkit-', '-moz-', '-ms-', ''];
    let root = document.documentElement;

    function camelCase(str) {
      return str.replace(/\-([a-z])/gi, function(match, $1) {
        return $1.toUpperCase();
      });
    }
    for (let i = prefix.length - 1; i >= 0; i--) {
      let css3prop;
      if (~prefix[i].indexOf('ms')) {
        css3prop = 'msTransform';
      } else {
        css3prop = camelCase(prefix[i] + prop);
      }

      if (css3prop in root.style) {
        return css3prop;
      }
    }
    return false;
  },

  transitionEnd() {
    let transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'mozTransitionEnd'
    };
    let root = document.documentElement;
    for (let name in transitions) {
      if (root.style[name] !== undefined) {
        return transitions[name];
      }
    }
    return false;
  },

  support3d() {
    if (!window.getComputedStyle) {
      return false;
    }
    let el = document.createElement('div'),
      has3d,
      transform = this.supportCSS3('transform');

    document.body.insertBefore(el, null);

    el.style[transform] = 'translate3d(1px,1px,1px)';
    has3d = getComputedStyle(el)[transform];

    document.body.removeChild(el);

    return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
  },

  passiveSupported() {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {}
  }

};
