import { useCallback, useState } from "react"

import { env } from "@/env/client"

const useTaskGeneration = () => {
  const [loading, setLoading] = useState(false)

  const generateTask = useCallback(async (prompt: string) => {
    setLoading(true)

    try {
      // Replace with your actual API key or use environment variable
      const apiKey = env.NEXT_PUBLIC_GEMINI_API_KEY
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a structured task management AI. Your job is to generate a concise task title and a brief task description based on a user's request.

STRICTLY follow this output format:

{
  "title": "Concise and relevant task title",
  "description": "Brief task explanation (2-3 sentences maximum). Focus on the main objective and key requirements."
}

IMPORTANT:
- ONLY return pure JSON in your response.
- DO NOT include code block syntax or markdown formatting.
- DO NOT add any extra explanations, comments, or introductory text—just return the JSON object.
- Keep the description SHORT and CONCISE (maximum 2-3 sentences).
- Do NOT include sub-tasks, actionable steps, or detailed breakdowns.

Generate a task title and description based on this request: "${prompt}"`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Gemini API call failed: ${response.statusText}`)
      }

      const data = await response.json()
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!textResponse) {
        throw new Error("No response text found")
      }

      // Try to parse the response as JSON directly first
      let parsed
      try {
        parsed = JSON.parse(textResponse)
      } catch {
        // If direct parsing fails, try to extract JSON from code blocks
        const jsonMatch =
          textResponse.match(/```json\n([\s\S]+?)\n```/) ||
          textResponse.match(/```\n([\s\S]+?)\n```/) ||
          textResponse.match(/\{[\s\S]*\}/)

        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])
        } else {
          throw new Error("Could not extract valid JSON from response")
        }
      }

      if (!parsed.title || !parsed.description) {
        throw new Error("Response missing required fields (title or description)")
      }

      const draft = {
        title: parsed.title,
        description: parsed.description,
        userRequestTitle: `${prompt.split(" ").slice(0, 5).join(" ")}...`,
        userRequestDescription: prompt
      }

      setLoading(false)
      return { success: true, draft }
    } catch (error) {
      console.error("Error generating draft:", error)
      setLoading(false)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }
    }
  }, [])

  return {
    loading,
    generateTask
  }
}

export default useTaskGeneration
