import { TTicket } from '@/app/page';

export type TicketAction =
  | { type: 'UPDATE_INDUSTRY'; payload: string }
  | { type: 'UPDATE_TITLE'; payload: string }
  | { type: 'UPDATE_DESCRIPTION'; payload: string }
  | { type: 'UPDATE_CONTEXT'; payload: string }
  | { type: 'UPDATE_STORY_POINTS'; payload: number };

const ticketReducer = (state: TTicket, action: TicketAction): TTicket => {
  switch (action.type) {
    case 'UPDATE_INDUSTRY':
      return { ...state, industry: action.payload };
    case 'UPDATE_TITLE':
      return { ...state, title: action.payload };
    case 'UPDATE_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'UPDATE_CONTEXT':
      return { ...state, context: action.payload };
    case 'UPDATE_STORY_POINTS':
      return { ...state, storyPoints: action.payload };
    default:
      return state;
  }
};

export default ticketReducer;
