export declare class Dial extends HTMLElement {
    static readonly ELEMENT = "example-dial";
    static observedAttributes: string[];
    root: ShadowRoot;
    private ring;
    private line;
    private angle;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
