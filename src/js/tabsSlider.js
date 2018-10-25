import './polyfill';
import Helpers from './helpers';

export default class TabsSlider {

  constructor(elem, options) {
    if (typeof elem === 'string') {
      elem = document.querySelector(elem);
    }
    if (!(elem instanceof HTMLElement)) {
      throw Error('Check the argument of the selector');
    }

    this.tabs = elem;
    if (!this.tabs || this.tabs.activated) return;

    this.tabs.activated = true;
    this.tabs.setAttribute('data-tabs-active', '');

    this.settings = Object.assign({
      animate: true,
      slide: 0,
      draggable: true,
      underline: true,
      heightAnimate: true,
      duration: 500,
      easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
    }, options);

    this._init();
  }

  get dragEvent() {
    return {
      // eslint-disable-next-line
      hasTouch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch),
      event() {
        return {
          start: (this.hasTouch) ? 'touchstart' : 'mousedown',
          move: (this.hasTouch) ? 'touchmove' : 'mousemove',
          end: (this.hasTouch) ? 'touchend' : 'mouseup',
          leave: (this.hasTouch) ? 'touchleave' : 'mouseleave'
        };
      }
    };
  }

  _init() {
    this.bar = this.tabs.querySelector('.tabs__bar');
    this.content = this.tabs.querySelector('.tabs__content');
    this.controls = Array.prototype.slice.call(this.bar.querySelectorAll('.tabs__controls'));
    this.sections = Array.prototype.slice.call(this.content.querySelectorAll('.tabs__section'));
    this.offset = 0;
    this.currentId = this.settings.slide;
    this.slidesLen = this.sections.length;

    this.transformProperty = Helpers.supportCSS3('transform');
    this.transitionProperty = Helpers.supportCSS3('transition');
    this.has3d = Helpers.support3d();

    this._dimmensions();
    this.settings.underline && this._setSliderLine();

    if (this.settings.draggable) {
      this.dragX;
      this.dragY;
      this.delta;
      this.target;
      this.dragFlag = false;
    }

    this._addEvents();
    this.show(this.currentId);
  }

  destroy() {
    this._removeEvents();

    this.bar.removeChild(this.line);
    this.content.classList.remove('has-grab');
    this.controls[this.currentId].classList.remove('is-active');
    this.tabs.removeAttribute('data-tabs-active');

    delete this.tabs.activated;
    Object.keys(this).forEach(property => {
      delete this[property];
    });
  }

  _addEvents() {
    this.handlerClick = this._selectTab.bind(this);
    this.handlerResize = this._responsive.bind(this);
    this._handlerTabFocus = this._handlerTabFocus.bind(this);

    this.bar.addEventListener('click', this.handlerClick);
    // Tab key focus inside slides
    this.content.addEventListener('focus', this._handlerTabFocus, true);
    window.addEventListener('resize', this.handlerResize);

    if (this.settings.draggable) {
      this.handlerStart = this._start.bind(this);
      this.handlerMove = this._move.bind(this);
      this.handlerEnd = this._end.bind(this);
      this.handlerLeave = this._leave.bind(this);

      const dragEvent = this.dragEvent.event();
      this.content.addEventListener(dragEvent.start, this.handlerStart);
      this.content.addEventListener(dragEvent.move, this.handlerMove);
      this.content.addEventListener(dragEvent.end, this.handlerEnd);
      this.content.addEventListener(dragEvent.leave, this.handlerLeave);
    }
  }

  _removeEvents() {
    this.bar.removeEventListener('click', this.handlerClick);
    this.content.removeEventListener('focus', this._handlerTabFocus, true);
    window.removeEventListener('resize', this.handlerResize);

    if (this.settings.draggable) {
      const dragEvent = this.dragEvent.event();
      this.content.removeEventListener(dragEvent.start, this.handlerStart);
      this.content.removeEventListener(dragEvent.move, this.handlerMove);
      this.content.removeEventListener(dragEvent.end, this.handlerEnd);
      this.content.removeEventListener(dragEvent.leave, this.handlerLeave);
    }
  }

  // Tab key breaks slider
  // thx Oleg Korsunsky
  // https://wd.dizaina.net/en/internet-maintenance/js-sliders-and-the-tab-key/
  _handlerTabFocus(e) {
    const section = e.target.closest('.tabs__section');
    if (!section) return;

    this.tabs.scrollLeft = 0;
    this.content.scrollTop = 0;

    setTimeout(() => {
      this.content.scrollTop = 0;
      this.tabs.scrollLeft = 0;
    }, 0);

    const id = this.sections.indexOf(section);
    this.show(id);
  }

  _setSliderLine() {
    this.line = Object.assign(document.createElement('span'), {
      'className': 'tabs__line'
    });


    this.bar.appendChild(this.line);
    this._moveSliderLine();
    if (this.settings.animate) {
      // eslint-disable-next-line max-len
      this.line.style[this.transitionProperty] = `
        ${this.transformProperty} ${this.settings.duration}ms ${this.settings.easing}
      `;
    }
  }

  _moveSliderLine() {
    const {offsetWidth, offsetLeft} = this.controls[this.currentId];

    let transformLine = (this.has3d) ? `translate3d(${offsetLeft}px, 0, 0)` : `translateX(${offsetLeft}px)`;
    this.line.style.transform = `${transformLine} scaleX(${offsetWidth / this.w})`;
  }

  _dimmensions() {
    this.w = this.tabs.offsetWidth;
    const h = this.sections[this.currentId].offsetHeight;

    this.sections.forEach(item => {
      item.style.width = `${this.w}px`;
    });

    this.content.style['width'] = `${this.w * this.sections.length}px`;
    this.content.style['height'] = `${h}px`;
  }

  _responsive() {
    this._dimmensions();

    this.offset = -(this.w * this.currentId);
    this._moveSlide(this.offset, false);
  }

  _selectTab(e) {
    const target = e.target.closest('.tabs__controls');
    if (!target) return;

    e.preventDefault();
    const slideId = this.controls.indexOf(target);
    if (slideId === this.currentId) return;

    this.show(slideId);
  }

  _moveSlide(offset, hasAnimate = true) {

    if (this.settings.animate) {
      let duration = hasAnimate ? this.settings.duration : 0;
      let style = [`${this.transformProperty} ${duration}ms ${this.settings.easing}`];

      if (this.settings.heightAnimate) {
        style.push(`height ${duration}ms ${this.settings.easing}`);
      }

      this.content.style[this.transitionProperty] = style.join(',');
    }

    if (this.has3d) {
      this.content.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
    } else {
      this.content.style[this.transformProperty] = `translateX(${offset}px)`;
    }

    const h = this.sections[this.currentId].offsetHeight;
    this.content.style['height'] = `${h}px`;

    this.settings.underline && this._moveSliderLine();
  }

  _start(e) {
    if (this.dragFlag) return;

    let drag;
    if (e.targetTouches) {
      this.target = e.targetTouches[0].target;
      drag = e.targetTouches[0];
    } else {
      drag = e;
    }

    this.delta = 0;
    this.dragX = drag.pageX || drag.clientX;
    this.dragY = drag.pageY || drag.clientY;
    this.dragFlag = true;

    this.content.classList.add('has-grab');
  }

  _move(e) {
    if (!this.dragFlag) return;

    let drag;
    if (e.targetTouches) {
      if (e.targetTouches.length > 1 || this.target !== e.targetTouches[0].target) {
        return;
      }
      drag = e.targetTouches[0];
    } else {
      e.preventDefault();
      drag = e;
    }

    const currentX = drag.pageX || drag.clientX;
    const currentY = drag.pageY || drag.clientY;

    if (Math.abs(this.dragX - currentX) >= Math.abs(this.dragY - currentY)) {
      this.delta = (this.dragX - currentX) / 2;
      if (!this.settings.animate) return;

      this._moveSlide(parseInt(this.offset, 10) - this.delta, false);
    }
  }

  _end() {
    if (!this.dragFlag) return;

    const swipeTo = this.delta < 0 ? this.currentId - 1 : this.currentId + 1;

    if (Math.abs(this.delta) < 50 || (swipeTo > this.slidesLen - 1 || swipeTo < 0)) {
      this.dragFlag = false;
      this._moveSlide(this.offset);
      return;
    }
    this.dragFlag = false;
    this.target = null;
    this.show(swipeTo);
    this.content.classList.remove('has-grab');
  }

  _leave() {
    if (this.dragFlag) {
      this._moveSlide(this.offset);
      this.dragFlag = false;
      this.content.classList.remove('has-grab');
    }
  }

  recalcStyles() {
    this._responsive();
  }

  show(slide) {
    slide = Math.abs(slide);

    if (slide >= this.slidesLen) {
      slide = this.slidesLen - 1;
    }

    this.controls[this.currentId].classList.remove('is-active');

    const prevIndex = this.currentId;
    this.currentId = slide;
    this.offset = -(this.w * this.currentId);
    this._moveSlide(this.offset);
    this.controls[this.currentId].classList.add('is-active');

    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('tabChange', true, true, {
      currentIndex: this.currentId,
      prevIndex: prevIndex,
      currentSlide: this.sections[this.currentId],
      currentTab: this.controls[this.currentId]
    });
    this.tabs.dispatchEvent(event);
  }
}
