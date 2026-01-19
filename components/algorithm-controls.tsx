"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AlgorithmControlsProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  onPlay: () => void
  onPause: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
  className?: string
}

export function AlgorithmControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  className,
}: AlgorithmControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg bg-card p-4",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onStepBackward}
          disabled={currentStep <= 0}
          title="Step backward"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={isPlaying ? onPause : onPlay}
          disabled={currentStep >= totalSteps - 1 && !isPlaying}
          title={isPlaying ? "Pause" : "Play"}
          className="h-10 w-10"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          title="Step forward"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <FastForward className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={[speed]}
          onValueChange={(v) => onSpeedChange(v[0])}
          min={0.25}
          max={2}
          step={0.25}
          className="flex-1"
        />
        <span className="w-12 text-right text-sm text-muted-foreground">
          {speed}x
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <div className="h-1.5 flex-1 mx-4 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
