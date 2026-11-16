import { type NextRequest, NextResponse } from 'next/server'

interface GroqMessage {
  role: 'user' | 'assistant'
  content: string
}

interface GroqRequestBody {
  model: string
  messages: GroqMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
}

interface GroqUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

interface GroqChoice {
  message: {
    role: string
    content: string
  }
  finish_reason: string
  index: number
}

interface GroqResponse {
  id: string
  object: string
  created: number
  model: string
  choices: GroqChoice[]
  usage: GroqUsage
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as { messages: GroqMessage[] }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 },
      )
    }

    const requestBody: GroqRequestBody = {
      model: 'qwen/qwen3.8-27b',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `Groq API error: ${error}` },
        { status: response.status },
      )
    }

    const data = (await response.json()) as GroqResponse

    return NextResponse.json({
      message: data.choices[0].message.content,
      model: data.model,
      usage: {
        prompt_tokens: data.usage.prompt_tokens,
        completion_tokens: data.usage.completion_tokens,
        total_tokens: data.usage.total_tokens,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to call Groq API: ${message}` },
      { status: 500 },
    )
  }
}
