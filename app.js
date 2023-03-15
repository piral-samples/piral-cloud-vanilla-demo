const componentRegistry = {};

class MfComponent extends HTMLElement {
  _data = {};

  constructor() {
    super();
    this.data = this.getAttribute("data");
  }

  handler = (ev) => {
    const name = this.getAttribute("name");

    if (ev.detail.name === name) {
      this.render(ev.detail.components);
    }
  };

  get data() {
    return this._data;
  }

  set data(value) {
    if (typeof value === "string") {
      value = decodeURIComponent(value)
        .split("&")
        .reduce((obj, item) => {
          const [name, ...rest] = item.split("=");
          obj[name] = rest.join("=");
          return obj;
        }, {});
    }

    if (typeof value === "object") {
      this._data = value || {};
    }

    this.render();
  }

  static get observedAttributes() {
    return ["name", "data"];
  }

  render(components = []) {
    const newComponents = components.slice(this.children.length);

    newComponents.forEach((componentName) => {
      const element = document.createElement(componentName);
      this.appendChild(element);
    });

    Array.from(this.children).forEach((child) => {
      Object.entries(this._data).forEach(([name, value]) => {
        child.setAttribute(name, value);
      });
    });
  }

  connectedCallback() {
    const name = this.getAttribute("name");
    const components = componentRegistry[name] || [];

    this.render(components);
    window.addEventListener("component-changed", this.handler);
  }

  disconnectedCallback() {
    this.innerHTML = "";
    window.removeEventListener("component-changed", this.handler);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      if (name === "name") {
        this.disconnectedCallback();
        this.connectedCallback();
      } else if (name === "data") {
        this.data = newVal;
      }
    }
  }
}

customElements.define("mf-component", MfComponent);

window.registerComponent = (name, component) => {
  const components = componentRegistry[name] || [];

  components.push(component);

  componentRegistry[name] = components;

  window.dispatchEvent(
    new CustomEvent("component-changed", { detail: { name, components } })
  );
};

fetch(
  "https://vanilla-mf-discovery-demo.my.piral.cloud/api/v1/native-federation/vanilla-mf-discovery-demo"
).then(async (res) => {
  const data = await res.json();
  await Promise.all(Object.values(data).map((url) => import(url)));
});
