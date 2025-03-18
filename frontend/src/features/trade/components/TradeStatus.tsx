import { CheckCircle2, XCircle } from "lucide-react";

export const TradeStatus = ({ isBalanced }: { isBalanced: boolean }) => (
  <div className="mx-2">
    {isBalanced ? (
      <CheckCircle2 className="h-8 w-8 text-green-500" />
    ) : (
      <XCircle className="h-8 w-8 text-red-500" />
    )}
  </div>
);
