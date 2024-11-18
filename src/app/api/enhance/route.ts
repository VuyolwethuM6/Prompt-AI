import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { prompt } = await req.json()
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 })
    }

    // Call OpenAI to enhance the prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert at enhancing prompts to get better results from AI models. 
          Your task is to improve the given prompt by:
          1. Making it more specific and detailed
          2. Adding relevant context
          3. Improving clarity and structure
          4. Including any necessary constraints or preferences
          5. Optimizing it for the intended AI model's capabilities`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const enhancedPrompt = completion.choices[0].message.content

    // Save to database
    const savedPrompt = await prisma.prompt.create({
      data: {
        originalText: prompt,
        enhancedText: enhancedPrompt || "",
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      prompt: savedPrompt,
      message: "Prompt enhanced successfully",
    })
  } catch (error) {
    console.error("[PROMPT_ENHANCEMENT_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
