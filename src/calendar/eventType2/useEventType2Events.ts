import { useCallback, useMemo } from 'react';
import { MbscCalendarEvent } from '@mobiscroll/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { mobiDateToDate } from 'utils/date';
import { EventType2 } from '../../data-types';

export type EventType2Form = {
  __typename: 'eventType2';
  id: string;
  createdAt?: Date;
  title?: string;
  notes?: string;
  start?: Date | null;
  end?: Date | null;
  allDay: boolean;
  status: string;
  color: string;
};

const formSchema = z.object({
  id: z.string().min(1),
  createdAt: z.date().optional(),
  title: z.string().trim().min(1),
  notes: z.string().trim().optional(),
  start: z.date(),
  end: z.date(),
  allDay: z.boolean(),
  status: z.string(),
  color: z.string(),
});

const formToEvent = (form: EventType2Form): EventType2 => {
  return {
    __typename: 'eventType2',
    id: form.id,
    title: form.title,
    notes: form.notes,
    start: form.start ?? undefined,
    end: form.end ?? undefined,
    allDay: form.allDay,
    free: form.status === 'free',
    color: form.color,
    createdAt: form.createdAt,
  };
};

export const useEventType2Events = ({ events: eventsInput }: { events: EventType2[] }) => {
  const form = useForm<EventType2Form>({ resolver: zodResolver(formSchema) });

  const formEvent = form.watch();

  const loadForm = useCallback(
    (event?: EventType2 | MbscCalendarEvent) => {
      form.reset({
        __typename: 'eventType2',
        id: event?.id?.toString() || '',
        title: event?.title,
        notes: event?.notes,
        start: mobiDateToDate(event?.start),
        end: mobiDateToDate(event?.end),
        allDay: event?.allDay ?? false,
        status: event?.free === true ? 'free' : 'busy',
        color: event?.color,
        createdAt: event?.createdAt,
      });
    },
    [form],
  );

  const events = useMemo(
    () =>
      formEvent.id?.length > 0
        ? [...eventsInput.filter((e) => e.id !== formEvent.id), formToEvent(formEvent)]
        : [...eventsInput],
    [eventsInput, formEvent],
  );

  return {
    events,
    form,
    loadForm,
  };
};
