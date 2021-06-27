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
      rtl: false,
      draggable: true,
      underline: true,
      heightAnimate: true,
      duration: 500,
      easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
    }, options);

    this._init();
  }

  _dragEvent() {
    const hasTouch = !!(
      'ontouchstart' in window ||
      // eslint-disable-next-line no-undef
      window.DocumentTouch && document instanceof DocumentTouch
    );
    return {
      start: hasTouch ? 'touchstart' : 'mousedown',
      move: hasTouch ? 'touchmove' : 'mousemove',
      end: hasTouch ? 'touchend' : 'mouseup',
      leave: 'mouseleave'
    };
  }

  _init() {
    this.tabsBarWrap = this.tabs.querySelector('.tabs__bar-wrap');
    this.bar = this.tabs.querySelector('.tabs__bar');
    this.content = this.tabs.querySelector('.tabs__content');
    this.controls = Array.prototype.slice.call(this.bar.querySelectorAll('.tabs__controls'));
    this.sections = Array.prototype.slice.call(this.content.querySelectorAll('.tabs__section'));
    this.offset = 0;
    this.currentId = this.settings.slide;
    this.slidesLen = this.sections.length;
    this.tabsHasOverflow = false;
    this.rtl = this.settings.rtl ? 1 : -1;

    this.transformProperty = 'transform';
    this.transitionProperty = 'transition';

    this._dimmensions();
    this.settings.underline && this._setSliderLine();

    if (this.settings.draggable) {
      this.dragX;
      this.dragY;
      this.delta;
      this.target;
      this.dragFlag = false;
      this.isMoving = false;
      this.preventClick = false;
    }

    this._addEvents();
    this._checkTabsOverflow();
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
    this._handlerClick = this._selectTab.bind(this);
    this._handlerResize = this._responsive.bind(this);
    this._handlerTabFocus = this._handlerTabFocus.bind(this);
    this._handleTabOverflow = this._checkTabsOverflow.bind(this);

    this.bar.addEventListener('click', this._handlerClick);
    this.bar.addEventListener('scroll', this._handleTabOverflow);
    // Tab key focus inside slides
    this.content.addEventListener('focus', this._handlerTabFocus, true);
    window.addEventListener('resize', this._handlerResize);

    if (this.settings.draggable) {
      this.handlerStart = this._start.bind(this);
      this.handlerMove = this._move.bind(this);
      this.handlerEnd = this._end.bind(this);
      this.handlerLeave = this._leave.bind(this);
      this.handlerLink = this._click.bind(this);

      this.dragEvent = this._dragEvent();

      this.content.addEventListener(this.dragEvent.start, this.handlerStart, { passive: false });
      this.content.addEventListener(this.dragEvent.move, this.handlerMove, { passive: false });
      this.content.addEventListener(this.dragEvent.end, this.handlerEnd);
      this.content.addEventListener(this.dragEvent.leave, this.handlerLeave);
      this.content.addEventListener('click', this.handlerLink);
    }
  }

  _removeEvents() {
    this.bar.removeEventListener('click', this._handlerClick);
    this.bar.removeEventListener('scroll', this._handleTabOverflow);
    this.content.removeEventListener('focus', this._handlerTabFocus, true);
    window.removeEventListener('resize', this._handlerResize);

    if (this.settings.draggable) {
      this.content.removeEventListener(this.dragEvent.start, this.handlerStart, { passive: false });
      this.content.removeEventListener(this.dragEvent.move, this.handlerMove, { passive: false });
      this.content.removeEventListener(this.dragEvent.end, this.handlerEnd);
      this.content.removeEventListener(this.dragEvent.leave, this.handlerLeave);
      this.content.removeEventListener('click', this.handlerLink);
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
      this.line.style[this.transitionProperty] = `
        ${this.transformProperty} ${this.settings.duration}ms ${this.settings.easing}
      `;
    }
  }

  _scrollLeft(el, { to = 0, duration = 150 }, cb) {
    const from = el.scrollLeft;
    if (from === to) return cb && cb();

    const start = Date.now();
    const scroll = () => {
      const currentTime = Date.now();
      const time = Math.min(1, (currentTime - start) / duration);
      el.scrollLeft = time * (to - from) + from;
      if (time >= 1) {
        return  cb && cb();
      }
      window.requestAnimationFrame(scroll);
    };
    window.requestAnimationFrame(scroll);
  }

  _moveSliderLine() {
    const {offsetWidth, offsetLeft} = this.controls[this.currentId];

    let transformLine = `translate3d(${offsetLeft}px, 0, 0)`;
    this.line.style.transform = `${transformLine} scaleX(${offsetWidth / this.w})`;
  }

  _checkTabsOverflow() {
    this.tabsHasOverflow = this.bar.offsetWidth < this.bar.scrollWidth;
    const hasRightOverflow = this.tabsHasOverflow && this.bar.scrollWidth > this.bar.scrollLeft + this.bar.offsetWidth;
    const hasLeftOverflow = this.bar.scrollLeft > 0;

    this.tabsBarWrap.classList.toggle('has-right-overflow', hasRightOverflow);
    this.tabsBarWrap.classList.toggle('has-left-overflow', hasLeftOverflow);
  }

  _observeTabInViewport() {
    if (!this.tabsHasOverflow) return;

    const elem = this.controls[this.currentId];
    const {offsetWidth, offsetLeft} = elem;
    let scrollTo = this.bar.scrollLeft;

    if (offsetLeft <= this.bar.scrollLeft) {
      scrollTo = offsetLeft;
    } else if (offsetLeft + offsetWidth >= this.bar.scrollLeft + this.bar.offsetWidth) {
      scrollTo = this.bar.scrollLeft + this.bar.offsetWidth - offsetWidth;
    }

    this._scrollLeft(this.bar, {
      to: scrollTo
    }, () => {
      this._checkTabsOverflow();
    });
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

    this.offset = this.rtl * (this.w * this.currentId);
    this._moveSlide(this.offset, false);
    this._checkTabsOverflow();
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

    this.content.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;

    const h = this.sections[this.currentId].offsetHeight;
    this.content.style['height'] = `${h}px`;

    this.settings.underline && this._moveSliderLine();
  }

  _click(e) {
    if (this.preventClick) {
      e.preventDefault();
    }
    this.preventClick = false;
  }

  _start(e) {
    if (this.dragFlag) return;

    let drag;
    if (e.targetTouches) {
      this.target = e.targetTouches[0].target;
      drag = e.targetTouches[0];
    } else {
      drag = e;
      e.preventDefault();
    }

    this.delta = 0;
    this.dragX = drag.pageX || drag.clientX;
    this.dragY = drag.pageY || drag.clientY;
    this.dragFlag = true;

    this.content.classList.add('has-grab');
  }

  _move(e) {
    if (!this.dragFlag) return;

    let drag = e;
    if (e.targetTouches) {
      if (e.targetTouches.length > 1 || this.target !== e.targetTouches[0].target) {
        return;
      }
      drag = e.targetTouches[0];
    } else {
      if (e.target.nodeName === 'A') {
        this.preventClick = true;
      }
    }

    const currentX = drag.pageX || drag.clientX;
    const currentY = drag.pageY || drag.clientY;

    if (!this.isMoving) {
      this.isMoving = Math.abs(this.dragX - currentX) >= Math.abs(this.dragY - currentY);
    }

    if (this.isMoving) {
      e.preventDefault();
      this.delta = (this.dragX - currentX) / 2;
      if (!this.settings.animate) return;

      this._moveSlide(this.offset - this.delta, false);
    }
  }

  _swipeTo() {
    if (this.settings.rtl) {
      return this.delta > 0 ? this.currentId - 1 : this.currentId + 1;
    }
    return this.delta < 0 ? this.currentId - 1 : this.currentId + 1;
  }

  _end() {
    if (!this.dragFlag) return;

    const swipeTo = this._swipeTo();
    this.isMoving = false;

    this.content.classList.remove('has-grab');

    if (Math.abs(this.delta) < 20 || (swipeTo > this.slidesLen - 1 || swipeTo < 0)) {
      this.dragFlag = false;
      this._moveSlide(this.offset);
      return;
    }
    this.dragFlag = false;
    this.target = null;
    this.show(swipeTo);
  }

  _leave() {
    if (this.dragFlag) {
      this._moveSlide(this.offset);
      this.dragFlag = false;
      this.preventClick = false;
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
    this.offset = this.rtl * (this.w * this.currentId);
    this._moveSlide(this.offset);
    this.controls[this.currentId].classList.add('is-active');

    const event = new CustomEvent('tabChange', {
      detail: {
        currentIndex: this.currentId,
        prevIndex: prevIndex,
        currentSlide: this.sections[this.currentId],
        currentTab: this.controls[this.currentId]
      }
    });
    this.tabs.dispatchEvent(event);

    this._observeTabInViewport();
  }
}
