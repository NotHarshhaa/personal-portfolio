import { Link } from 'next-view-transitions'

interface FormattedTextProps {
  text: string
  /** Called when an internal portfolio link inside the reply is clicked */
  onNavigate?: () => void
}

// Format markdown into rich UI (links, bold, inline code, lists)
export function FormattedText({ text, onNavigate }: FormattedTextProps) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} className="h-2" />
        }

        // Inline renderer: markdown links [text](url), **bold**, `code`
        const parseInline = (str: string) => {
          const linkRegex = /\[(.*?)\]\((.*?)\)/g
          const parts: React.ReactNode[] = []
          let lastIdx = 0
          let match

          const renderEmphasis = (segment: string, key: string) =>
            segment
              // **bold**
              .split(/\*\*(.*?)\*\*/g)
              .map((boldPart, boldIdx) => {
                const boldKey = `${key}-b${boldIdx}`
                if (boldIdx % 2 === 1) {
                  return (
                    <strong
                      key={boldKey}
                      className="font-semibold text-foreground"
                    >
                      {boldPart}
                    </strong>
                  )
                }
                // `code`
                return boldPart.split(/`([^`]+)`/g).map((codePart, codeIdx) =>
                  codeIdx % 2 === 1 ? (
                    <code
                      key={`${boldKey}-c${codeIdx}`}
                      className="border-border bg-muted/70 mx-px border px-1 py-px font-mono text-[0.85em] text-foreground"
                    >
                      {codePart}
                    </code>
                  ) : (
                    codePart
                  )
                )
              })

          while ((match = linkRegex.exec(str)) !== null) {
            if (match.index > lastIdx) {
              parts.push(
                ...renderEmphasis(
                  str.substring(lastIdx, match.index),
                  `t${match.index}`
                )
              )
            }
            const linkText = match[1] ?? ''
            const href = match[2] ?? '#'
            const linkClass =
              'font-medium text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground'
            const isExternal =
              href.startsWith('http') || href.startsWith('mailto:')

            if (isExternal) {
              parts.push(
                <a
                  key={`l${match.index}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {linkText}
                </a>
              )
            } else {
              parts.push(
                <Link
                  key={`l${match.index}`}
                  href={href}
                  onClick={onNavigate}
                  className={linkClass}
                >
                  {linkText}
                </Link>
              )
            }
            lastIdx = match.index + match[0].length
          }

          if (lastIdx < str.length) {
            parts.push(...renderEmphasis(str.substring(lastIdx), 't-end'))
          }

          return parts
        }

        // Bullet lists
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <div
              key={idx}
              className="flex items-start gap-2 py-0.5 pl-1 text-xs text-muted-foreground sm:text-sm"
            >
              <span className="text-foreground/50 select-none">•</span>
              <span className="flex-1">{parseInline(line.substring(2))}</span>
            </div>
          )
        }

        // Ordered lists
        const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/)
        if (orderedMatch) {
          return (
            <div
              key={idx}
              className="flex items-start gap-2 py-0.5 pl-1 text-xs text-muted-foreground sm:text-sm"
            >
              <span className="font-mono text-foreground/50 tabular-nums select-none">
                {orderedMatch[1]}.
              </span>
              <span className="flex-1">
                {parseInline(orderedMatch[2] ?? '')}
              </span>
            </div>
          )
        }

        return (
          <p
            key={idx}
            className="text-xs leading-relaxed text-muted-foreground sm:text-sm"
          >
            {parseInline(line)}
          </p>
        )
      })}
    </>
  )
}
