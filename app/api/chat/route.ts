import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { kv } from '@vercel/kv';

// Create an OpenAI API client
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { industry, title, description, context, storyPoints } =
    await req.json();

  console.log(industry, title, description, context, storyPoints);
  await kv.incr('refinements');
  const newCounterValue = await kv.get('refinements');
  console.log('Incremented to :', newCounterValue); // Log the new counter value

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-4-1106-preview',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `I want you to act as a Business Analyst and help me refine a ticket. I will provide you with the industry that my team is part of, the title of the ticket, a description of what the ticket is and should do, and a context of the wider scope.
        . The industry that my team is a part of, is: ${industry}. The title of the ticket is ${title}, the description is ${description}, the context is ${context}.
        ${
          storyPoints
            ? `The story points are ${storyPoints}.`
            : 'Please give it a story point value that falls in the fibonacci sequence.'
        }
        Use rows titled: Title, Story Points, Description, Context, Acceptance Criteria. Make the titles bold and underlined and the text should be on a new line break. Please fit the content in less than 250 words.
        If you can't come up with anything say you need them to try again, do not make up a ticket. Ensure that all relevant information is included and that the language is clear and concise.
        Do not attempt to continue the conversation. Do not do an introduction, go straight into the template.
        `,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
