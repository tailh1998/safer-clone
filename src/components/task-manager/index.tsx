"use client"

import { useEffect, useState } from "react"

import { cloneDeep } from "lodash"
import { List, Loader2, Plus, Send } from "lucide-react"

import Dashboard from "./components/dashboard"
import FeatureSummary from "./components/feature-summary"
import Messages from "./components/messages"
import { DEFAULT_MESSAGES, TABS } from "./constants"
import useTaskGeneration from "./hooks/use-task-generation"
import { generateNewTask, getErrorChatMessage } from "./shares"
import { IChangeEvent, IFormEvent, TMessage, TTabs, TTask } from "./types"

const TaskManager = () => {
  const [userRequest, setUserRequest] = useState("")
  const [tasks, setTasks] = useState<TTask[]>([])
  const [activeTab, setActiveTab] = useState<TTabs>(TABS.CHAT)
  const [messages, setMessages] = useState<TMessage[]>(DEFAULT_MESSAGES)
  const [submitLoading, setSubmitLoading] = useState(false)

  const { loading, generateTask: generateTaskDraft } = useTaskGeneration()

  const handleInputChange = (e: IChangeEvent) => {
    setUserRequest(e.target.value)
  }

  const handleSubmit = async (e: IFormEvent) => {
    e.preventDefault()
    if (!userRequest.trim()) return

    const newMessage = {
      id: Date.now(),
      type: "user",
      text: userRequest
    }
    setMessages([...messages, newMessage])

    const currentRequest = userRequest
    setUserRequest("")

    const result = await generateTaskDraft(currentRequest)

    if (result.success && result.draft) {
      const aiResponse = {
        id: Date.now(),
        type: "ai",
        text: `I've generated a task draft for you:\n\n**Title:** ${result.draft.title}\n\n**Description:** ${result.draft.description}`,
        hasDraft: true,
        draft: result.draft
      }

      setMessages((prev) => [...prev, aiResponse])
    } else {
      const errorMessage = getErrorChatMessage(
        "Sorry, there was an error generating your task draft. Please try again."
      )

      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleSubmitDraft = async (message: TMessage) => {
    if (!message.draft) return
    const newTask = generateNewTask(message.draft)
    setSubmitLoading(true)

    try {
      // eslint-disable-next-line n/no-process-env
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("[DEV] Simulating API POST:", {
          taskTitle: newTask.title,
          taskDescription: newTask.description,
          userRequestTitle: newTask.userRequestTitle,
          userRequestDescription: newTask.userRequestDescription,
          submissionDate: newTask.submissionDate
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTasks((prev) => [newTask, ...prev])

      const id = `#${newTask.id.substring(newTask.id.length - 4)}`
      const confirmationMessage = {
        id: Date.now(),
        type: "system",
        text: `Task **${id}** has been submitted successfully!`
      }

      const clonedMessages = cloneDeep(messages)
      const currentIdx = clonedMessages.findIndex((msg) => msg.id === message.id)
      clonedMessages[currentIdx].hasDraft = false

      setMessages([...clonedMessages, confirmationMessage])
    } catch (error) {
      console.error("Error submitting task:", error)
      const errorMessage = getErrorChatMessage("Error submitting task. Please try again.")

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">5s3s Task Manager</h1>
        </div>
      </div>

      <nav className="bg-white shadow">
        <div className="container mx-auto flex">
          <button
            type="button"
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === TABS.CHAT ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}
            onClick={() => setActiveTab(TABS.CHAT)}
          >
            <Plus size={18} />
            Create Task
          </button>
          <button
            type="button"
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === TABS.DASHBOARD ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}
            onClick={() => setActiveTab(TABS.DASHBOARD)}
          >
            <List size={18} />
            Dashboard
            {tasks.length > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1">
                {tasks.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="flex-1 overflow-hidden container mx-auto p-4 flex">
        {activeTab === "chat" ? (
          <div className="w-full h-full flex flex-col bg-white rounded-lg shadow">
            <div className="flex-1 p-4 overflow-y-auto">
              <Messages
                messages={messages}
                loading={loading}
                submitLoading={submitLoading}
                handleSubmitDraft={handleSubmitDraft}
              />
            </div>

            {/* Form */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userRequest}
                  onChange={handleInputChange}
                  placeholder="Describe your task here..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 w-10 h-10 flex items-center justify-center"
                  disabled={loading || !userRequest.trim()}
                >
                  {loading ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <Dashboard
            tasks={tasks}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      <FeatureSummary />
    </div>
  )
}

export default TaskManager
