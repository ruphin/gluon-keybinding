import { GluonElement } from '../gluon/gluon.js';

const registeredElements = {};

const handleKeydown = event => {
  if (event.defaultPrevented) {
    console.warn('Keypress ignored!');
    return; // Should do nothing if the key event was already consumed.
  }

  if (registeredElements[event.key]) {
    // Use `every` so we can break from the loop if there's an override
    registeredElements[event.key].every(element => {
      // Only act on elements that are not in a hidden subtree in the DOM
      if (element.offsetParent !== null) {
        event.stopPropagation();
        element.click();
        // If the element is not an override, return true to keep iterating over elements
        return !element.override;
      }
    });
  }
};

window.addEventListener('keydown', handleKeydown, true);

export class GluonKeybinding extends GluonElement {
  static get observedAttributes() {
    return ['key', 'override'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'key') {
      this.__register(newValue, oldValue);
    }
    if (attr === 'override') {
      this.__override(this.key);
    }
  }

  set key(key) {
    if (key) {
      this.setAttribute('key', key);
    } else {
      this.removeAttribute('key');
    }
  }

  get key() {
    return this.getAttribute('key');
  }

  set override(override) {
    if (override) {
      this.setAttribute('override', '');
    } else {
      this.removeAttribute('override');
    }
  }

  get override() {
    return this.getAttribute('override') === '';
  }

  __register(newKey, oldKey) {
    if (oldKey && registeredElements[oldKey]) {
      const i = registeredElements[oldKey].indexOf(this);
      if (i != -1) {
        registeredElements[oldKey].splice(i, 1);
        if (registeredElements[oldKey].length === 0) {
          delete registeredElements[oldKey];
        }
      }
    }
    if (newKey) {
      if (!registeredElements[newKey]) {
        registeredElements[newKey] = [];
      }
      if (this.override) {
        registeredElements[newKey].unshift(this);
      } else {
        registeredElements[newKey].push(this);
      }
    }
  }

  __override(key) {
    if (key && registeredElements[key]) {
      const i = registeredElements[key].indexOf(this);
      if (i != -1) {
        registeredElements[key].splice(i, 1);
        registeredElements[key].unshift(this);
      }
    }
  }
}

customElements.define(GluonKeybinding.is, GluonKeybinding);
