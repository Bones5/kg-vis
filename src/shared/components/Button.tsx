// TODO (Milestone 5+): Implement reusable Button component

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ label, onClick, disabled, variant = "primary" }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
