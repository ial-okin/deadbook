export const TradePoints = ({
  title,
  points,
}: {
  title: string;
  points: number;
}) => (
  <div className="text-center">
    <div className="text-sm font-medium">{title}</div>
    <div className="text-2xl font-bold">{points}</div>
  </div>
);
