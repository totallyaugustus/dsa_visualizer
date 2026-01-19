"use client"

import { useState, useMemo, useCallback } from "react"
import { AlgorithmSidebar } from "@/components/algorithm-sidebar"
import { ArrayVisualizer } from "@/components/array-visualizer"
import { CodeViewer } from "@/components/code-viewer"
import { AlgorithmControls } from "@/components/algorithm-controls"
import { useAlgorithmStepper } from "@/hooks/use-algorithm-stepper"
import {
  generatePrefixSumSteps,
  generateQuerySteps,
  prefixSumCode,
} from "@/lib/prefix-sum"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Zap, Clock, HardDrive } from "lucide-react"

const defaultArray = [1, 3, 4, 6, 5]

export default function PrefixSumPage() {
  const [inputValue, setInputValue] = useState(defaultArray.join(", "))
  const [currentArray, setCurrentArray] = useState(defaultArray)
  const [queryL, setQueryL] = useState("1")
  const [queryR, setQueryR] = useState("3")
  const [mode, setMode] = useState<"build" | "query">("build")
  const [queryStepsData, setQueryStepsData] = useState<ReturnType<
    typeof generateQuerySteps
  > | null>(null)

  const buildSteps = useMemo(
    () => generatePrefixSumSteps(currentArray),
    [currentArray]
  )

  const prefixArray = useMemo(() => {
    const prefix: number[] = []
    prefix[0] = currentArray[0]
    for (let i = 1; i < currentArray.length; i++) {
      prefix[i] = prefix[i - 1] + currentArray[i]
    }
    return prefix
  }, [currentArray])

  const stepper = useAlgorithmStepper({
    steps: mode === "build" ? buildSteps : (queryStepsData ?? buildSteps),
  })

  const handleRunWithNewInput = useCallback(() => {
    const parsed = inputValue
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n))

    if (parsed.length > 0) {
      setCurrentArray(parsed)
      setMode("build")
      stepper.reset()
    }
  }, [inputValue, stepper])

  const handleRunQuery = useCallback(() => {
    const l = parseInt(queryL, 10)
    const r = parseInt(queryR, 10)

    if (
      !isNaN(l) &&
      !isNaN(r) &&
      l >= 0 &&
      r < currentArray.length &&
      l <= r
    ) {
      const steps = generateQuerySteps(currentArray, prefixArray, l, r)
      setQueryStepsData(steps)
      setMode("query")
      stepper.reset()
    }
  }, [queryL, queryR, currentArray, prefixArray, stepper])

  const handleBackToBuild = useCallback(() => {
    setMode("build")
    setQueryStepsData(null)
    stepper.reset()
  }, [stepper])

  return (
    <div className="flex min-h-screen bg-background">
      <AlgorithmSidebar />

      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Prefix Sum Array
              </h1>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                O(n) build, O(1) query
              </Badge>
              <Badge variant="outline" className="gap-1">
                <HardDrive className="h-3 w-3" />
                O(n) space
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Precompute cumulative sums to answer range sum queries in constant
              time. A fundamental technique for competitive programming and
              interview problems.
            </p>
          </header>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Code and Controls */}
            <div className="space-y-4">
              <CodeViewer
                code={prefixSumCode}
                language="javascript"
                highlightedLine={stepper.currentCodeLine}
              />

              <AlgorithmControls
                currentStep={stepper.currentStep}
                totalSteps={stepper.totalSteps}
                isPlaying={stepper.isPlaying}
                speed={stepper.speed}
                onPlay={stepper.play}
                onPause={stepper.pause}
                onStepForward={stepper.stepForward}
                onStepBackward={stepper.stepBackward}
                onReset={stepper.reset}
                onSpeedChange={stepper.setSpeed}
              />

              {/* Description */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm text-foreground">
                      {stepper.currentDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Visualization */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Visualization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ArrayVisualizer
                    label="Original Array (A)"
                    elements={stepper.currentState?.originalArray ?? []}
                    showIndices
                  />

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-sm">Cumulative Sum</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  <ArrayVisualizer
                    label="Prefix Array (B)"
                    elements={stepper.currentState?.prefixArray ?? []}
                    showIndices
                  />

                  {stepper.currentState?.queryResult && (
                    <div className="mt-4 rounded-lg bg-primary/10 p-4">
                      <p className="font-mono text-sm">
                        <span className="text-muted-foreground">
                          sum({stepper.currentState.queryResult.l},{" "}
                          {stepper.currentState.queryResult.r}) ={" "}
                        </span>
                        <span className="text-primary font-bold text-lg">
                          {stepper.currentState.queryResult.result}
                        </span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Input Section */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="array-input">
                      Array (comma-separated integers)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="array-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="1, 3, 4, 6, 5"
                        className="font-mono"
                      />
                      <Button onClick={handleRunWithNewInput}>Build</Button>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <Label>Range Query</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">L:</span>
                        <Input
                          value={queryL}
                          onChange={(e) => setQueryL(e.target.value)}
                          className="w-16 font-mono"
                          type="number"
                          min={0}
                          max={currentArray.length - 1}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">R:</span>
                        <Input
                          value={queryR}
                          onChange={(e) => setQueryR(e.target.value)}
                          className="w-16 font-mono"
                          type="number"
                          min={0}
                          max={currentArray.length - 1}
                        />
                      </div>
                      <Button
                        variant="secondary"
                        onClick={handleRunQuery}
                        disabled={mode === "build" && stepper.currentStep < buildSteps.length - 1}
                      >
                        Query
                      </Button>
                      {mode === "query" && (
                        <Button variant="outline" onClick={handleBackToBuild}>
                          Reset
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      0-indexed. Valid range: 0 to {currentArray.length - 1}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">A:</span>
                      <span>[{currentArray.join(", ")}]</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">B:</span>
                      <span className="text-primary">
                        [{prefixArray.join(", ")}]
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Motivation Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Why Prefix Sums?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Naive Approach
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Computing range sums naively requires O(N) time per query,
                    leading to O(N*Q) total time for Q queries.
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-4 border border-primary/30">
                  <h4 className="font-semibold text-foreground mb-2">
                    With Prefix Sums
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    After O(N) preprocessing, each query takes O(1) time. Total
                    time: O(N + Q).
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    Limitation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Static arrays only - does not support efficient updates. For
                    updates, consider Segment Trees or BIT.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
