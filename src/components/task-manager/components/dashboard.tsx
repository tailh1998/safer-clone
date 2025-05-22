import { Dispatch, SetStateAction } from "react"

import { List } from "lucide-react"

import { TABS } from "../constants"
import { formatDate } from "../shares"
import { TTabs, TTask } from "../types"

type DashboardProps = {
  tasks: TTask[]
  setActiveTab: Dispatch<SetStateAction<TTabs>>
}

const Dashboard = (props: DashboardProps) => {
  const { tasks, setActiveTab } = props

  return (
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
              onClick={() => setActiveTab(TABS.CHAT)}
            >
              Create a Task
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-full">
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
                    User Request Prompt
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
                      #{task.id.substring(task.id.length - 4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    </td>
                    <td className="px-6 py-4 relative group max-w-xs">
                      <div className="text-sm text-gray-500 truncate cursor-pointer">
                        {task.description}
                      </div>
                      <div className="absolute z-10 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 w-64 whitespace-normal left-1/2 -translate-x-1/2 top-full mt-1 shadow-lg">
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
  )
}

export default Dashboard
