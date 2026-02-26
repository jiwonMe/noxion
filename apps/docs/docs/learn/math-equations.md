---
sidebar_position: 9
title: Math Equations
description: Render LaTeX math equations with KaTeX, server-side rendering, zero client JS.
---

Noxion provides built-in support for rendering mathematical equations using [KaTeX](https://katex.org/). This allows you to display complex formulas, Greek letters, and mathematical notation with high performance and beautiful typography.

---

## How it Works

Equations in Noxion are rendered on the server using `katex.renderToString()`. This means the mathematical notation is converted into standard HTML and CSS before it reaches the user's browser.

- **Zero Client JS**: No JavaScript is required on the client side to render equations.
- **Graceful Errors**: If an equation contains invalid LaTeX, Noxion catches the error and renders the raw text instead of breaking the page.
- **Dynamic Loading**: The `katex` package is loaded dynamically only when an equation is encountered, keeping the initial bundle size small.

---

## Types of Equations

Notion supports two distinct ways to include math in your pages. Noxion handles both automatically.

### Block Equations
Block equations occupy their own line and are centered by default. They are ideal for important formulas or complex derivations. In Notion, you can create these by typing `/equation` or using the block menu.

### Inline Equations
Inline equations appear within a line of text. They are perfect for mentioning variables like $x$ or simple expressions like $e=mc^2$ without breaking the flow of a paragraph. You can create these in Notion by highlighting text and selecting the "Equation" option from the formatting menu.

---

## Writing Equations

You write equations using standard LaTeX syntax. Notion provides a live preview as you type, making it easy to verify your formulas.

### Common Examples

| Description | LaTeX Syntax |
| :--- | :--- |
| Fractions | `\frac{a}{b}` |
| Exponents | `x^{2}` |
| Subscripts | `a_{i}` |
| Integrals | `\int_{a}^{b} f(x) dx` |
| Summations | `\sum_{i=1}^{n} i` |
| Greek Letters | `\alpha, \beta, \gamma, \Delta` |
| Matrices | `\begin{matrix} a & b \\ c & d \end{matrix}` |

---

## Required CSS

While the HTML for equations is generated on the server, you must include the KaTeX CSS file in your project for the equations to display correctly. Without this CSS, the symbols will appear as unstyled text.

Add the following link tag to your root layout or document head:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
  integrity="sha384-Xi8rHCmBzhNVz4GV5Q1Z8veWtfk8MLVMzMzxtKyc6nqtAf2uLCZnwYB9QPWOyYKu"
  crossorigin="anonymous"
/>
```

Alternatively, if you are using a framework like Next.js, you can import it in your `_app.tsx` or `layout.tsx`:

```typescript
import 'katex/dist/katex.min.css';
```

---

## Customization

Noxion wraps equations in specific CSS classes that you can use for custom styling.

- **Block Equations**: Wrapped in `.notion-equation-block`.
- **Inline Equations**: Wrapped in `.notion-inline-equation`.

You can adjust the font size or spacing of all equations in your global CSS:

```css
.notion-equation-block {
  font-size: 1.2rem;
  margin: 2rem 0;
}

.notion-inline-equation {
  color: var(--primary-color);
}
```

---

## Performance Benefits

By using a server-side rendering approach for math, Noxion offers several advantages over client-side alternatives like MathJax:

1. **Instant Visibility**: Equations are visible as soon as the HTML loads.
2. **SEO Friendly**: Search engines can index the rendered HTML content of your formulas.
3. **Lower Resource Usage**: Mobile devices don't need to spend CPU cycles parsing and rendering LaTeX.

:::note
For a complete list of supported LaTeX functions and symbols, refer to the [KaTeX Documentation](https://katex.org/docs/supported.html).
:::

See the [Components Reference](../reference/notion-renderer/components) for more information on how `EquationBlock` and `InlineEquation` are implemented.
