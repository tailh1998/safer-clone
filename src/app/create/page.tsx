"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Loader2, Send } from "lucide-react"

import { TaskDraftPreview } from "@/components/task-draft-preview"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

import { useToast } from "@/hooks/use-toast"

import { generateTaskDraft } from "@/lib/ai-service"
import { saveTask } from "@/lib/task-service"

export default function CreateTaskPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userRequest, setUserRequest] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taskDraft, setTaskDraft] = useState<{
    title: string
    description: string
  } | null>(null)

  const handleGenerateDraft = async () => {
    if (!userRequest.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a task request to generate a draft.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const draft = await generateTaskDraft(userRequest)
      setTaskDraft(draft)
      toast({
        title: "Draft generated",
        description: "Your task draft has been generated successfully."
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate task draft. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitTask = async () => {
    if (!taskDraft) return

    setIsSubmitting(true)
    try {
      await saveTask({
        id: Date.now().toString(),
        title: taskDraft.title,
        description: taskDraft.description,
        userRequestTitle: userRequest.split("\n")[0] || "Untitled Request",
        userRequestDescription: userRequest,
        submissionDate: new Date().toISOString()
      })

      toast({
        title: "Task submitted",
        description: "Your task has been saved successfully."
      })

      setUserRequest("")
      setTaskDraft(null)
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Failed to submit task. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Task Request</CardTitle>
              <CardDescription>
                Describe your task and let AI generate a detailed draft for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your task here... (e.g., 'Create a weekly team meeting agenda template')"
                  className="min-h-[200px]"
                  value={userRequest}
                  onChange={(e) => setUserRequest(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGenerateDraft}
                disabled={isGenerating || !userRequest.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Draft
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <TaskDraftPreview
            taskDraft={taskDraft}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitTask}
          />
        </div>
      </div>
    </div>
  )
}
