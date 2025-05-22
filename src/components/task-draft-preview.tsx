"use client"

import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

interface TaskDraftPreviewProps {
  taskDraft: { title: string; description: string } | null
  isSubmitting: boolean
  onSubmit: () => void
}

export function TaskDraftPreview({ taskDraft, isSubmitting, onSubmit }: TaskDraftPreviewProps) {
  if (!taskDraft) {
    return (
      <Card className="h-full flex flex-col justify-center items-center p-6 border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="text-muted-foreground">Task Draft Preview</CardTitle>
          <CardDescription>
            Generate a draft to see the AI-created task details here
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Draft Preview</CardTitle>
        <CardDescription>Review the AI-generated task draft before submitting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Task Title</h3>
          <p className="text-base font-medium">{taskDraft.title}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Task Description</h3>
          <div className="text-sm whitespace-pre-wrap rounded-md bg-muted p-4">
            {taskDraft.description}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Submit Task Draft
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
