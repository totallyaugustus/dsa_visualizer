"use client"

import { useState, useCallback, useEffect, useRef } from "react"

export interface AlgorithmStep<T> {
  state: T
  codeLine: number
  description: string
}

interface UseAlgorithmStepperOptions<T> {
  steps: AlgorithmStep<T>[]
  initialSpeed?: number
}

export function useAlgorithmStepper<T>({
  steps,
  initialSpeed = 1,
}: UseAlgorithmStepperOptions<T>) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(initialSpeed)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearPlayInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const reset = useCallback(() => {
    clearPlayInterval()
    setIsPlaying(false)
    setCurrentStep(0)
  }, [clearPlayInterval])

  const play = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }, [currentStep, steps.length])

  const pause = useCallback(() => {
    clearPlayInterval()
    setIsPlaying(false)
  }, [clearPlayInterval])

  useEffect(() => {
    if (isPlaying) {
      const baseInterval = 1000
      const interval = baseInterval / speed

      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            clearPlayInterval()
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, interval)
    }

    return clearPlayInterval
  }, [isPlaying, speed, steps.length, clearPlayInterval])

  const currentState = steps[currentStep]?.state
  const currentCodeLine = steps[currentStep]?.codeLine
  const currentDescription = steps[currentStep]?.description ?? ""

  return {
    currentStep,
    totalSteps: steps.length,
    currentState,
    currentCodeLine,
    currentDescription,
    isPlaying,
    speed,
    stepForward,
    stepBackward,
    reset,
    play,
    pause,
    setSpeed,
    goToStep: setCurrentStep,
  }
}
