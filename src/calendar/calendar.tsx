import {
  Eventcalendar,
  setOptions,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscEventCreatedEvent,
  MbscSelectedDateChangeEvent,
  MbscEventClickEvent,
  MbscEventUpdateEvent,
  MbscEventDragEvent,
} from '@mobiscroll/react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { compact } from 'lodash';

import { EventType1Context } from 'context-providers/EventType1DataProvider';
import { EventType2Context } from 'context-providers/EventType2DataProvider';
import { mobiDateToDate } from 'utils/date';
import { EventType1, EventType2 } from './data-types';
import { EventPickerPopup, EventTypeOption } from './components/EventTypePopup';
import { EventType1Popup, useEventType1Events } from './eventType1';
import { EventType2Popup, useEventType2Events } from './eventType2';

import './calendar.css';

setOptions({
  theme: 'ios',
  themeVariant: 'light',
});

const viewSettings: MbscEventcalendarView = {
  schedule: { type: 'week' },
};

const eventTypeOptions = ['eventType1', 'eventType2'] as const;
type EventType = (typeof eventTypeOptions)[number];

const eventTypes = [
  {
    id: 'eventType1' as EventType,
    title: 'Event Type 1',
    description: '',
  },
  {
    id: 'eventType2' as EventType,
    title: 'Event Type 2',
    description: '',
  },
] as EventTypeOption[];

export const Calendar = () => {
  const [tempEvent, setTempEvent] = useState<MbscCalendarEvent>();
  const [isEventSelectOpen, setEventSelectOpen] = useState(false);
  const [isEventType1Open, setEventType1Open] = useState(false);
  const [isEventType2Open, setEventType2Open] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement>();
  const [mySelectedDate, setSelectedDate] = useState(new Date());

  const [eventType1Data] = useContext(EventType1Context);
  const [eventType2Data] = useContext(EventType2Context);

  const data1State = useEventType1Events({
    events: eventType1Data,
  });
  const data2State = useEventType2Events({
    events: eventType2Data,
  });

  const myEvents = useMemo(() => {
    return compact([...data1State.events, ...data2State.events, tempEvent]);
  }, [data1State.events, data2State.events, tempEvent]);

  // scheduler options
  const onSelectedDateChange = useCallback((event: MbscSelectedDateChangeEvent) => {
    setSelectedDate(mobiDateToDate(event.date));
  }, []);

  const onEventClick = useCallback(
    ({ event, domEvent }: MbscEventClickEvent) => {
      // setEdit(true);
      // setTempEvent({ ...args.event });
      // fill popup form with event data
      switch (event.__typename) {
        case 'eventType1':
          data1State.loadForm(event as EventType1);
          setEventType1Open(true);
          break;
        case 'eventType2':
          data2State.loadForm(event as EventType2);
          setEventType2Open(true);
          break;
      }
      setAnchor(domEvent.target);
    },
    [data1State, data2State],
  );

  const onEventCreated = useCallback(({ event, target }: MbscEventCreatedEvent) => {
    setTempEvent(event);
    setAnchor(target);
    setEventSelectOpen(true);
  }, []);

  const onEventUpdate = useCallback(
    ({ event, domEvent }: MbscEventUpdateEvent) => {
      setAnchor(domEvent.target);
      switch (event.__typename) {
        case 'eventType1':
          data1State.loadForm(event as EventType1);
          setEventType1Open(true);
          break;
        case 'eventType2':
          data2State.loadForm(event as EventType2);
          setEventType2Open(true);
          break;
      }
      return false;
    },
    [data1State, data2State],
  );

  const onEventDragEnd = useCallback(({ domEvent }: MbscEventDragEvent) => {
    setAnchor(domEvent.target);
  }, []);

  const eventType1CloseHandler = useCallback(() => {
    setEventType1Open(false);
    data1State.loadForm({});
  }, [data1State]);

  const eventType2CloseHandler = useCallback(() => {
    setEventType2Open(false);
    data2State.loadForm({});
  }, [data2State]);

  const eventTypeCloseHandler = useCallback(() => {
    setEventSelectOpen(false);
    setTempEvent(undefined);
  }, []);

  const eventTypeChangeHandler = useCallback(
    (eventTypeId?: string) => {
      switch (eventTypeId) {
        case 'eventType1':
          data1State.loadForm(tempEvent);
          setEventType1Open(true);
          break;
        case 'eventType2':
          data2State.loadForm(tempEvent);
          setEventType2Open(true);
          break;
      }
      eventTypeCloseHandler();
    },
    [data1State, data2State, eventTypeCloseHandler, tempEvent],
  );

  return (
    <div>
      <Eventcalendar
        height="100%"
        width="100%"
        view={viewSettings}
        data={myEvents}
        clickToCreate="double"
        dragToCreate={true}
        dragToMove={true}
        dragToResize={true}
        selectedDate={mySelectedDate}
        onSelectedDateChange={onSelectedDateChange}
        onEventClick={onEventClick}
        onEventUpdate={onEventUpdate}
        onEventCreated={onEventCreated}
        onEventDragEnd={onEventDragEnd}
      />
      <EventPickerPopup
        anchor={anchor}
        options={eventTypes}
        onSelect={eventTypeChangeHandler}
        isOpen={isEventSelectOpen}
        onClose={eventTypeCloseHandler}
      />
      <EventType1Popup
        isOpen={isEventType1Open}
        anchor={anchor}
        onClose={eventType1CloseHandler}
        dataControls={data1State}
      />
      <EventType2Popup
        isOpen={isEventType2Open}
        anchor={anchor}
        onClose={eventType2CloseHandler}
        dataControls={data2State}
      />
    </div>
  );
};
