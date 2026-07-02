interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function DateFilter({ value, onChange }: Props) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
      h-12
      rounded-2xl
      border
      border-[#180b28]/10
      bg-white/70
      text-[#180b28]
      px-4
      backdrop-blur-xl
      outline-none"
    />
  );
}

