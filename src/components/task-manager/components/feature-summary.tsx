const FeatureSummary = () => {
  return (
    <div className="bg-white shadow-md mt-auto">
      <div className="container mx-auto p-4">
        <details className="text-sm text-gray-600">
          <summary className="font-medium text-indigo-600 cursor-pointer">
            Feature Summary & Usage Instructions
          </summary>
          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2">Implemented Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive chat interface for task creation</li>
              <li>AI-powered task draft generation using Gemini API</li>
              <li>Task preview and submission functionality</li>
              <li>Dashboard to view submitted tasks</li>
              <li>Local storage persistence</li>
              <li>Clean UI with responsive design</li>
              <li>Proper error handling and loading states</li>
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
    </div>
  )
}

export default FeatureSummary
