"use client"

import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export interface ArrayElement {
  value: number
  index: number
  highlight?: "active" | "reading" | "writing" | "result" | "comparing"
  label?: string
}

interface ArrayVisualizerProps {
  elements: ArrayElement[]
  label?: string
  showIndices?: boolean
  className?: string
  compact?: boolean
  connection?: {
    fromIndex: number
    toIndex: number
  }
}

const highlightColors: Record<string, { bg: string; border: string; text: string }> = {
  active: {
    bg: "bg-highlight/20",
    border: "border-highlight",
    text: "text-highlight-foreground",
  },
  reading: {
    bg: "bg-accent/20",
    border: "border-accent",
    text: "text-accent-foreground",
  },
  writing: {
    bg: "bg-primary/20",
    border: "border-primary",
    text: "text-primary-foreground",
  },
  result: {
    bg: "bg-success/20",
    border: "border-success",
    text: "text-success-foreground",
  },
  comparing: {
    bg: "bg-chart-4/20",
    border: "border-chart-4",
    text: "text-foreground",
  },
}

export function ArrayVisualizer({
  elements,
  label,
  showIndices = true,
  className,
  compact = false,
}: ArrayVisualizerProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
      <div className="flex flex-wrap items-end gap-1">
        <AnimatePresence mode="popLayout">
          {elements.map((element, idx) => {
            const colors = element.highlight
              ? highlightColors[element.highlight]
              : { bg: "bg-card", border: "border-border", text: "text-foreground" }

            return (
              <motion.div
                key={`${idx}-${element.index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-1"
              >
                {element.label && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-primary"
                  >
                    {element.label}
                  </motion.span>
                )}
                <motion.div
                  layout
                  className={cn(
                    "flex items-center justify-center rounded-md border-2 font-mono transition-colors",
                    colors.bg,
                    colors.border,
                    colors.text,
                    compact ? "h-10 w-10 text-sm" : "h-12 w-12 text-base"
                  )}
                >
                  <motion.span
                    key={element.value}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {element.value}
                  </motion.span>
                </motion.div>
                {showIndices && (
                  <span className="text-xs text-muted-foreground">
                    {element.index}
                  </span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
