"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { algorithmCategories } from "@/lib/algorithms"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Code2, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AlgorithmSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const defaultOpenCategories = algorithmCategories
    .filter((cat) =>
      cat.algorithms.some((algo) => pathname.includes(algo.slug))
    )
    .map((cat) => cat.name)

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
        <Code2 className="h-6 w-6 text-primary" />
        <Link href="/" className="text-lg font-semibold tracking-tight">
          AlgoViz
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <Accordion
          type="multiple"
          defaultValue={
            defaultOpenCategories.length > 0
              ? defaultOpenCategories
              : [algorithmCategories[0]?.name]
          }
          className="space-y-1"
        >
          {algorithmCategories.map((category) => (
            <AccordionItem
              key={category.name}
              value={category.name}
              className="border-none"
            >
              <AccordionTrigger className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline [&[data-state=open]]:text-foreground">
                {category.name}
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-0">
                <div className="ml-2 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
                  {category.algorithms.map((algo) => {
                    const isActive = pathname === `/algorithm/${algo.slug}`
                    return (
                      <Link
                        key={algo.id}
                        href={`/algorithm/${algo.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        {algo.name}
                      </Link>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-muted-foreground">
          Learn algorithms interactively
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden w-64 shrink-0 md:block" />
    </>
  )
}
