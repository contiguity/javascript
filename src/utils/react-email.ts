/** Render React Email component to html and plain text. Requires @react-email/render (and react, react-dom). */
export async function renderReactEmail(node: unknown): Promise<{ html: string; text: string }> {
    const mod = await import("@react-email/render").catch(() => {
        throw new Error(
            "Failed to render React component. Install `@react-email/render` (and peer deps react, react-dom)."
        );
    });
    const html = await mod.render(node);
    const text = mod.toPlainText(html);
    return { html, text };
}
