"use client"

import { useState } from "react"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import type { Task } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface TaskTableProps {
  tasks: Task[]
  isLoading: boolean
}

export function TaskTable({ tasks, isLoading }: TaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Task ID</TableHead>
                <TableHead>Task Title</TableHead>
                <TableHead className="hidden md:table-cell">User Request</TableHead>
                <TableHead className="hidden lg:table-cell">Submission Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.id.slice(-4)}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{task.userRequestTitle}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(task.submissionDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTask(task)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogDescription>
                  Task ID: {selectedTask.id.slice(-4)} • Created:{" "}
                  {formatDate(selectedTask.submissionDate)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Original Request
                  </h3>
                  <div className="text-sm whitespace-pre-wrap rounded-md bg-muted p-4">
                    <p className="font-medium mb-2">{selectedTask.userRequestTitle}</p>
                    {selectedTask.userRequestTitle.trim() !==
                      selectedTask.userRequestDescription.trim() &&
                      selectedTask.userRequestDescription}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Task Description
                  </h3>
                  <div className="text-sm whitespace-pre-wrap rounded-md bg-muted p-4">
                    {selectedTask.description}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
