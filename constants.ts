export const DEFAULT_MARKDOWN = `# Physics Report: Water Analysis {bg:#e0f2fe}

## Introduction

Water is a chemical substance with the chemical formula $H_2O$. A water molecule contains one oxygen and two hydrogen atoms connected by covalent bonds.

### Key Properties {bg:#fef3c7}

1.  **Boiling Point**: $100^{\circ}C$ at sea level.
2.  **Freezing Point**: $0^{\circ}C$.

## Equations

The Schrödinger equation is a linear partial differential equation that governs the wave function of a quantum-mechanical system:

$$
i\hbar\frac{\partial}{\partial t} \Psi(\mathbf{r},t) = \hat H \Psi(\mathbf{r},t)
$$

## Two-Column Layout Example

${'<'}div class="columns"${'>'}
${'<'}div class="column"${'>'}

### Text Column

This is text on the left side. You can put any markdown content here including:
- Lists
- **Bold text**
- *Italic text*
- Equations: $E = mc^2$

${'</'}div${'>'}
${'<'}div class="column"${'>'}

![Nature](https://picsum.photos/400/300 "{w=300}")

*An image scaled to 300px width*

${'</'}div${'>'}
${'</'}div${'>'}

## Image Scaling Examples

You can control image sizes using these syntaxes:

![Small Image](https://picsum.photos/600/400 "{w=200}")
*Width only: {w=200}*

![Custom Size](https://picsum.photos/600/400 "{300x200}")
*Width x Height: {300x200}*

## Conclusion {bg:#dcfce7}

The study of fluid dynamics involves complex equations such as the Navier-Stokes equations:

$$
\rho \left(\frac{\partial \mathbf{v}}{\partial t} + \mathbf{v} \cdot \nabla \mathbf{v}\right) = -\nabla p + \nabla \cdot \mathbb{T} + \mathbf{f}
$$

<!-- pagebreak -->

## Appendix

This content is on a new page due to the page break marker above.

**Tips**:
- **Background colors**: Use # Heading {bg:color} syntax
  - Hex: {bg:#e0f2fe}
  - Named: {bg:lightblue}
  - RGB: {bg:rgb(224, 242, 254)}
- **Two columns**: Wrap content in \`${'<'}div class="columns"${'>'}\` with \`${'<'}div class="column"${'>'}\` for each column
- **Image sizing**: Add {w=300}, {300x200}, or {width=300 height=200} after image URL
`;
