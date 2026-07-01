import CountUp from "react-countup";

interface Props {
    value: number;
    prefix?: string;
}

export default function AnimatedCounter({
    value,
    prefix
}: Props) {

    return (
        <CountUp
            end={value}
            duration={2}
            separator=","
            prefix={prefix}
        />
    );
}
