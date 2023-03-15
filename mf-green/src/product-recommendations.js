const link = document.head.appendChild(document.createElement('link'));
link.href = getUrl("recommendations.css");
link.rel = "stylesheet";

function getUrl(path) {
  return new URL(path, import.meta.url).href;
}

const allRecommendations = {
  porsche: ["3", "5", "6"],
  fendt: ["3", "6", "4"],
  eicher: ["1", "8", "7"],
};

class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const sku = this.getAttribute("sku") || "porsche";
    this.render(sku);
  }

  static get observedAttributes() {
    return ["sku"];
  }

  render(sku) {
    const recommendations =
      allRecommendations[sku] || allRecommendations.porsche;

    this.innerHTML = `
<h3>Related Products</h3>
${recommendations
  .map((id) => `<img src="${getUrl(`images/reco_${id}.jpg`)}" alt="Recommendation ${id}">`)
  .join("")}
  `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected && name === "sku" && oldValue !== newValue) {
      this.render(newValue);
    }
  }
}

customElements.define("product-recommendations", ProductRecommendations);
