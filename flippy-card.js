import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import './scripts/inert.js';

/**
 * `flip-card`
 * A Flippable &#34;card&#34; based on Paul Lewis&#39; experiment
 * Reference: https://github.com/GoogleChrome/ui-element-samples/tree/gh-pages/3d-card-flip
 * Paul Lewis: https://github.com/paullewis and https://aerotwist.com/
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class FlippyCard extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        align-items: center;
        justify-content: center;

        --default-card-background: #fff;
      }

      * {
        box-sizing: border-box;
      }

      #sccard {
        width: 100%;
        height: 100%;
        position: relative;
        perspective: 500px;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-x: hidden;
        overflow-y: hidden;
      }

      #front,
      #back {
        backface-visibility: hidden;
        position: absolute;
        top: 35px;
        display: block;
        border-radius: 3px;
        overflow: hidden;
        will-change: transform;
        width: calc(100% - 70px);
      }

      #front {
        background: var(--front-card-background, var(--card-background, var(--default-card-background)));
      }
      #back {
        background: var(--back-card-background, var(--card-background, var(--default-card-background)));
      }

      #back {
        transform: rotateY(180deg);
      }

      #umbra,
      #penumbra {
        position: absolute;
        backface-visibility: visible;
        will-change: transform;
      }

      #umbra {
        width: calc(100% - 60px);
        height: calc(100% - 60px);
        top: 30px;
        left: 30px;
        border-style: solid;
        border-width: 10px;
        -moz-border-image: url(images/umbra.svg) 10 round;
        -webkit-border-image: url(images/umbra.svg) 10 round;
        -o-border-image: url(images/umbra.svg) 10 round;
        border-image: url(images/umbra.svg) 10 fill round;
        transform: translateY(2px);
        opacity: 0.3;
      }

      #penumbra {
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        border-style: solid;
        border-width: 80px;
        -moz-border-image: url(images/penumbra.svg) 80 round;
        -webkit-border-image: url(images/penumbra.svg) 80 round;
        -o-border-image: url(images/penumbra.svg) 80 round;
        border-image: url(images/penumbra.svg) 80 fill round;
        transform: translateY(2px);
        opacity: 0;
      }
    </style>
    <div id="sccard">
      <div id="umbra"></div>
      <div id="penumbra"></div>

      <div id="front" tabindex="-1">
        <slot name="front"></slot>
        <slot></slot>
      </div>

      <div id="back" tabindex="-1">
        <slot name="back"></slot>
      </div>
    </div>
`;
  }

  static get is() { return 'flippy-card'; }
  static get properties() {
    return {
      duration: {
        type: Number,
        value: 800
      },
      axis: {
        type: String,
        value: 'Y',
        reflectToAttribute: true
      },
      currentSide: {
        type: String,
        value: 'front',
        reflectToAttribute: true,
        observer: '_currentSideChanged'
      }
    };
  }

  ready() {
    super.ready();
    this._boundHandler = this._processLightChildren.bind(this);
    setTimeout(this._boundHandler);
    this.$.sccard.addEventListener('slotchange', this._boundHandler);
  }

  attached() {
    const axis = this.axis.toUpperCase() === 'X' ? 'X' : 'Y';
    if (this.currentSide === 'back') {
        this.$.front.transform = `rotate${axis}(180deg)`;
        this.$.back.transform = `rotate${axis}(360deg)`;
        this._lastActiveSide = 'back';
    } else {
        this.$.front.transform = `rotate${axis}(0deg)`;
        this.$.back.transform = `rotate${axis}(180deg)`;
        this._lastActiveSide = 'front';
    }
  }

  _processLightChildren() {
    this.$.front.style.height = 'auto';
    this.$.back.style.height = 'auto';
    const frontHeight = this.$.front.offsetHeight;
    const backHeight = this.$.back.offsetHeight;
    const newHeight = Math.max(frontHeight, backHeight);
    this.style.height = `${newHeight + 70}px`;
    this.$.front.style.height = `${newHeight}px`;
    this.$.back.style.height = `${newHeight}px`;
  }

  _axisChanged(newValue) {
    this._axis = newValue.toUpperCase() === 'X' ? 'X' : 'Y';
  }

  flip() {
    this.currentSide = (this.currentSide === 'back') ? 'front' : 'back';
  }

  _currentSideChanged(to, from) {
    // First time running, from is always blank.
    if (from == '' || from === undefined) {
      return;
    }
    // Are we changing to something sane
    // Is the new side not the one which is currently active
    if (to === this._lastActiveSide || (to !== 'front' && to !== 'back')) {
      return;
    }

    if (to === 'front') {
      this._animate(this.$.back, this.$.front)
    } else {
      this._animate(this.$.front, this.$.back)
    }

    this._lastActiveSide = to;
  }

  _animate(frontmost, rearmost) {
    const axis = this.axis.toUpperCase() === 'X' ? 'X' : 'Y';
    const scale = (500 + 200) / 500;

    const sideOne = [
      {transform: `translateZ(-200px) rotate${axis}(0deg) scale(${scale})`},
      {transform: `translateZ(-100px) rotate${axis}(0deg) scale(${scale})`, offset: 0.15},
      {transform: `translateZ(-100px) rotate${axis}(180deg) scale(${scale})`, offset: 0.65},
      {transform: `translateZ(-200px) rotate${axis}(180deg) scale(${scale})`}
    ];

    const sideTwo = [
      {transform: `translateZ(-200px) rotate${axis}(180deg) scale(${scale})`},
      {transform: `translateZ(-100px) rotate${axis}(180deg) scale(${scale})`, offset: 0.15},
      {transform: `translateZ(-100px) rotate${axis}(360deg) scale(${scale})`, offset: 0.65},
      {transform: `translateZ(-200px) rotate${axis}(360deg) scale(${scale})`}
    ];

    const umbra = [
      {opacity: 0.3, transform: `translateY(2px) rotate${axis}(0deg)`},
      {opacity: 0.0, transform: `translateY(62px) rotate${axis}(0deg)`, offset: 0.15},
      {opacity: 0.0, transform: `translateY(62px) rotate${axis}(180deg)`, offset: 0.65},
      {opacity: 0.3, transform: `translateY(2px) rotate${axis}(180deg)`}
    ];

    const penumbra = [
      {opacity: 0.0, transform: `translateY(2px) rotate${axis}(0deg)`},
      {opacity: 0.5, transform: `translateY(62px) rotate${axis}(0deg)`, offset: 0.15},
      {opacity: 0.5, transform: `translateY(62px) rotate${axis}(180deg)`, offset: 0.65},
      {opacity: 0.0, transform: `translateY(2px) rotate${axis}(180deg)`}
    ];

    const timing = {
      duration: this.duration,
      iterations: 1,
      easing: 'ease-in-out',
      fill: 'forwards'
    };

    frontmost.animate(sideOne, timing);
    rearmost.animate(sideTwo, timing);
    this.$.umbra.animate(umbra, timing);
    this.$.penumbra.animate(penumbra, timing);

    frontmost.inert = true;
    rearmost.inert = false;
  }
}

window.customElements.define(FlippyCard.is, FlippyCard);
