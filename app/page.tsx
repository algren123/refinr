'use client';
import { useRef, useReducer, useCallback } from 'react';
import Image from 'next/image';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { Toaster, toast } from 'react-hot-toast';
import remarkGfm from 'remark-gfm';
import useRefinementCounter from '@/hooks/useRefinementCounter';
import ticketReducer from '@/reducers/ticketReducer';
import Footer from '@/components/Footer';
import DropDown from '@/components/DropDown';
import { disableSubmit, scrollToRefinement } from '@/helpers/helpers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export type TTicket = {
  industry: string;
  title: string;
  description: string;
  context: string;
  storyPoints: number;
};

export default function Page() {
  const [ticket, dispatch] = useReducer(ticketReducer, {
    industry: '',
    title: '',
    description: '',
    context: '',
    storyPoints: 0,
  });
  const { refinementCounter, fetchUpdatedCounter } = useRefinementCounter();
  const refinementRef = useRef<null | HTMLDivElement>(null);

  const { handleInputChange, handleSubmit, isLoading, messages } = useChat({
    body: {
      title: ticket.title,
      industry: ticket.industry,
      description: ticket.description,
      context: ticket.context,
      storyPoints: ticket.storyPoints,
    },
    onResponse() {
      scrollToRefinement(refinementRef);
      fetchUpdatedCounter();
    },
  });

  const updateDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch({
        type: 'UPDATE_DESCRIPTION',
        payload: e.target.value,
      });
      handleInputChange(e);
    },
    [handleInputChange]
  );

  const lastMessage = messages[messages.length - 1];
  const generatedRefinement =
    lastMessage?.role === 'assistant' ? lastMessage.content : null;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mt-4">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Refinr.
          <br />
          <br />
          Let AI tackle your ticket refinement
        </h1>
        <p className="flex align-middle text-slate-500 mt-5">
          {refinementCounter || (
            <span className="loading mr-1">
              <span style={{ backgroundColor: 'black' }} />
              <span style={{ backgroundColor: 'black' }} />
              <span style={{ backgroundColor: 'black' }} />
            </span>
          )}{' '}
          tickets have been refined so far
        </p>
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 mt-5 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/algren123/refinr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <p>Star on GitHub</p>
        </a>
        <form className="max-w-xl w-full" onSubmit={handleSubmit}>
          <div className="flex mt-5 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={45}
              height={45}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              What is the company&apos;s industry?
            </p>
          </div>
          <input
            type="text"
            value={ticket.industry}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_INDUSTRY', payload: e.target.value })
            }
            className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-black my-5 p-2"
            placeholder="e.g. Digital Entertainment"
          />
          <div className="flex mt-5 items-center space-x-3">
            <Image
              src="/2-black.png"
              width={45}
              height={45}
              alt="2 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              What is the title of the ticket?
            </p>
          </div>
          <input
            type="text"
            value={ticket.title}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_TITLE', payload: e.target.value })
            }
            className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-black my-5 p-2"
            placeholder={
              'e.g. Update the "About Us" section with social medias and contact details'
            }
          />
          <div className="flex mt-5 items-center space-x-3">
            <Image
              src="/3-black.png"
              width={45}
              height={45}
              alt="3 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              What is the description of the ticket?
            </p>
          </div>
          <textarea
            value={ticket.description}
            onChange={(e) => updateDescription(e)}
            rows={3}
            className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-black my-5 p-2"
            placeholder={
              'e.g. The Instagram, X and LinkedIn links are missing from the "About Us" section. They need to be added and the contact details need to be updated.'
            }
          />
          <div className="flex mt-5 items-center space-x-3">
            <Image
              src="/4-black.png"
              width={45}
              height={45}
              alt="4 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              What is the context of the ticket?
            </p>
          </div>
          <textarea
            rows={3}
            value={ticket.context}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_CONTEXT', payload: e.target.value })
            }
            className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-black my-5 p-2"
            placeholder={
              'e.g. This is part of the social revamp of the website after the new acquisition of the company.'
            }
          />
          <div className="flex my-5 items-center space-x-3">
            <Image
              src="/5-black.png"
              width={45}
              height={45}
              alt="5 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              How many story points should the ticket have? Select 0 if you want
              AI to suggest a number.
            </p>
          </div>
          <DropDown storyPoint={ticket.storyPoints} dispatch={dispatch} />

          {!isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit"
              disabled={disableSubmit(ticket) || isLoading} // Disable the button if input is empty or while loading
            >
              Refine your ticket →
            </button>
          )}
          {isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
              </span>
            </button>
          )}
        </form>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <output className="space-y-10 my-10">
          {generatedRefinement && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={refinementRef}
                >
                  Here is your refinement
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedRefinement);
                    toast('Refinement copied to clipboard', {
                      icon: '✂️',
                    });
                  }}
                  key={generatedRefinement}
                >
                  <ReactMarkdown
                    className="prose prose-neutral prose-p:leading-relaxed break-words"
                    remarkPlugins={[remarkGfm]}
                  >
                    {generatedRefinement}
                  </ReactMarkdown>
                </div>
              </div>
            </>
          )}
        </output>
      </main>
      <Footer />
    </div>
  );
}
