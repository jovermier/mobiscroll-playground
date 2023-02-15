import { createContext, useState, memo, useMemo, ReactNode } from 'react';

import { eventType1Data } from 'calendar/data-mocks';
import { EventType1 } from 'calendar/data-types';

export type EventType1Api = [
  EventType1[],
  {
    addEvent: (event: EventType1) => void;
    updateEvent: (event: EventType1) => void;
    deleteEvent: (eventId: string) => void;
  },
];

const defaultApi: EventType1Api = [
  [],
  { addEvent: () => null, updateEvent: () => null, deleteEvent: () => null },
];

export const EventType1Context = createContext<EventType1Api>(defaultApi);

interface ProviderProps {
  children: ReactNode;
}

export const EventType1Provider = memo(({ children }: ProviderProps) => {
  const [data, setData] = useState<EventType1[]>(eventType1Data);

  const addEvent = (event: EventType1) => {
    setData((prev) => [...prev, event]);
  };

  const updateEvent = (event: EventType1) => {
    setData((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  };

  const deleteEvent = (eventId: string) => {
    setData((prev) => prev.filter((e) => e.id !== eventId));
  };

  const value = useMemo<EventType1Api>(
    () => [data, { addEvent, updateEvent, deleteEvent }],
    [data],
  );

  return <EventType1Context.Provider value={value}>{children}</EventType1Context.Provider>;
});

EventType1Provider.displayName = 'EventType1Provider';

export default EventType1Provider;
