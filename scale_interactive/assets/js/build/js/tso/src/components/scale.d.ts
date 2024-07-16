export declare class Scale extends HTMLElement {
    static readonly ELEMENT = "music-scale";
    static observedAttributes: string[];
    root: ShadowRoot;
    container: SVGSVGElement | null;
    parent: SVGGElement;
    width: number;
    height: number;
    private major;
    private startNote;
    static readonly NOTES: string[];
    static MIDI: number[];
    static MAJOR: number[];
    static MINOR: number[];
    private wheel;
    private button;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    update(major: any, note: any): void;
    render(first: boolean, updateMaj: boolean): void;
}
