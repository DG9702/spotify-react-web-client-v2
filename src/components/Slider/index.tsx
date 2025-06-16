// components/Slider/index.tsx
import * as SliderPrimitive from '@radix-ui/react-slider';
import React from 'react';
import './Slider.css'; // file CSS riêng

type SliderProps = {
  isEnabled: boolean;
  value: number;
  onChangeStart?: () => void;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  className?: string;
};

export const Slider = ({
  isEnabled,
  value,
  onChangeStart,
  onChange,
  onChangeEnd,
  className = '',
}: SliderProps) => {
  const handleChange = (val: number[]) => {
    onChange(val[0]);
  };

  return (
    <div
      className={`slider-container ${!isEnabled ? 'slider-disabled' : ''} ${className}`}
    >
      <SliderPrimitive.Root
        className="slider-root"
        min={0}
        max={1}
        step={0.01}
        value={[value]}
        onValueChange={handleChange}
        onPointerDown={onChangeStart}
        onValueCommit={(val) => onChangeEnd?.(val[0])}
      >
        <SliderPrimitive.Track className="slider-track">
          <SliderPrimitive.Range className="slider-range" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="slider-thumb" />
      </SliderPrimitive.Root>
    </div>
  );
};
