"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CodeViewerProps {
  code: string
  language?: string
  highlightedLine?: number
  className?: string
}

export function CodeViewer({
  code,
  language = "javascript",
  highlightedLine,
  className,
}: CodeViewerProps) {
  const lines = code.split("\n")

  return (
    <div className={cn("overflow-hidden rounded-lg bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-destructive/50" />
          <div className="h-3 w-3 rounded-full bg-highlight/50" />
          <div className="h-3 w-3 rounded-full bg-success/50" />
        </div>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm">
          {lines.map((line, index) => {
            const lineNumber = index + 1
            const isHighlighted = highlightedLine === lineNumber

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  backgroundColor: isHighlighted
                    ? "var(--highlight)"
                    : "transparent",
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex rounded px-2 -mx-2",
                  isHighlighted && "text-highlight-foreground"
                )}
              >
                <span
                  className={cn(
                    "mr-4 inline-block w-6 select-none text-right",
                    isHighlighted
                      ? "text-highlight-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {lineNumber}
                </span>
                <code className="flex-1">
                  <SyntaxHighlight
                    code={line}
                    isHighlighted={isHighlighted}
                  />
                </code>
              </motion.div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}

function SyntaxHighlight({
  code,
  isHighlighted,
}: {
  code: string
  isHighlighted: boolean
}) {
  // Simple syntax highlighting
  const tokens = tokenize(code)

  return (
    <>
      {tokens.map((token, i) => (
        <span
          key={i}
          className={cn(
            token.type === "keyword" && !isHighlighted && "text-chart-4",
            token.type === "string" && !isHighlighted && "text-success",
            token.type === "number" && !isHighlighted && "text-highlight",
            token.type === "comment" && "text-muted-foreground italic",
            token.type === "function" && !isHighlighted && "text-accent",
            token.type === "operator" && !isHighlighted && "text-chart-4",
            token.type === "bracket" && !isHighlighted && "text-foreground/70"
          )}
        >
          {token.value}
        </span>
      ))}
    </>
  )
}

interface Token {
  type: "keyword" | "string" | "number" | "comment" | "function" | "operator" | "bracket" | "text"
  value: string
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  const keywords = [
    "const",
    "let",
    "var",
    "for",
    "while",
    "if",
    "else",
    "return",
    "function",
    "new",
    "class",
    "import",
    "export",
    "from",
    "async",
    "await",
  ]

  let remaining = code
  while (remaining.length > 0) {
    // Comments
    if (remaining.startsWith("//")) {
      tokens.push({ type: "comment", value: remaining })
      break
    }

    // Strings
    const stringMatch = remaining.match(/^(['"`]).*?\1/)
    if (stringMatch) {
      tokens.push({ type: "string", value: stringMatch[0] })
      remaining = remaining.slice(stringMatch[0].length)
      continue
    }

    // Numbers
    const numberMatch = remaining.match(/^\d+(\.\d+)?/)
    if (numberMatch) {
      tokens.push({ type: "number", value: numberMatch[0] })
      remaining = remaining.slice(numberMatch[0].length)
      continue
    }

    // Keywords and identifiers
    const wordMatch = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/)
    if (wordMatch) {
      const word = wordMatch[0]
      const nextChar = remaining[word.length]
      if (keywords.includes(word)) {
        tokens.push({ type: "keyword", value: word })
      } else if (nextChar === "(") {
        tokens.push({ type: "function", value: word })
      } else {
        tokens.push({ type: "text", value: word })
      }
      remaining = remaining.slice(word.length)
      continue
    }

    // Operators
    const operatorMatch = remaining.match(/^[+\-*/%=<>!&|^~?:]+/)
    if (operatorMatch) {
      tokens.push({ type: "operator", value: operatorMatch[0] })
      remaining = remaining.slice(operatorMatch[0].length)
      continue
    }

    // Brackets
    const bracketMatch = remaining.match(/^[[\](){}]/)
    if (bracketMatch) {
      tokens.push({ type: "bracket", value: bracketMatch[0] })
      remaining = remaining.slice(1)
      continue
    }

    // Everything else (whitespace, punctuation)
    tokens.push({ type: "text", value: remaining[0] })
    remaining = remaining.slice(1)
  }

  return tokens
}
