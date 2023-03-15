const link = document.head.appendChild(document.createElement('link'));
link.href = new URL("basket-info.css", import.meta.url).href;
link.rel = "stylesheet";

const items = [];

window.addEventListener("add-item", () => {
  items.push("...");
  window.dispatchEvent(new CustomEvent("added-item", { detail: items }));
});

class BasketInfo extends HTMLElement {
  constructor() {
    super();
    this.handleAdded = this.render.bind(this);
  }

  static get observedAttributes() {
    return ["sku"];
  }

  render() {
    const count = items.length;

    this.innerHTML = `
<div class="${count === 0 ? "empty" : "filled"}">basket: ${count} item(s)</div>
    `;
  }

  connectedCallback() {
    this.render();
    window.addEventListener("added-item", this.handleAdded);
  }

  disconnectedCallback() {
    window.removeEventListener("added-item", this.handleAdded);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected && name === "sku" && oldValue !== newValue) {
      this.render(newValue);
    }
  }
}

customElements.define("basket-info", BasketInfo);
