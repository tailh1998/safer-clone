import { TDraftTask } from "./types"

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export const generateNewTask = (draft: TDraftTask) => {
  const newTask = {
    ...draft,
    title: draft.title,
    id: Date.now().toString(),
    description: draft.description,
    submissionDate: new Date().toISOString(),
    userRequestDescription: draft.userRequestDescription
  }

  return newTask
}

export const getErrorChatMessage = (txt?: string) => {
  const errorMessage = {
    id: Date.now(),
    type: "system",
    text: txt || "Sorry, there was an error. Please try again."
  }

  return errorMessage
}
