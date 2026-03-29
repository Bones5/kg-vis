// TODO (Milestone 5+): Implement Slider component

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function Slider({ min, max, value, onChange, label }: SliderProps) {
  return (
    <label className="slider">
      {label && <span>{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
