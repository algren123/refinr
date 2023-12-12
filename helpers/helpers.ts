import { MutableRefObject } from 'react';
import { TTicket } from '@/app/page';

export const scrollToRefinement = (
  refinementRef: MutableRefObject<HTMLDivElement | null>
) => {
  if (refinementRef.current !== null) {
    refinementRef.current.scrollIntoView({ behavior: 'smooth' });
  }
};

export const disableSubmit = (ticket: TTicket) =>
  ticket.title === '' ||
  ticket.industry === '' ||
  ticket.description === '' ||
  ticket.context === '';

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
