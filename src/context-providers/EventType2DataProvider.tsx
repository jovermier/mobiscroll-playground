import { createContext, useState, memo, useMemo, ReactNode } from 'react';

import { eventType2Data } from './data-mocks';
import { EventType2 } from '../data-types';

export type EventType2Api = [
  EventType2[],
  {
    addEvent: (event: EventType2) => void;
    updateEvent: (event: EventType2) => void;
    deleteEvent: (eventId: string) => void;
  },
];

const defaultApi: EventType2Api = [
  [],
  { addEvent: () => null, updateEvent: () => null, deleteEvent: () => null },
];

export const EventType2Context = createContext<EventType2Api>(defaultApi);

interface ProviderProps {
  children: ReactNode;
}

export const EventType2Provider = memo(({ children }: ProviderProps) => {
  const [data, setData] = useState<EventType2[]>(eventType2Data);

  const addEvent = (event: EventType2) => {
    setData((prev) => [...prev, event]);
  };

  const updateEvent = (event: EventType2) => {
    setData((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  };

  const deleteEvent = (eventId: string) => {
    setData((prev) => prev.filter((e) => e.id !== eventId));
  };

  const value = useMemo<EventType2Api>(
    () => [data, { addEvent, updateEvent, deleteEvent }],
    [data],
  );

  return <EventType2Context.Provider value={value}>{children}</EventType2Context.Provider>;
});

EventType2Provider.displayName = 'EventType2Provider';

export default EventType2Provider;
