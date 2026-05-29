import { useMemo } from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null

    const lines = content.split('\n')
    return lines.map((line, idx) => {
      const trimmed = line.trim()

      // 1. Render Subheadings (e.g., ### Title or ## Title)
      if (trimmed.startsWith('###')) {
        const text = trimmed.substring(3).trim()
        return <h4 key={idx} className="md-h4">{renderInline(text)}</h4>
      }
      if (trimmed.startsWith('##')) {
        const text = trimmed.substring(2).trim()
        return <h3 key={idx} className="md-h3">{renderInline(text)}</h3>
      }
      if (trimmed.startsWith('#')) {
        const text = trimmed.substring(1).trim()
        return <h2 key={idx} className="md-h2">{renderInline(text)}</h2>
      }

      // 2. Render Bullet Lists (e.g., * Item or - Item)
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const text = trimmed.substring(1).trim()
        return (
          <ul key={idx} className="md-ul">
            <li className="md-li">{renderInline(text)}</li>
          </ul>
        )
      }

      // 3. Render numbered lists (e.g., 1. Item)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
      if (numMatch) {
        const text = numMatch[2].trim()
        return (
          <ol key={idx} className="md-ol" start={parseInt(numMatch[1], 10)}>
            <li className="md-li">{renderInline(text)}</li>
          </ol>
        )
      }

      // 4. Default plain text line (with inline formatting)
      if (trimmed === '') {
        return <div key={idx} className="md-spacer" style={{ height: '8px' }} />
      }

      return <p key={idx} className="md-p">{renderInline(line)}</p>
    })
  }, [content])

  return <div className="markdown-body">{renderedElements}</div>
}

/**
 * Parses bold (**text**) and highlights in a line of text.
 */
function renderInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const clean = part.slice(2, -2)
      return <strong key={index} className="md-strong">{clean}</strong>
    }
    return part
  })
}
