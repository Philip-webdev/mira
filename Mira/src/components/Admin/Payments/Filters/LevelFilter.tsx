interface Props {
  value: string;
  onChange: (value: string) => void;
}

const levels = ["All", "100", "200", "300", "400", "500"];

export default function LevelFilter({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
      h-12
      rounded-2xl
      border
      border-[#180b28]/10
      text-[#180b28]
      bg-white/70
      px-4
      backdrop-blur-xl
      outline-none"
    >
      {levels.map((level) => (
        <option key={level} value={level}>
          {level}
        </option>
      ))}
    </select>
  );
}

