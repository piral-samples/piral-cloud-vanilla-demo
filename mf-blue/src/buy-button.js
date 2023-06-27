const link = document.head.appendChild(document.createElement('link'));
link.href = new URL("buy-button.css", import.meta.url).href;
link.rel = "stylesheet";

const defaultPrice = "0,00 €";
const prices = {
  porsche: "190,00 €",
  fendt: "180,00 €",
  eicher: "150,00 €",
};

function renderPrice(price) {
  return `Buy for ${price}`;
}

class BuyButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const sku = this.getAttribute("sku") || "porsche";
    const price = prices[sku] || defaultPrice;

    this.innerHTML = `
<form method="POST">
  <button>
    ${renderPrice(price)}
  </button>
</form>
    `;

    this.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitCurrentItem();
      return false;
    });
  }

  static get observedAttributes() {
    return ["sku"];
  }

  submitCurrentItem() {
    const sku = this.getAttribute("sku") || "porsche";
    const price = prices[sku] || defaultPrice;
    window.dispatchEvent(new CustomEvent("add-item", { detail: price }));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const bt = this.querySelector("button");

    if (this.isConnected && bt && name === "sku" && oldValue !== newValue) {
      const price = prices[newValue] || defaultPrice;
      bt.innerHTML = renderPrice(price);
    }
  }
}

customElements.define("buy-button", BuyButton);
