import Link from "next/link"

import { ArrowRight, ListTodo, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            5s3s Task Manager
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Create, manage, and organize your tasks with the help of AI
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          <Card className="flex flex-col items-center justify-between p-6">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <Plus className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>
                Use AI to generate detailed task drafts from your simple requests
              </CardDescription>
            </div>
            <Button
              asChild
              className="mt-6"
            >
              <Link href="/create">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>

          <Card className="flex flex-col items-center justify-between p-6">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <ListTodo className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>View Tasks</CardTitle>
              <CardDescription>
                Browse and manage all your submitted tasks in one place
              </CardDescription>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-6"
            >
              <Link href="/dashboard">
                View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>

        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
            <CardDescription>Quick guide to using the 5s3s Task Manager</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-[25px_1fr] gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-medium leading-none">Create a Task Request</p>
                  <p className="text-sm text-muted-foreground">
                    Enter your task request in the chat interface
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[25px_1fr] gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-medium leading-none">Generate a Draft</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Generate Draft" to let AI create a detailed task
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[25px_1fr] gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  3
                </div>
                <div className="space-y-1">
                  <p className="font-medium leading-none">Review and Submit</p>
                  <p className="text-sm text-muted-foreground">
                    Review the AI-generated draft and submit it to your task list
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[25px_1fr] gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  4
                </div>
                <div className="space-y-1">
                  <p className="font-medium leading-none">Manage Tasks</p>
                  <p className="text-sm text-muted-foreground">
                    View and manage all your tasks in the dashboard
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
