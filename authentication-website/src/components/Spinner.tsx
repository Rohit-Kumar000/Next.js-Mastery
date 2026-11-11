interface SpinnerProps {
  // Size and colours of the spinner
  className?: string;
}

export default function Spinner({
  className = "h-4 w-4 border-white/30 border-t-white",
}: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 ${className}`}
    />
  );
}
