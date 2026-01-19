export interface AlgorithmCategory {
  name: string
  algorithms: AlgorithmInfo[]
}

export interface AlgorithmInfo {
  id: string
  name: string
  slug: string
  timeComplexity: string
  spaceComplexity: string
  description: string
}

export const algorithmCategories: AlgorithmCategory[] = [
  {
    name: "Arrays",
    algorithms: [
      {
        id: "prefix-sum",
        name: "Prefix Sum Array",
        slug: "prefix-sum",
        timeComplexity: "O(n) preprocess, O(1) query",
        spaceComplexity: "O(n)",
        description: "Precompute cumulative sums for O(1) range sum queries",
      },
      {
        id: "two-pointers",
        name: "Two Pointers",
        slug: "two-pointers",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        description: "Efficiently scan arrays from both ends",
      },
      {
        id: "sliding-window",
        name: "Sliding Window",
        slug: "sliding-window",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        description: "Track a window of elements as it moves",
      },
    ],
  },
  {
    name: "Sorting",
    algorithms: [
      {
        id: "bubble-sort",
        name: "Bubble Sort",
        slug: "bubble-sort",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        description: "Simple comparison-based sorting algorithm",
      },
      {
        id: "merge-sort",
        name: "Merge Sort",
        slug: "merge-sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        description: "Divide and conquer sorting algorithm",
      },
      {
        id: "quick-sort",
        name: "Quick Sort",
        slug: "quick-sort",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        description: "Efficient divide and conquer sorting",
      },
    ],
  },
  {
    name: "Trees",
    algorithms: [
      {
        id: "binary-search",
        name: "Binary Search",
        slug: "binary-search",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        description: "Efficiently search sorted arrays",
      },
      {
        id: "tree-traversal",
        name: "Tree Traversal",
        slug: "tree-traversal",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
        description: "Visit all nodes in a tree",
      },
    ],
  },
  {
    name: "Graphs",
    algorithms: [
      {
        id: "bfs",
        name: "Breadth-First Search",
        slug: "bfs",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        description: "Explore graph level by level",
      },
      {
        id: "dfs",
        name: "Depth-First Search",
        slug: "dfs",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        description: "Explore graph by going deep first",
      },
    ],
  },
  {
    name: "Dynamic Programming",
    algorithms: [
      {
        id: "fibonacci",
        name: "Fibonacci (DP)",
        slug: "fibonacci",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n) or O(1)",
        description: "Calculate Fibonacci numbers efficiently",
      },
      {
        id: "knapsack",
        name: "0/1 Knapsack",
        slug: "knapsack",
        timeComplexity: "O(nW)",
        spaceComplexity: "O(nW)",
        description: "Optimize value within weight constraint",
      },
    ],
  },
]
