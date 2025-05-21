"use client"

import { useEffect, useState } from "react"

import { List, Loader2, Plus, Save, Send } from "lucide-react"

import { env } from "@/env/client"

type IChangeEvent = React.ChangeEvent<HTMLInputElement>
type IFormEvent =
  | React.FormEvent<HTMLFormElement>
  | React.MouseEvent<HTMLButtonElement>
  | React.KeyboardEvent<HTMLInputElement>

type TTask = {
  id: string
  title: string
  description: string
  userRequestDescription: string
  submissionDate: string
}

type TMessage = {
  id: number
  type: string
  text: string
  hasDraft?: boolean
}

export default function TaskManager() {
  const [userRequest, setUserRequest] = useState("")
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<TTask[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const [draftTask, setDraftTask] = useState<any>(null)
  const [messages, setMessages] = useState<TMessage[]>([
    {
      id: 1,
      type: "system",
      text: "Welcome to 5s3s Task Manager! Describe your task, and I'll help you create it."
    }
  ])

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Handle input change
  const handleInputChange = (e: IChangeEvent) => {
    setUserRequest(e.target.value)
  }

  // Handle message submit
  const handleSubmit = async (e: IFormEvent) => {
    e.preventDefault()
    if (!userRequest.trim()) return

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      type: "user",
      text: userRequest
    }
    setMessages([...messages, newMessage])

    // Clear input
    setUserRequest("")

    // Generate response
    setLoading(true)
    await generateDraft(newMessage.text)
    setLoading(false)
  }

  // Generate task draft using OpenAI's GPT API
  const generateDraft = async (prompt: string) => {
    setLoading(true)

    try {
      // Prepare the OpenAI API request
      const systemPrompt = `You are a helpful task management assistant. 
      Given a user's task request, generate a concise task title and a detailed task description.
      Format your response as a JSON object with the following structure:
      {
        "title": "Concise task title",
        "description": "Detailed task description with action items and specifics"
      }`

      const userPrompt = `Generate a task title and description based on this request: "${prompt}"`

      // API call configuration
      const apiUrl = "https://api.openai.com/v1/chat/completions"
      const apiKey = env.NEXT_PUBLIC_OPENAI_API_KEY // Replace with your actual API key or use environment variables

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // You can use gpt-4 or other models
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      }

      // Make the API call
      let response
      try {
        // For the demo or development environment, we'll simulate the API call
        // In production, uncomment the fetch code below

        // Simulated API response for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock response based on keywords for demonstration
        const keywords = prompt.toLowerCase().split(" ")
        let mockResponse = {}

        if (keywords.includes("website") || keywords.includes("web")) {
          mockResponse = {
            title: "Website Development Project",
            description:
              "Create a responsive website with modern design principles. Include home, about, services, and contact pages. Ensure cross-browser compatibility and optimize for mobile devices. Implement SEO best practices and integrate analytics tracking."
          }
        } else if (keywords.includes("app") || keywords.includes("application")) {
          mockResponse = {
            title: "Mobile Application Development",
            description:
              "Develop a cross-platform mobile application with React Native. Create user authentication, profile management, and core functionality screens. Implement offline capabilities and push notifications. Ensure performance optimization and thorough testing across devices."
          }
        } else if (keywords.includes("report") || keywords.includes("document")) {
          mockResponse = {
            title: "Quarterly Business Report",
            description:
              "Prepare comprehensive quarterly business report analyzing key performance indicators. Include executive summary, financial analysis, market trends, and strategic recommendations. Create visual data representations and actionable insights for stakeholders."
          }
        } else if (keywords.includes("meeting") || keywords.includes("conference")) {
          mockResponse = {
            title: "Team Strategy Meeting",
            description:
              "Organize a team strategy meeting to align on quarterly objectives. Prepare agenda including project updates, resource allocation, and upcoming priorities. Create presentation materials and distribute meeting notes afterward with action items."
          }
        } else {
          mockResponse = {
            title: `Task: ${prompt.split(" ").slice(0, 3).join(" ")}`,
            description: `Complete the following task based on the provided description: ${prompt}. Ensure all requirements are met and deliver within the specified timeframe.`
          }
        }

        response = mockResponse

        // Uncomment for actual API integration:
        const fetchResponse = await fetch(apiUrl, requestOptions)
        if (!fetchResponse.ok) {
          throw new Error(`API call failed: ${fetchResponse.status}`)
        }
        const data = await fetchResponse.json()
        response = JSON.parse(data.choices[0].message.content)
      } catch (error) {
        console.error("API call error:", error)
        // Fallback in case of API error
        response = {
          title: `Task: ${prompt.split(" ").slice(0, 3).join(" ")}`,
          description: `Complete this task based on the description: ${prompt}`
        }
      }

      // Create draft task
      const draft = {
        title: response.title,
        description: response.description,
        userRequestTitle: `${prompt.split(" ").slice(0, 5).join(" ")}...`,
        userRequestDescription: prompt
      }

      // Set draft task
      setDraftTask(draft)

      // Add AI response message
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        text: `I've generated a task draft for you:\n\n**Title:** ${draft.title}\n\n**Description:** ${draft.description}`,
        hasDraft: true
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error generating draft:", error)
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        type: "system",
        text: "Sorry, there was an error generating your task draft. Please try again."
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Handle submit draft
  const handleSubmitDraft = async () => {
    if (!draftTask) return

    // Generate ID and date
    const newTask = {
      ...draftTask,
      id: Date.now().toString(),
      submissionDate: new Date().toISOString()
    }

    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add to tasks
    setTasks((prev) => [newTask, ...prev])

    // Add confirmation message
    const confirmationMessage = {
      id: messages.length + 1,
      type: "system",
      text: "Task has been submitted successfully!"
    }
    setMessages((prev) => [...prev, confirmationMessage])

    // Clear draft
    setDraftTask(null)
    setLoading(false)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">5s3s Task Manager</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto flex">
          <button
            type="button"
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === "chat" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("chat")}
          >
            <Plus size={18} />
            Create Task
          </button>
          <button
            type="button"
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === "dashboard" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("dashboard")}
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

      {/* Main Content */}
      <main className="flex-1 overflow-hidden container mx-auto p-4 flex">
        {activeTab === "chat" ? (
          <div className="w-full h-full flex flex-col bg-white rounded-lg shadow">
            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${message.type === "user" ? "text-right" : ""}`}
                >
                  <div
                    className={`inline-block max-w-lg rounded-lg px-4 py-2 ${
                      message.type === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : message.type === "system"
                          ? "bg-gray-200 text-gray-800 rounded-tl-none"
                          : "bg-white border border-gray-300 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>

                    {message.hasDraft && draftTask && (
                      <div className="mt-4">
                        <button
                          type="button"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 mt-2"
                          onClick={handleSubmitDraft}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <Save size={16} />
                          )}
                          Submit Task Draft
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && !draftTask && (
                <div className="flex justify-center items-center p-4">
                  <Loader2
                    size={24}
                    className="animate-spin text-indigo-600"
                  />
                </div>
              )}
            </div>

            {/* Input form */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userRequest}
                  onChange={handleInputChange}
                  placeholder="Describe your task here..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
          <div className="w-full h-full flex flex-col bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Task Dashboard</h2>
              <p className="text-gray-600 text-sm">View all your submitted tasks</p>
            </div>

            <div className="flex-1 overflow-auto">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <List
                      size={32}
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
                  <p className="text-gray-600 mt-1">
                    Start by creating a new task using the AI assistant.
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    onClick={() => setActiveTab("chat")}
                  >
                    Create a Task
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Request
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submission Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr
                          key={task.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.id.substring(task.id.length - 4)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {task.description}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {task.userRequestDescription}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(task.submissionDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Feature Summary */}
      <footer className="bg-white shadow-md mt-auto">
        <div className="container mx-auto p-4">
          <details className="text-sm text-gray-600">
            <summary className="font-medium text-indigo-600 cursor-pointer">
              Feature Summary & Usage Instructions
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Implemented Features:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Interactive chat interface for task creation</li>
                <li>AI-powered task draft generation</li>
                <li>Task preview and submission functionality</li>
                <li>Dashboard to view submitted tasks</li>
                <li>Local storage persistence</li>
                <li>Clean UI with responsive design</li>
              </ul>

              <h3 className="font-bold mt-4 mb-2">How to Use:</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Enter your task request in the chat input field</li>
                <li>The AI will generate a draft with title and description</li>
                <li>Review the draft and click "Submit Task Draft" to save it</li>
                <li>Switch to the Dashboard tab to view all submitted tasks</li>
              </ol>
            </div>
          </details>
        </div>
      </footer>
    </div>
  )
}
