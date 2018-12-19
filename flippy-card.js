import { LitElement, html } from '@polymer/lit-element';
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
class FlippyCard extends LitElement {

  constructor() {
    super();
    this._currentSide = 'front';
    this._axis = 'Y';
    this._duration = 800;
  }

  static get properties() {
    return {
      axis: {
        type: String,
        value: 'Y'
      },
      currentSide: {
        type: String,
        value: 'front'
      },
      duration: {
        type: Number,
        value: 800
      }
    };
  }

  static get observedAttributes() {
    return [
      'axis',
      'current-side',
      'duration'
    ];
  }
  
  render() {
    const path = import.meta.url.replace(/flippy-card.js$/, '');
    const umbra = `${path}images/umbra.svg`;
    const penumbra = `${path}/images/penumbra.svg`;

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
        -moz-border-image: url("${umbra}") 10 round;
        -webkit-border-image: url("${umbra}") 10 round;
        -o-border-image: url("${umbra}") 10 round;
        border-image: url("${umbra}") 10 fill round;
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
        -moz-border-image: url("${penumbra}") 80 round;
        -webkit-border-image: url("${penumbra}") 80 round;
        -o-border-image: url("${penumbra}") 80 round;
        border-image: url("${penumbra}") 80 fill round;
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

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'axis':
        if (newValue !== this._axis) {
          this.axis = newValue;
        }
        break;
      case 'current-side':
        if (newValue !== this._currentSide) {
          this.currentSide = newValue;
        }
        break;
      case 'duration':
        if (newValue !== this._duration) {
          this.duration = newValue;
        }
        break;
    }
  }

  ready() {
    super.ready();
    this._boundHandler = this._processLightChildren.bind(this);
    setTimeout(this._boundHandler);
    this.shadowRoot.getElementById('sccard').addEventListener('slotchange', this._boundHandler);
  }

  attached() {
    const axis = this._axis.toUpperCase() === 'X' ? 'X' : 'Y';
    const front = this.shadowRoot.getElementById('front');
    const back = this.shadowRoot.getElementById('back');
    if (this._currentSide === 'back') {
      front.transform = `rotate${axis}(180deg)`;
      back.transform = `rotate${axis}(360deg)`;
      this._currentSide = 'back';
    } else {
      front = `rotate${axis}(0deg)`;
      back = `rotate${axis}(180deg)`;
      this._currentSide = 'front';
    }
  }

  _processLightChildren() {
    const front = this.shadowRoot.getElementById('front');
    const back = this.shadowRoot.getElementById('back');

    front.style.height = 'auto';
    back.style.height = 'auto';
    const frontHeight = front.offsetHeight;
    const backHeight = back.offsetHeight;
    const newHeight = Math.max(frontHeight, backHeight);
    this.style.height = `${newHeight + 70}px`;
    front.style.height = `${newHeight}px`;
    back.style.height = `${newHeight}px`;
  }

  flip() {
    this.currentSide = (this._currentSide === 'back') ? 'front' : 'back';
  }

  get axis() {
    return this.__axis;
  }
  set axis(newValue) {
    if (!newValue) {
      this._axis = 'Y';
      this.setAttribute('axis', 'Y');
      return;
    }

    const uc = newValue.toUpperCase();
    if (['X','Y'].includes(uc)) {
      this._axis = uc;
    }
    this.setAttribute('axis', this._axis);
  }

  get duration() {
    return this._duration;
  }
  set duration(newValue) {
    const duration = parseInt(newValue) || 0;
    this._duration = duration;
    this.setAttribute('duration', duration);
  }

  get currentSide() {
    return this._currentSide;
  }
  set currentSide(newValue) {
    if (!newValue) {
      this._currentSide = 'front';
      this.setAttribute('current-side', 'front');
      return;
    }

    const to = newValue.toLowerCase();

    // Are we changing to something sane
    // Is the new side not the one which is currently active
    if (to !== this._currentSide && ['front','back'].includes(to)) {
      const front = this.shadowRoot.getElementById('front');
      const back = this.shadowRoot.getElementById('back');

      if (to === 'front') {
        this._animate(back, front)
      } else {
        this._animate(front, back)
      }

      this._currentSide = to;
    }
    this.setAttribute('current-side', this._currentSide);
  }

  _animate(frontmost, rearmost) {
    const axis = this._axis;
    const scale = (500 + 200) / 500;

    const sideOneAnim = [
      {transform: `translateZ(-200px) rotate${axis}(0deg) scale(${scale})`},
      {transform: `translateZ(-100px) rotate${axis}(0deg) scale(${scale})`, offset: 0.15},
      {transform: `translateZ(-100px) rotate${axis}(180deg) scale(${scale})`, offset: 0.65},
      {transform: `translateZ(-200px) rotate${axis}(180deg) scale(${scale})`}
    ];

    const sideTwoAnim = [
      {transform: `translateZ(-200px) rotate${axis}(180deg) scale(${scale})`},
      {transform: `translateZ(-100px) rotate${axis}(180deg) scale(${scale})`, offset: 0.15},
      {transform: `translateZ(-100px) rotate${axis}(360deg) scale(${scale})`, offset: 0.65},
      {transform: `translateZ(-200px) rotate${axis}(360deg) scale(${scale})`}
    ];

    const umbraAnim = [
      {opacity: 0.3, transform: `translateY(2px) rotate${axis}(0deg)`},
      {opacity: 0.0, transform: `translateY(62px) rotate${axis}(0deg)`, offset: 0.15},
      {opacity: 0.0, transform: `translateY(62px) rotate${axis}(180deg)`, offset: 0.65},
      {opacity: 0.3, transform: `translateY(2px) rotate${axis}(180deg)`}
    ];

    const penumbraAnim = [
      {opacity: 0.0, transform: `translateY(2px) rotate${axis}(0deg)`},
      {opacity: 0.5, transform: `translateY(62px) rotate${axis}(0deg)`, offset: 0.15},
      {opacity: 0.5, transform: `translateY(62px) rotate${axis}(180deg)`, offset: 0.65},
      {opacity: 0.0, transform: `translateY(2px) rotate${axis}(180deg)`}
    ];

    const timing = {
      duration: this._duration,
      iterations: 1,
      easing: 'ease-in-out',
      fill: 'forwards'
    };

    const umbraEl = this.shadowRoot.getElementById('umbra');
    const penumbraEl = this.shadowRoot.getElementById('penumbra');

    frontmost.animate(sideOneAnim, timing);
    rearmost.animate(sideTwoAnim, timing);
    umbraEl.animate(umbraAnim, timing);
    penumbraEl.animate(penumbraAnim, timing);

    frontmost.inert = true;
    rearmost.inert = false;
  }
}

window.customElements.define('flippy-card', FlippyCard);
