import '@webcomponents/scoped-custom-element-registry';
import { html, LitElement, css, nothing } from 'lit';
import {cache} from 'lit/directives/cache.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

import { LionButton } from '@lion/ui/button.js';
import { LionDialog } from '@lion/ui/dialog.js';
import { LionTabs } from '@lion/ui/tabs.js';

class MyDialog extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'lion-button': LionButton,
      'lion-dialog': LionDialog
    };
  }

  static properties = {
    markings: { type: Object },
  };

  constructor() {
    super();
    this.markings = [{isOpen: true}, {isOpen: true}];
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("Connected")
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log("Disconnected")
  }

  render() {
    return html`
      <div>
      ${this.markings.map((marking, index) => html`
        <lion-dialog id="markerDialog${index}" .opened="${marking.isOpen}" .config=${{ hidesOnEsc: false }}>
          <button slot="invoker">Click me to open dialog</button>
          <div slot="content" class="demo-dialog-content">
            Hello! You can close this dialog here:
            <button class="demo-dialog-content__close-button" @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}">
              x
            </button>
          </div>
        </lion-dialog>
      `)}
      </div>
    `
  }
}


export class LionDemo extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'my-dialog': MyDialog,
      'lion-button': LionButton,
      'lion-dialog': LionDialog,
      'lion-tabs': LionTabs
    };
  }

  static properties = {
    selectedTabIndex: { type: Number }
  };

  constructor() {
    super();
    this.selectedTabIndex = 0;
  }

  selectTab(i) {
    this.selectedTabIndex = i;
  }

  render() {
    return html`
      <lion-tabs>
        <button slot="tab" @click=${() => this.selectTab(0)}>Tab 1</button>
        <button slot="tab" @click=${() => this.selectTab(1)}>Tab 2</button>
        <div slot="panel">
          ${this.selectedTabIndex === 0 ? html`<p slot="panel">Text on tab 1</p>` : nothing}
        </div>
        <div slot="panel">
          ${cache(this.selectedTabIndex === 1 ? html`<my-dialog></my-dialog>` : nothing)}
        </div>
      </lion-tabs>
    `;
  }
}

customElements.define('lion-demo', LionDemo);
