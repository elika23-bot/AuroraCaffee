type SunburstProps = {
  className?: string;
  rayColor?: string;
  coreColor?: string;
  rays?: number;
};

export default function Sunburst({
  className,
  rayColor = "#e3a53d",
  coreColor = "#e3a53d",
  rays = 16,
}: SunburstProps) {
  const items = Array.from({ length: rays });
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke={rayColor} strokeWidth="6" strokeLinecap="round">
        {items.map((_, i) => {
          const angle = (Math.PI / (rays - 1)) * i - Math.PI;
          const x1 = 100 + Math.cos(angle) * 46;
          const y1 = 100 + Math.sin(angle) * 46 * 1.05;
          const x2 = 100 + Math.cos(angle) * (i % 2 === 0 ? 92 : 76);
          const y2 = 100 + Math.sin(angle) * (i % 2 === 0 ? 92 : 76) * 1.05;
          return (
            <line
              key={i}
              x1={x1}
              y1={Math.min(y1, 102)}
              x2={x2}
              y2={Math.min(y2, 102)}
            />
          );
        })}
      </g>
      <path d="M46 102a54 54 0 0 1 108 0Z" fill={coreColor} />
    </svg>
  );
}
