import { useMemo } from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null

    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let currentList: { type: 'ul' | 'ol'; items: { text: string; start?: number }[] } | null = null

    const flushList = (key: number) => {
      if (!currentList) return
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${key}`} className="md-ul">
            {currentList.items.map((item, i) => (
              <li key={i} className="md-li">{renderInline(item.text)}</li>
            ))}
          </ul>
        )
      } else {
        elements.push(
          <ol key={`ol-${key}`} className="md-ol" start={currentList.items[0].start}>
            {currentList.items.map((item, i) => (
              <li key={i} className="md-li">{renderInline(item.text)}</li>
            ))}
          </ol>
        )
      }
      currentList = null
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()

      // 1. Render Bullet Lists (e.g., * Item or - Item)
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const text = trimmed.substring(1).trim()
        if (currentList && currentList.type === 'ul') {
          currentList.items.push({ text })
        } else {
          flushList(idx)
          currentList = { type: 'ul', items: [{ text }] }
        }
        return
      }

      // 2. Render numbered lists (e.g., 1. Item)
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
      if (numMatch) {
        const start = parseInt(numMatch[1], 10)
        const text = numMatch[2].trim()
        if (currentList && currentList.type === 'ol') {
          currentList.items.push({ text })
        } else {
          flushList(idx)
          currentList = { type: 'ol', items: [{ text, start }] }
        }
        return
      }

      // Not a list item, flush any current list
      flushList(idx)

      // 3. Render Subheadings
      if (trimmed.startsWith('###')) {
        const text = trimmed.substring(3).trim()
        elements.push(<h4 key={idx} className="md-h4">{renderInline(text)}</h4>)
        return
      }
      if (trimmed.startsWith('##')) {
        const text = trimmed.substring(2).trim()
        elements.push(<h3 key={idx} className="md-h3">{renderInline(text)}</h3>)
        return
      }
      if (trimmed.startsWith('#')) {
        const text = trimmed.substring(1).trim()
        elements.push(<h2 key={idx} className="md-h2">{renderInline(text)}</h2>)
        return
      }

      // 4. Default plain text line (with inline formatting) or empty spacer
      if (trimmed === '') {
        elements.push(<div key={idx} className="md-spacer" />)
        return
      }

      elements.push(<p key={idx} className="md-p">{renderInline(line)}</p>)
    })

    flushList(lines.length)
    return elements
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
