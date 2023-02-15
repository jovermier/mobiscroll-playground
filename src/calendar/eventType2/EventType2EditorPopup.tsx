import {
  BaseSyntheticEvent,
  LegacyRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Popup,
  Button,
  Input,
  Textarea,
  Switch,
  Datepicker,
  SegmentedGroup,
  SegmentedItem,
  MbscPopupOptions,
  MbscPopupButton,
} from '@mobiscroll/react';
import { TDatepickerControl } from '@mobiscroll/react/dist/src/core/components/datepicker/datepicker';
import { Controller } from 'react-hook-form';
import { format } from 'date-fns';

import { ColorPickerPopup } from 'calendar/components/ColorPickerPopup';
import { EventType2Form, useEventType2Events } from './useEventType2Events';
import { EventType2Context } from 'EventType2DataProvider';
import { mobiDateToDate } from 'utils/date';
import { EventType2 } from 'calendar/data-types';

const responsivePopup = {
  medium: {
    display: 'anchored',
    width: 400,
    fullScreen: false,
    touchUi: false,
  },
};

type Data1Events = ReturnType<typeof useEventType2Events>;

const formToEvent = (data: EventType2Form) => {
  const { start, end, allDay, status, ...rest } = data;
  return {
    ...rest,
    start: mobiDateToDate(start),
    end: mobiDateToDate(end),
    allDay,
    free: status === 'free',
  } as EventType2;
};

type Data1PopupProps = MbscPopupOptions & {
  dataControls: Data1Events;
};

export const EventType2Popup = ({ dataControls, ...props }: Data1PopupProps) => {
  const [colorAnchor, setColorAnchor] = useState<HTMLElement>();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const popupRef = useRef<Popup>();

  const {
    form: { control, register, watch, handleSubmit },
  } = dataControls;

  const [originalEvents, { addEvent, updateEvent, deleteEvent }] = useContext(EventType2Context);

  // form data linking
  const [startRef, setStartRef] = useState<LegacyRef<Input>>();
  const [endRef, setEndRef] = useState<LegacyRef<Input>>();

  const eventId = watch('id');
  const allDay = watch('allDay');
  const isEdit = !!watch('createdAt');

  const onDeleteClick = useCallback(() => {
    if (isEdit) {
      deleteEvent(eventId);
      popupRef.current?.close();
    }
  }, [deleteEvent, eventId, isEdit]);

  const saveEvent = useCallback(
    (ev: BaseSyntheticEvent) => {
      handleSubmit((data) => {
        const convertedData = {
          ...originalEvents.find((e) => e.id === data.id),
          ...formToEvent(data),
        };
        if (data.createdAt) {
          updateEvent(convertedData);
        } else {
          addEvent(convertedData);
        }

        if (props.onClose) {
          props.onClose({ event: convertedData }, undefined);
        }
      })(ev);
    },
    [addEvent, handleSubmit, originalEvents, props, updateEvent],
  );

  // datepicker options
  const controls = useMemo<TDatepickerControl[]>(
    () => (allDay ? ['date'] : ['datetime']),
    [allDay],
  );
  const headerText = useMemo(() => (isEdit ? 'Edit event' : 'New Event'), [isEdit]);
  const respSetting = useMemo(
    () =>
      allDay
        ? {
            medium: {
              controls: ['calendar'],
              touchUi: false,
            },
          }
        : {
            medium: {
              controls: ['calendar', 'time'],
              touchUi: false,
            },
          },
    [allDay],
  );
  const popupButtons = useMemo(() => {
    if (isEdit) {
      return [
        'cancel',
        {
          handler: saveEvent,
          keyCode: 'enter',
          text: 'Save',
          cssClass: 'mbsc-popup-button-primary',
        },
      ] as MbscPopupButton[];
    } else {
      return [
        'cancel',
        {
          handler: saveEvent,
          keyCode: 'enter',
          text: 'Add',
          cssClass: 'mbsc-popup-button-primary',
        },
      ] as MbscPopupButton[];
    }
  }, [isEdit, saveEvent]);

  const openColorPicker = useCallback((ev: BaseSyntheticEvent) => {
    setColorAnchor(ev.currentTarget);
    setColorPickerOpen(true);
  }, []);

  return (
    <Popup
      ref={popupRef}
      display="bottom"
      fullScreen={true}
      contentPadding={false}
      headerText={headerText}
      buttons={popupButtons}
      responsive={responsivePopup}
      {...props}
    >
      <div className="mbsc-form-group">
        <Input label="Title" {...register('title')} />
        <Textarea label="Description" {...register('description')} />
      </div>
      <div className="mbsc-form-group">
        <Controller
          name="allDay"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              label="All-day"
              checked={value}
              onChange={(ev: { target: { checked: boolean } }) => onChange(ev.target.checked)}
            />
          )}
        />
        <Controller
          name="start"
          control={control}
          render={({ field: { value: startValue, onChange: startOnChange } }) => (
            <Controller
              name="end"
              control={control}
              render={({ field: { value: endValue, onChange: endOnChange } }) => (
                <>
                  <Input
                    ref={setStartRef as LegacyRef<Input> | undefined}
                    label="Starts"
                    defaultValue={startValue ? format(startValue, 'MM/dd/yyyy HH:mm a') : ''}
                    onBlur={(ev: { target: { value: string | number | Date } }) => {
                      startOnChange(ev.target.value ? new Date(ev.target.value) : undefined);
                    }}
                  />
                  <Input
                    ref={setEndRef as LegacyRef<Input> | undefined}
                    label="Ends"
                    defaultValue={endValue ? format(endValue, 'MM/dd/yyyy HH:mm a') : ''}
                    onBlur={(ev: { target: { value: string | number | Date } }) => {
                      endOnChange(ev.target.value ? new Date(ev.target.value) : undefined);
                    }}
                  />
                  <Datepicker
                    select="range"
                    controls={controls}
                    touchUi={true}
                    stepMinute={5}
                    startInput={startRef}
                    endInput={endRef}
                    showRangeLabels={false}
                    responsive={respSetting}
                    onChange={({ value }) => {
                      if (startValue !== value[0]) {
                        startOnChange(value[0]);
                      }
                      if (endValue !== value[1]) {
                        endOnChange(value[1]);
                      }
                    }}
                    value={[startValue, endValue]}
                  />
                </>
              )}
            />
          )}
        />
        <Controller
          name="color"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <div onClick={openColorPicker} className="event-color-c">
                <div className="event-color-label">Color</div>
                <div>
                  <div className="event-color" style={{ background: value }}></div>
                </div>
              </div>
              <ColorPickerPopup
                anchor={colorAnchor}
                isOpen={colorPickerOpen}
                value={value}
                onChange={(color: string | undefined) => {
                  onChange(color);
                  setColorPickerOpen(false);
                }}
              />
            </>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SegmentedGroup value={value} onChange={onChange}>
              <SegmentedItem value="busy">Show as busy</SegmentedItem>
              <SegmentedItem value="free">Show as free</SegmentedItem>
            </SegmentedGroup>
          )}
        />
        {isEdit && (
          <div className="mbsc-button-group">
            <Button
              className="mbsc-button-block"
              color="danger"
              variant="outline"
              onClick={onDeleteClick}
            >
              Delete event
            </Button>
          </div>
        )}
      </div>
    </Popup>
  );
};
