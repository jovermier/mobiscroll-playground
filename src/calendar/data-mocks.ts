import { format } from 'date-fns';

import { EventType1, EventType2 } from './data-types';

const todayString = format(new Date(), 'yyyy-MM-dd');
const tomorrowString = format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');

export const eventType1Data: EventType1[] = [
  {
    __typename: 'eventType1' as const,
    id: '1',
    start: new Date(`${todayString}T13:00`),
    end: new Date(`${todayString}T13:45`),
    title: "Lunch @ Butcher's",
    description: '',
    allDay: false,
    free: true,
    color: '#009788',
    createdAt: new Date(`${todayString}T13:00`),
  },
  {
    __typename: 'eventType1' as const,
    id: '4',
    start: new Date(`${tomorrowString}T10:30`),
    end: new Date(`${tomorrowString}T11:30`),
    title: 'Stakeholder mtg.',
    description: '',
    allDay: false,
    free: false,
    color: '#f44437',
    createdAt: new Date(`${tomorrowString}T10:30`),
  },
];

export const eventType2Data: EventType2[] = [
  {
    __typename: 'eventType2' as const,
    id: '2',
    start: new Date(`${todayString}T15:00`),
    end: new Date(`${todayString}T16:00`),
    title: 'General orientation',
    description: '',
    allDay: false,
    free: false,
    color: '#ff9900',
    createdAt: new Date(`${todayString}T15:00`),
  },
  {
    __typename: 'eventType2' as const,
    id: '3',
    start: new Date(`${todayString}T18:00`),
    end: new Date(`${todayString}T22:00`),
    title: 'Dexter BD',
    description: '',
    allDay: false,
    free: true,
    color: '#3f51b5',
    createdAt: new Date(`${todayString}T18:00`),
  },
];
