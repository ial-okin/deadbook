import type React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSurvivorsFetch } from "@/features/survivors/hooks/useSurvivorsFetch";
import { User } from "lucide-react";
import { useState } from "react";

interface ReportInfectionFormProps {
  reported_id: string;
  onReport: (reporter_id: string) => void;
}

export function InfectionReportForm({
  reported_id,
  onReport,
}: ReportInfectionFormProps) {
  const { survivors } = useSurvivorsFetch();
  const [reporterId, setReporterId] = useState("");

  const reporters = survivors.filter((s) => s.id !== reported_id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onReport(reporterId);
  };

  const selectedReporter = reporters.find((r) => r.id === reporterId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reporter">Reporter</Label>
        <Select value={reporterId} onValueChange={setReporterId}>
          <SelectTrigger id="reporter" className="w-full">
            <SelectValue placeholder="Select reporter" />
          </SelectTrigger>
          <SelectContent>
            {reporters.map((reporter) => (
              <SelectItem key={reporter.id} value={reporter.id}>
                <div className="flex items-center">
                  <span>{reporter.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedReporter && (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>
              Reporting as <strong>{selectedReporter.name}</strong>
            </span>
          </div>
        )}
      </div>

      <section className="flex justify-end gap-4">
        <Button variant="outline" type="button">
          Reset
        </Button>
        <Button type="submit" variant="destructive" disabled={!reporterId}>
          Submit Report
        </Button>
      </section>
    </form>
  );
}
