import { MbscCalendarEvent } from '@mobiscroll/react';

export type EventType1 = MbscCalendarEvent & {
  __typename: 'eventType1';
  id: string;
  description?: string;
  free: boolean;
};

export type EventType2 = MbscCalendarEvent & {
  __typename: 'eventType2';
  id: string;
  notes?: string;
  free: boolean;
};
