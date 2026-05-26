declare global {
    namespace JSX {
        interface IntrinsicElements {
            readonly a: { readonly children?: unknown; readonly href?: string };
            readonly article: { readonly children?: unknown };
            readonly h1: { readonly children?: unknown };
            readonly img: { readonly alt: string; readonly src: string };
            readonly main: { readonly children?: unknown };
            readonly p: { readonly children?: unknown };
        }
    }
}

export {};
