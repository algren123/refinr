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

const vibeHandler = (vibe: string): string => {
  return vibe === 'Funny'
    ? 'The biography should contain humor and be slightly ridiculous.'
    : vibe === 'Business'
    ? 'The biography is for a business, and should be marketable and engagin'
    : 'The biography should be professional and engaging.';
};

export async function POST(req: Request) {
  const { vibe, bio } = await req.json();
  await kv.incr('biocounter');
  const newCounterValue = await kv.get('biocounter');
  console.log('Incremented to :', newCounterValue); // Log the new counter value

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `I am a Instagram user that is trying to create their new bio using the following biography: "${bio}" 
        Based on this, generate two ${vibe.toLowerCase()} biographies (bios) that directly relate to the biography provided. ${vibeHandler(
          vibe
        )}. Ensure each biography is concise and under 250 characters and is formatted.
        If you can't come up with anything say you need them to try again, do not make up a person. Feel free to use emojis.
        `,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
