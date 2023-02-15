import { MbscPopupOptions, Popup } from '@mobiscroll/react';

const responsivePopup = {
  medium: {
    display: 'anchored',
    touchUi: false,
    buttons: [],
  },
};

const colors = [
  '#ffeb3c',
  '#ff9900',
  '#f44437',
  '#ea1e63',
  '#9c26b0',
  '#3f51b5',
  '',
  '#009788',
  '#4baf4f',
  '#7e5d4e',
];

export type ColorPickerPopupProps = MbscPopupOptions & {
  value: string | undefined;
  onChange: (color: string | undefined) => void;
};

export const ColorPickerPopup = ({
  value,
  onChange,
  responsive,
  ...props
}: ColorPickerPopupProps) => (
  <Popup
    display="bottom"
    contentPadding={false}
    showArrow={false}
    showOverlay={false}
    responsive={{ ...responsivePopup, ...responsive }}
    {...props}
  >
    <div className="crud-color-row">
      {colors.map((color, index) => {
        if (index < 5) {
          return (
            <div
              key={index}
              onClick={() => onChange(color)}
              className={'crud-color-c ' + (value === color ? 'selected' : '')}
              data-value={color}
            >
              <div
                className="crud-color mbsc-icon mbsc-font-icon mbsc-icon-material-check"
                style={{ background: color }}
              ></div>
            </div>
          );
        } else return null;
      })}
    </div>
    <div className="crud-color-row">
      {colors.map((color, index) => {
        if (index >= 5) {
          return (
            <div
              key={index}
              onClick={() => onChange(color)}
              className={'crud-color-c ' + (value === color ? 'selected' : '')}
              data-value={color}
            >
              <div
                className="crud-color mbsc-icon mbsc-font-icon mbsc-icon-material-check"
                style={{ background: color }}
              ></div>
            </div>
          );
        } else return null;
      })}
    </div>
  </Popup>
);
