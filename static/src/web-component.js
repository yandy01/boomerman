class BaseElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes") {
                    console.log(`L'attribut ${mutation.attributeName} a été modifié.`);
                    this.attributeChanged(mutation.attributeName, mutation.oldValue, this.getAttribute(mutation.attributeName));
                }
            });
        });
        this.observer.observe(this, { attributes: true, attributeOldValue: true });
    }

    disconnectedCallback() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    attributeChanged(name, oldValue, newValue) {
        console.log(`L'attribut ${name} a changé de ${oldValue} à ${newValue}.`);
    }

    render(html) {
        this.shadowRoot.innerHTML = html;
    }
}
