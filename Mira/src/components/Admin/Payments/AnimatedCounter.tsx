import CountUp from "react-countup";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({ value, prefix, suffix }: Props) {
  return (
    <CountUp
      end={value}
      duration={2}
      separator=","
      prefix={prefix}
      suffix={suffix}
    />
  );
}
