import { Progress } from "./ui/progress";

type MetricProps = {
  label: string;
  value: string;
  hint: string;
  progress: number;
};

export function Metric({
  label,
  value,
  hint,
  progress,
}: MetricProps) {
  const getProgressColor = (progress: number) => {
  if (progress > 75) {
    return "text-red-600";
  }

  if (progress > 50) {
    return "text-orange-500";
  }

  return "text-green-600";
};

const getDotColor = (progress: number) => {
  if (progress > 75) {
    return "bg-red-600";
  }

  if (progress > 50) {
    return "bg-orange-500";
  }

  return "bg-green-600";
};

  const color = getProgressColor(progress);
  const dot = getDotColor(progress)

  return (
    <article className="metric-card">
      <div className="flex items-center justify-between py-4">
        <label className="uppercase">Memory</label>
        <div className={`h-2 w-2 rounded-full ${dot}`} />
      </div>
        <p className="text-lg font-bold">{hint}</p>

      <strong>{value}</strong>

      <div className="flex items-center gap-5">
        <Progress value={50} className={`${color} flex-1`} />
        <p>{progress}%</p>
      </div>
    </article>
  );
}
