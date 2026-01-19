import { AlgorithmSidebar } from "@/components/algorithm-sidebar"
import { algorithmCategories } from "@/lib/algorithms"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, ArrowRight, Zap, BookOpen, Play } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const featuredAlgorithm = algorithmCategories[0].algorithms[0]

  return (
    <div className="flex min-h-screen bg-background">
      <AlgorithmSidebar />

      <main className="flex-1 overflow-auto">
        <div className="container max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12">
          {/* Hero Section */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 rounded-full bg-primary/10 px-4 py-1.5">
              <Code2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Interactive Algorithm Visualizer
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              Learn Algorithms
              <br />
              <span className="text-primary">Step by Step</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Visualize data structures and algorithms with interactive
              animations. Understand the code execution flow line by line.
            </p>
          </header>

          {/* Featured Algorithm */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Get Started</h2>
              <Badge variant="secondary">Featured</Badge>
            </div>
            <Link href={`/algorithm/${featuredAlgorithm.slug}`}>
              <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {featuredAlgorithm.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {featuredAlgorithm.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {featuredAlgorithm.timeComplexity}
                        </Badge>
                        <Badge variant="outline">
                          {featuredAlgorithm.spaceComplexity}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Play className="h-5 w-5" />
                      <span className="font-medium">Start Learning</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>

          {/* Algorithm Categories */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {algorithmCategories.map((category) => (
                <Card key={category.name} className="hover:border-border/80 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {category.algorithms.map((algo) => (
                        <li key={algo.id}>
                          <Link
                            href={`/algorithm/${algo.slug}`}
                            className="flex items-center justify-between py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                          >
                            <span>{algo.name}</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Step-by-Step</h3>
                      <p className="text-sm text-muted-foreground">
                        Control the execution speed, pause, and step through
                        each line of code.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <Zap className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Visual Animations</h3>
                      <p className="text-sm text-muted-foreground">
                        See array elements highlight and update in real-time
                        with smooth animations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-highlight/10 p-2">
                      <BookOpen className="h-5 w-5 text-highlight" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Custom Input</h3>
                      <p className="text-sm text-muted-foreground">
                        Try your own test cases and see how the algorithm
                        handles different inputs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
