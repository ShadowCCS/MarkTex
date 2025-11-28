import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { DocSettings, PaperSize } from '../types';

interface PreviewProps {
  content: string;
  settings: DocSettings;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ content, settings }, ref) => {
  // Dimensions for screen preview (scaled down if needed) vs Print (handled by CSS)
  // A4 aspect ratio is ~1.414. Letter is ~1.2941.

  // Helper function to extract background color from text
  const extractBackgroundStyle = (text: string): { cleanText: string; bgColor: string | null } => {
    const bgMatch = text.match(/\{bg:([^}]+)\}\s*$/);
    if (bgMatch) {
      return {
        cleanText: text.replace(/\{bg:[^}]+\}\s*$/, '').trim(),
        bgColor: bgMatch[1]
      };
    }
    return { cleanText: text, bgColor: null };
  };

  // Custom renderer to handle page breaks and background colors
  const components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: ({ node, children, ...props }: any) => {
      // Check for specific comment usage if needed, but react-markdown treats comments as AST nodes usually filtered out.
      // We will use a regex replacer in the main content pipeline for standard HTML comments if strictly needed.
      // However, we can also look for specific text patterns.
      if (typeof children?.[0] === 'string' && children[0].includes('<!-- pagebreak -->')) {
        return <div className="break-after-page h-0 w-full" />;
      }
      return <p {...props} className="mb-4">{children}</p>;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: ({ node, children, ...props }: any) => {
      const textContent = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const { cleanText, bgColor } = extractBackgroundStyle(textContent);

      return (
        <h1
          {...props}
          style={bgColor ? {
            backgroundColor: bgColor,
            padding: '0.5rem 1rem',
            display: 'inline-block',
            borderRadius: '0.25rem'
          } : undefined}
        >
          {bgColor ? cleanText : children}
        </h1>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: ({ node, children, ...props }: any) => {
      const textContent = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const { cleanText, bgColor } = extractBackgroundStyle(textContent);

      return (
        <h2
          {...props}
          style={bgColor ? {
            backgroundColor: bgColor,
            padding: '0.4rem 0.875rem',
            display: 'inline-block',
            borderRadius: '0.25rem'
          } : undefined}
        >
          {bgColor ? cleanText : children}
        </h2>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: ({ node, children, ...props }: any) => {
      const textContent = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const { cleanText, bgColor } = extractBackgroundStyle(textContent);

      return (
        <h3
          {...props}
          style={bgColor ? {
            backgroundColor: bgColor,
            padding: '0.35rem 0.75rem',
            display: 'inline-block',
            borderRadius: '0.25rem'
          } : undefined}
        >
          {bgColor ? cleanText : children}
        </h3>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h4: ({ node, children, ...props }: any) => {
      const textContent = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const { cleanText, bgColor } = extractBackgroundStyle(textContent);

      return (
        <h4
          {...props}
          style={bgColor ? {
            backgroundColor: bgColor,
            padding: '0.3rem 0.625rem',
            display: 'inline-block',
            borderRadius: '0.25rem'
          } : undefined}
        >
          {bgColor ? cleanText : children}
        </h4>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h5: ({ node, children, ...props }: any) => {
      const textContent = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const { cleanText, bgColor } = extractBackgroundStyle(textContent);

      return (
        <h5
          {...props}
          style={bgColor ? {
            backgroundColor: bgColor,
            padding: '0.25rem 0.5rem',
            display: 'inline-block',
            borderRadius: '0.25rem'
          } : undefined}
        >
          {bgColor ? cleanText : children}
        </h5>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h6: ({ node, children, ...props }: any) => {
      const textContent = typeof children === 'string' ? children :
        Array.isArray(children) ? children.join('') : '';
      const { cleanText, bgColor } = extractBackgroundStyle(textContent);

      return (
        <h6
          {...props}
          style={bgColor ? {
            backgroundColor: bgColor,
            padding: '0.25rem 0.5rem',
            display: 'inline-block',
            borderRadius: '0.25rem'
          } : undefined}
        >
          {bgColor ? cleanText : children}
        </h6>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    img: ({ node, src, alt, ...props }: any) => {
      // Extract size from alt text if present: ![alt text](url){width=300 height=200}
      // or ![alt text](url){w=300 h=200} or ![alt text](url){300x200}
      let width: string | undefined;
      let height: string | undefined;
      let cleanAlt = alt || '';
      let floatRight = false;

      // Check if there's a size specification in the title attribute (passed by markdown)
      // Also check alt text for attributes
      const title = props.title || '';
      const altText = alt || '';
      const combinedText = `${title} ${altText}`;

      // Pattern 1: {width=300 height=200} or {w=300 h=200}
      const sizeMatch1 = combinedText.match(/\{(?:width|w)=(\d+)(?:px)?\s*(?:height|h)=(\d+)(?:px)?\}/i);
      // Pattern 2: {300x200}
      const sizeMatch2 = combinedText.match(/\{(\d+)x(\d+)\}/);
      // Pattern 3: {width=300} or {w=300} (width only)
      const sizeMatch3 = combinedText.match(/\{(?:width|w)=(\d+)(?:px)?\}/i);
      // Pattern 4: {height=200} or {h=200} (height only)
      const sizeMatch4 = combinedText.match(/\{(?:height|h)=(\d+)(?:px)?\}/i);
      // Pattern 5: {float=right} or {align=right}
      const floatMatch = combinedText.match(/\{(?:float|align)=(right|left)\}/i);
      
      // Pattern 0: {0.5} or {scale=0.5} (scale parameter - check after size patterns to avoid conflicts)
      const scaleMatch1 = combinedText.match(/\{scale=([\d.]+)\}/i);
      // Only match {0.5} if it's not part of a size pattern (not {300x200} or {width=300})
      const scaleMatch2 = !sizeMatch2 && combinedText.match(/\{([\d.]+)\}/);
      const scaleValue = scaleMatch1 ? parseFloat(scaleMatch1[1]) : (scaleMatch2 ? parseFloat(scaleMatch2[1]) : undefined);
      
      // Clean alt text by removing attribute patterns
      if (floatMatch) {
        cleanAlt = cleanAlt.replace(/\{(?:float|align)=(right|left)\}/i, '').trim();
      }
      if (scaleValue !== undefined) {
        cleanAlt = cleanAlt.replace(/\{scale=[\d.]+\}/i, '').replace(/\{[\d.]+\}/, '').trim();
      }

      if (sizeMatch1) {
        width = `${sizeMatch1[1]}px`;
        height = `${sizeMatch1[2]}px`;
      } else if (sizeMatch2) {
        width = `${sizeMatch2[1]}px`;
        height = `${sizeMatch2[2]}px`;
      } else if (sizeMatch3) {
        width = `${sizeMatch3[1]}px`;
      } else if (sizeMatch4) {
        height = `${sizeMatch4[1]}px`;
      }

      if (floatMatch) {
        floatRight = floatMatch[1].toLowerCase() === 'right';
      }

      // Build style object - always maintain aspect ratio
      // Don't include props.style - we want full control to prevent any external dimensions
      const style: React.CSSProperties = {
        maxWidth: '100%',
        maxHeight: 'none', // Remove any max-height constraints
        objectFit: 'contain', // Always maintain aspect ratio
        width: 'auto', // Default to auto to override potential fixed dimensions
        height: 'auto', // Default to auto
      };

      // Apply scale transform if specified
      if (scaleValue !== undefined && scaleValue > 0) {
        style.transform = `scale(${scaleValue})`;
        style.transformOrigin = 'top left';
      }

      // Apply float styling (only used for non-wrapped images, wrapper divs handle floated images)
      if (floatRight) {
        style.float = 'right';
        style.maxWidth = '50%';
        style.width = 'auto';
        style.marginLeft = '5rem';
        style.marginRight = '0';
        style.marginBottom = '0.4rem';
        style.marginTop = '0.2rem';
      } else if (floatMatch && floatMatch[1].toLowerCase() === 'left') {
        style.float = 'left';
        style.maxWidth = '50%';
        style.width = 'auto';
        style.marginRight = '5rem';
        style.marginBottom = '0.5rem';
        style.marginTop = '0.25rem';
      }

      // Set dimensions while always maintaining aspect ratio
      // Preserve float maxWidth if already set
      const floatMaxWidth = floatRight ? style.maxWidth : (floatMatch && floatMatch[1].toLowerCase() === 'left' ? style.maxWidth : undefined);
      
      if (width && height) {
        // When both are specified, use them as max constraints to fit within bounds while maintaining aspect ratio
        // But preserve float maxWidth if set
        if (!floatMaxWidth) {
          style.maxWidth = width;
        }
        style.maxHeight = height;
        // style.width/height are already 'auto' from default
      } else if (width) {
        // Only width specified - height auto maintains aspect ratio
        // But preserve float maxWidth if set
        if (!floatMaxWidth) {
          style.width = width;
        }
        // style.height is already 'auto'
      } else if (height) {
        // Only height specified - width auto maintains aspect ratio
        // style.width is already 'auto'
        style.height = height;
      }
      // When neither is specified, natural dimensions are used (maxWidth: 100% constrains to container, or float maxWidth if set)

      // Filter out width/height from props to avoid conflicts with our style
      // Also remove any width/height attributes that might be set by react-markdown or other sources
      const { width: propWidth, height: propHeight, style: propStyle, ...restProps } = props;
      
      // Create a clean props object without width/height attributes
      const imgProps: any = {};
      // Only copy safe props, explicitly excluding width/height
      Object.keys(restProps).forEach(key => {
        if (key !== 'width' && key !== 'height' && key !== 'style') {
          imgProps[key] = restProps[key];
        }
      });
      
      // Use a ref callback to remove width/height attributes from DOM after render and on load
      const imgRef = (element: HTMLImageElement | null) => {
        if (element) {
          const cleanup = () => {
            element.removeAttribute('width');
            element.removeAttribute('height');
            // Force reflow to ensure styles apply
            element.style.width = 'auto';
            element.style.height = 'auto';
            element.style.maxWidth = '100%';
            element.style.maxHeight = 'none';
            element.style.objectFit = 'contain';
            
            // DEBUG: Log what's happening
            console.log('Image cleanup:', {
              src: element.src,
              naturalWidth: element.naturalWidth,
              naturalHeight: element.naturalHeight,
              clientWidth: element.clientWidth,
              clientHeight: element.clientHeight,
              computedStyle: {
                width: window.getComputedStyle(element).width,
                height: window.getComputedStyle(element).height,
                maxWidth: window.getComputedStyle(element).maxWidth,
                maxHeight: window.getComputedStyle(element).maxHeight,
              },
              hasWidthAttr: element.hasAttribute('width'),
              hasHeightAttr: element.hasAttribute('height'),
            });
          };
          
          cleanup();
          // Also cleanup after image loads in case something sets dimensions then
          if (element.complete) {
            cleanup();
          } else {
            element.addEventListener('load', cleanup, { once: true });
          }
        }
      };
      
      // Wrap floated images in a container for better positioning
      if (floatRight) {
        return (
          <div style={{ float: 'right', marginLeft: '-2rem', marginBottom: '-4rem', marginTop: '0.1rem', maxWidth: '50%', width: 'auto' }}>
            <img
              ref={imgRef}
              src={src}
              alt={cleanAlt}
              {...imgProps}
              style={{ ...style, float: 'none', maxWidth: '100%', width: 'auto', height: 'auto' }}
              className="rounded-lg"
            />
          </div>
        );
      } else if (floatMatch && floatMatch[1].toLowerCase() === 'left') {
        return (
          <div style={{ float: 'left', marginRight: '5rem', marginBottom: '0.5rem', marginTop: '0.25rem', maxWidth: '50%', width: 'auto' }}>
            <img
              ref={imgRef}
              src={src}
              alt={cleanAlt}
              {...imgProps}
              style={{ ...style, float: 'none', maxWidth: '100%', width: 'auto', height: 'auto' }}
              className="rounded-lg"
            />
          </div>
        );
      }
      
      return (
        <img
          ref={imgRef}
          src={src}
          alt={cleanAlt}
          {...imgProps}
          style={style}
          className="rounded-lg"
        />
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: ({ node, children, ...props }: any) => {
      // Check if table should be borderless via data attribute or class
      const isBorderless = props['data-borderless'] === 'true' || 
                          props.className?.includes('borderless');
      
      return (
        <div className={`overflow-x-auto my-6 ${isBorderless ? 'table-borderless' : ''}`}>
          <table
            {...props}
            className={`min-w-full border-collapse ${isBorderless ? 'borderless' : 'border border-gray-300'}`}
          >
            {children}
          </table>
        </div>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thead: ({ node, children, ...props }: any) => {
      return (
        <thead
          {...props}
          className="bg-gray-100"
        >
          {children}
        </thead>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tbody: ({ node, children, ...props }: any) => {
      return (
        <tbody
          {...props}
        >
          {children}
        </tbody>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tr: ({ node, children, ...props }: any) => {
      return (
        <tr
          {...props}
          className="border-b border-gray-200"
        >
          {children}
        </tr>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    th: ({ node, children, ...props }: any) => {
      return (
        <th
          {...props}
          className="border border-gray-300 px-4 py-2 text-left font-semibold"
        >
          {children}
        </th>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    td: ({ node, children, ...props }: any) => {
      return (
        <td
          {...props}
          className="border border-gray-300 px-4 py-2"
        >
          {children}
        </td>
      );
    }
  };

  // Pre-process content to handle page breaks and two-column layouts
  // Two-column syntax: <div class="columns"><div class="column">...</div><div class="column">...</div></div>
  // Also convert tables marked with {borderless} or {columns} to two-column layouts
  let processedContent = content
    .replace(
      /<!-- pagebreak -->/g,
      '<div class="page-break"></div>'
    )
    .replace(
      /\\newpage/g,
      '<div class="page-break"></div>'
    );

  // Convert tables with {borderless} or {columns} marker to two-column layouts
  // Match: table block ending with {borderless} or {columns} on a line by itself or inline
  processedContent = processedContent.replace(
    /(\|[^\n]+\|[^\n]+\|\n)(\|[-\s:]+\|[-\s:]+\|\n)((?:\|[^\n]+\|[^\n]+\|\n?)+)(?:\s*\n\s*|\s+)(\{borderless\}|\{columns\})/g,
    (match, headerRow, separator, dataRows, marker) => {
      // Extract cells, handling leading/trailing pipes
      const headerCells = headerRow.split('|')
        .map((c: string) => c.trim())
        .filter((c: string) => c && !c.match(/^[-:\s]+$/));
      const dataLines = dataRows.trim().split('\n').filter((line: string) => line.trim());
      
      const leftCols: string[] = [];
      const rightCols: string[] = [];
      
      // Add header if present (preserve original markdown formatting)
      if (headerCells.length >= 2) {
        leftCols.push(headerCells[0]);
        rightCols.push(headerCells[1]);
      }
      
      // Add data rows (preserve original markdown formatting)
      dataLines.forEach((line: string) => {
        const cells = line.split('|')
          .map((c: string) => c.trim())
          .filter((c: string) => c);
        if (cells.length >= 2) {
          leftCols.push(cells[0]);
          rightCols.push(cells[1]);
        }
      });
      
      if (leftCols.length > 0 && rightCols.length > 0) {
        // Format each cell as a markdown block to ensure proper processing
        // Each cell becomes a paragraph, preserving markdown formatting
        const leftContent = leftCols
          .map(cell => cell.trim())
          .filter(cell => cell)
          .join('\n\n');
        const rightContent = rightCols
          .map(cell => cell.trim())
          .filter(cell => cell)
          .join('\n\n');
        return `<div class="columns">\n\n<div class="column">\n\n${leftContent}\n\n</div>\n\n<div class="column">\n\n${rightContent}\n\n</div>\n\n</div>`;
      }
      return match;
    }
  );

  const isPaged = settings.viewMode === 'paged';
  const pageHeight = settings.pageSize === PaperSize.Letter ? '279.4mm' : '297mm';
  const pageWidth = settings.pageSize === PaperSize.Letter ? '215.9mm' : '210mm';

  return (
    <>
      <style>{`
        /* Remove Tailwind prose constraints on images entirely */
        .prose :where(img):not(:where([class~="not-prose"] *)) {
          margin-top: 1em !important;
          margin-bottom: 1em !important;
        }
        
        /* Force all images to use auto dimensions */
        #printable-content img,
        .prose img,
        img {
          object-fit: contain !important;
          width: auto !important;
          height: auto !important;
          max-width: 100% !important;
          max-height: none !important;
          min-width: 0 !important;
          min-height: 0 !important;
        }
        
        /* Ensure floated images are block-level and positioned correctly */
        #printable-content img.float-right,
        #printable-content img.float-left,
        .prose img.float-right,
        .prose img.float-left,
        img.float-right,
        img.float-left {
          display: block !important;
        }
        
        /* Force float-right images to the right edge */
        #printable-content img.float-right,
        .prose img.float-right,
        img.float-right {
          float: right !important;
          margin-right: 0 !important;
          margin-left: 2rem !important;
          max-width: 50% !important;
        }
        
        /* Override any attribute-based dimensions */
        #printable-content img[width],
        #printable-content img[height],
        .prose img[width],
        .prose img[height],
        img[width],
        img[height] {
          width: auto !important;
          height: auto !important;
        }
        
        /* Table styling */
        #printable-content table,
        .prose table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin-top: 1.5rem !important;
          margin-bottom: 1.5rem !important;
        }
        
        #printable-content table th,
        .prose table th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
          text-align: left !important;
          padding: 0.5rem 1rem !important;
          border: 1px solid #d1d5db !important;
        }
        
        #printable-content table td,
        .prose table td {
          padding: 0.5rem 1rem !important;
          border: 1px solid #d1d5db !important;
        }
        
        #printable-content table tr,
        .prose table tr {
          border-bottom: 1px solid #e5e7eb !important;
        }
        
        #printable-content table tr:last-child,
        .prose table tr:last-child {
          border-bottom: none !important;
        }
        
        /* Borderless table styling (for two-column layouts) */
        #printable-content table.borderless,
        .prose table.borderless,
        table.borderless {
          border: none !important;
        }
        
        #printable-content table.borderless th,
        #printable-content table.borderless td,
        .prose table.borderless th,
        .prose table.borderless td,
        table.borderless th,
        table.borderless td {
          border: none !important;
          background-color: transparent !important;
          padding: 0.25rem 0.5rem !important;
        }
        
        #printable-content table.borderless th,
        .prose table.borderless th,
        table.borderless th {
          font-weight: 600 !important;
        }
      `}</style>
      <div className={`preview-wrapper flex justify-start items-start h-full bg-gray-100/50 p-8 no-print-scroll ${isPaged ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto'}`}>
        <div
          ref={ref}
          id="printable-content"
          className={`bg-white shadow-lg mx-auto transition-all duration-300 ease-in-out print-container ${isPaged ? 'h-full' : ''}`}
          style={isPaged ? {
          height: pageHeight,
          columnWidth: pageWidth,
          columnGap: '4rem',
          columnFill: 'auto',
          columnRule: '1px dashed #e5e7eb',
          padding: `${settings.margins}rem`,
          fontFamily: settings.fontFamily,
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight,
          width: 'max-content'
        } : {
          width: pageWidth,
          minHeight: pageHeight,
          padding: `${settings.margins}rem`,
          fontFamily: settings.fontFamily,
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight,
        }}
      >
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600">
          {/* We use rehype-raw to allow HTML tags like our pagebreak div if we installed it, 
               but to keep dependency count low, we stick to standard markdown. 
               We will use a custom component for specific text patterns if needed, 
               OR simpler: just rely on Markdown logic. 
               
               Let's trust remarkMath/rehypeKatex for the math. 
           */}
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            // Allow div for page breaks if we pass them as HTML? 
            // ReactMarkdown by default escapes HTML.
            // Let's stick to pure Markdown. 
            // We'll instruct users to use a Horizontal Rule `---` as a page break visual, 
            // or specific syntax.
            // BETTER: We just treat `---` as a page break? No, that's standard HR.
            // Let's use a custom component approach for a specific string.
            components={{
              ...components,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              div: ({ node, className, ...props }: any) => {
                if (className === 'page-break') {
                  return (
                    <div
                      className="page-break-indicator w-full border-b-2 border-dashed border-gray-300 my-8 relative print:border-none print:my-0 print:h-0 print:break-after-page print:page-break-after-always"
                      title="Page Break"
                    >
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 px-2 text-xs text-gray-500 font-mono print:hidden">Page Break</span>
                    </div>
                  );
                }
                // Handle two-column layout
                if (className === 'columns') {
                  return (
                    <div
                      className="flex gap-6 my-4 print:gap-4 prose prose-slate max-w-none"
                      style={{ alignItems: 'flex-start' }}
                      {...props}
                    />
                  );
                }
                if (className === 'column') {
                  // Process markdown content inside columns
                  // The children should already be processed by ReactMarkdown, but ensure proper rendering
                  return (
                    <div
                      className="flex-1 prose prose-slate max-w-none"
                      style={{ minWidth: 0 }}
                      {...props}
                    />
                  );
                }
                return <div className={className} {...props} />;
              }
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
    </>
  );
});

Preview.displayName = 'Preview';

export default Preview;
