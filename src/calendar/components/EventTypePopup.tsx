import { ReactNode } from 'react';
import { MbscPopupOptions, Popup } from '@mobiscroll/react';
import { Button, Stack } from '@mui/material';

const responsivePopup = {
  medium: {
    display: 'anchored',
    width: 400,
    fullScreen: false,
    touchUi: false,
  },
};

export type EventTypeOption = {
  id: string;
  title: string;
  description?: ReactNode;
};

export type EventPickerProps = MbscPopupOptions & {
  options: EventTypeOption[];
  onSelect: (id: string) => void;
};

export const EventPickerPopup = ({ options, onSelect, responsive, ...props }: EventPickerProps) => (
  <Popup
    display="center"
    contentPadding={false}
    showArrow={false}
    showOverlay={false}
    responsive={{ ...responsivePopup, ...responsive }}
    headerText="Select Event Type"
    {...props}
  >
    <Stack sx={{ color: 'blue', p: 1 }} gap={1}>
      {options.map(({ id, title }) => (
        <Button key={id} onClick={() => onSelect(id)} variant="contained">
          {title}
        </Button>
      ))}
    </Stack>
  </Popup>
);
