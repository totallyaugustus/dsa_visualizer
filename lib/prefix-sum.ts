import type { AlgorithmStep } from "@/hooks/use-algorithm-stepper"
import type { ArrayElement } from "@/components/array-visualizer"

export interface PrefixSumState {
  originalArray: ArrayElement[]
  prefixArray: ArrayElement[]
  currentIndex: number
  phase: "building" | "querying" | "done"
  queryResult?: {
    l: number
    r: number
    result: number
    usedIndices: number[]
  }
}

export const prefixSumCode = `const prefix = new Array(n);
prefix[0] = a[0];
for (let i = 1; i < n; i++) {
  prefix[i] = prefix[i - 1] + a[i];
}

// Query sum from l to r (0-indexed)
function rangeSum(l, r) {
  if (l === 0) return prefix[r];
  return prefix[r] - prefix[l - 1];
}`

export function generatePrefixSumSteps(
  inputArray: number[]
): AlgorithmStep<PrefixSumState>[] {
  const steps: AlgorithmStep<PrefixSumState>[] = []
  const n = inputArray.length

  // Initial state
  steps.push({
    state: {
      originalArray: inputArray.map((value, index) => ({ value, index })),
      prefixArray: inputArray.map((_, index) => ({ value: 0, index })),
      currentIndex: -1,
      phase: "building",
    },
    codeLine: 1,
    description: "Initialize prefix array with the same length as input array",
  })

  // Set prefix[0] = a[0]
  const prefixValues = new Array(n).fill(0)
  prefixValues[0] = inputArray[0]
  steps.push({
    state: {
      originalArray: inputArray.map((value, index) => ({
        value,
        index,
        highlight: index === 0 ? "reading" : undefined,
      })),
      prefixArray: prefixValues.map((value, index) => ({
        value,
        index,
        highlight: index === 0 ? "writing" : undefined,
      })),
      currentIndex: 0,
      phase: "building",
    },
    codeLine: 2,
    description: `Set prefix[0] = a[0] = ${inputArray[0]}`,
  })

  // Build prefix array
  for (let i = 1; i < n; i++) {
    // Show the calculation about to happen
    steps.push({
      state: {
        originalArray: inputArray.map((value, index) => ({
          value,
          index,
          highlight: index === i ? "reading" : undefined,
          label: index === i ? "a[i]" : undefined,
        })),
        prefixArray: prefixValues.map((value, index) => ({
          value,
          index,
          highlight: index === i - 1 ? "reading" : undefined,
          label: index === i - 1 ? "prefix[i-1]" : undefined,
        })),
        currentIndex: i,
        phase: "building",
      },
      codeLine: 4,
      description: `Reading a[${i}] = ${inputArray[i]} and prefix[${i - 1}] = ${prefixValues[i - 1]}`,
    })

    prefixValues[i] = prefixValues[i - 1] + inputArray[i]

    // Show the result
    steps.push({
      state: {
        originalArray: inputArray.map((value, index) => ({
          value,
          index,
          highlight: index === i ? "active" : undefined,
        })),
        prefixArray: prefixValues.map((value, index) => ({
          value,
          index,
          highlight: index === i ? "writing" : undefined,
          label: index === i ? `${prefixValues[i - 1]} + ${inputArray[i]}` : undefined,
        })),
        currentIndex: i,
        phase: "building",
      },
      codeLine: 4,
      description: `Set prefix[${i}] = prefix[${i - 1}] + a[${i}] = ${prefixValues[i - 1] - inputArray[i]} + ${inputArray[i]} = ${prefixValues[i]}`,
    })
  }

  // Final state - show completed prefix array
  steps.push({
    state: {
      originalArray: inputArray.map((value, index) => ({ value, index })),
      prefixArray: prefixValues.map((value, index) => ({
        value,
        index,
        highlight: "result",
      })),
      currentIndex: n,
      phase: "done",
    },
    codeLine: 5,
    description: "Prefix array construction complete! Ready for O(1) range queries.",
  })

  return steps
}

export function generateQuerySteps(
  inputArray: number[],
  prefixArray: number[],
  l: number,
  r: number
): AlgorithmStep<PrefixSumState>[] {
  const steps: AlgorithmStep<PrefixSumState>[] = []

  // Initial query state
  steps.push({
    state: {
      originalArray: inputArray.map((value, index) => ({
        value,
        index,
        highlight: index >= l && index <= r ? "active" : undefined,
      })),
      prefixArray: prefixArray.map((value, index) => ({ value, index })),
      currentIndex: -1,
      phase: "querying",
      queryResult: { l, r, result: 0, usedIndices: [] },
    },
    codeLine: 8,
    description: `Query: sum from index ${l} to ${r}`,
  })

  if (l === 0) {
    const result = prefixArray[r]
    steps.push({
      state: {
        originalArray: inputArray.map((value, index) => ({
          value,
          index,
          highlight: index >= l && index <= r ? "active" : undefined,
        })),
        prefixArray: prefixArray.map((value, index) => ({
          value,
          index,
          highlight: index === r ? "result" : undefined,
        })),
        currentIndex: r,
        phase: "querying",
        queryResult: { l, r, result, usedIndices: [r] },
      },
      codeLine: 9,
      description: `Since l = 0, result = prefix[${r}] = ${result}`,
    })
  } else {
    // Show prefix[r]
    steps.push({
      state: {
        originalArray: inputArray.map((value, index) => ({
          value,
          index,
          highlight: index >= l && index <= r ? "active" : undefined,
        })),
        prefixArray: prefixArray.map((value, index) => ({
          value,
          index,
          highlight: index === r ? "reading" : undefined,
          label: index === r ? "prefix[r]" : undefined,
        })),
        currentIndex: r,
        phase: "querying",
        queryResult: { l, r, result: 0, usedIndices: [r] },
      },
      codeLine: 10,
      description: `Read prefix[${r}] = ${prefixArray[r]}`,
    })

    // Show prefix[l-1]
    steps.push({
      state: {
        originalArray: inputArray.map((value, index) => ({
          value,
          index,
          highlight: index >= l && index <= r ? "active" : undefined,
        })),
        prefixArray: prefixArray.map((value, index) => ({
          value,
          index,
          highlight:
            index === r
              ? "reading"
              : index === l - 1
                ? "comparing"
                : undefined,
          label:
            index === r
              ? "prefix[r]"
              : index === l - 1
                ? "prefix[l-1]"
                : undefined,
        })),
        currentIndex: l - 1,
        phase: "querying",
        queryResult: { l, r, result: 0, usedIndices: [r, l - 1] },
      },
      codeLine: 10,
      description: `Read prefix[${l - 1}] = ${prefixArray[l - 1]}`,
    })

    const result = prefixArray[r] - prefixArray[l - 1]
    steps.push({
      state: {
        originalArray: inputArray.map((value, index) => ({
          value,
          index,
          highlight: index >= l && index <= r ? "result" : undefined,
        })),
        prefixArray: prefixArray.map((value, index) => ({
          value,
          index,
          highlight: index === r || index === l - 1 ? "result" : undefined,
        })),
        currentIndex: -1,
        phase: "done",
        queryResult: { l, r, result, usedIndices: [r, l - 1] },
      },
      codeLine: 10,
      description: `Result = prefix[${r}] - prefix[${l - 1}] = ${prefixArray[r]} - ${prefixArray[l - 1]} = ${result}`,
    })
  }

  return steps
}
