import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathRenderer({ text, content, inline = false, className = '' }) {
  const input = text !== undefined && text !== null ? text : content;
  if (input === undefined || input === null || input === '') return null;

  const renderMath = (rawInput) => {
    try {
      let str = String(rawInput);

      // Check if pure LaTeX formula without delimiters (e.g. \frac{a}{b} + \frac{c}{d} = \frac{ad+bc}{bd})
      const hasDelimiters = /(\$\$|\\\[|\\\(|\$)/.test(str);
      const isPureLatex = !hasDelimiters && (
        str.startsWith('\\') ||
        (/[\\[\]{}^_]/.test(str) && !/[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/.test(str))
      );

      if (isPureLatex) {
        return katex.renderToString(str.trim(), { displayMode: !inline, throwOnError: false });
      }

      // 1. Replace display math $$...$$ or \[...\]
      str = str.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g, (_, match) => {
        const math = match.replace(/^(\$\$|\\\[)/, '').replace(/(\$\$|\\\])$/, '').trim();
        return katex.renderToString(math, { displayMode: true, throwOnError: false });
      });

      // 2. Replace inline math \(...\) or $...$
      str = str.replace(/(\\\([\s\S]*?\\\)|(\$([^\$\n]+?)\$))/g, (match) => {
        let math = match;
        if (match.startsWith('\\(') && match.endsWith('\\)')) {
          math = match.slice(2, -2).trim();
        } else if (match.startsWith('$') && match.endsWith('$')) {
          math = match.slice(1, -1).trim();
        }
        return katex.renderToString(math, { displayMode: false, throwOnError: false });
      });

      // 3. Handle basic markdown bold (**text**)
      str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      return str;
    } catch (e) {
      console.error('MathRenderer error:', e);
      return String(rawInput);
    }
  };

  return (
    <span
      className={className || undefined}
      dangerouslySetInnerHTML={{ __html: renderMath(input) }}
    />
  );
}
