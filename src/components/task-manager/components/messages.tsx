import { Loader2, Save } from "lucide-react"

import BoldText from "../bold-text"
import { TMessage } from "../types"

type TMessagesProps = {
  messages: TMessage[]
  submitLoading: boolean
  loading: boolean
  handleSubmitDraft: (message: TMessage) => void
}

const Messages = (props: TMessagesProps) => {
  const { messages, loading, submitLoading, handleSubmitDraft } = props

  return (
    <>
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
            <p className="whitespace-pre-wrap">
              <BoldText text={message.text} />
            </p>
            {message.hasDraft && (
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 mt-2"
                  onClick={() => handleSubmitDraft(message)}
                  disabled={submitLoading}
                >
                  {submitLoading ? (
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
            {!message.hasDraft && message.draft && (
              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100 mt-4">
                <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                Submitted
              </span>
            )}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <Loader2
            size={24}
            className="animate-spin text-indigo-600"
          />
        </div>
      )}
    </>
  )
}

export default Messages
