
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";

export interface CourtDate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  caseId: string;
  caseTitle?: string;
}

interface ClientCourtDatesCardProps {
  loading: boolean;
  courtDates: CourtDate[];
}

export const ClientCourtDatesCard: React.FC<ClientCourtDatesCardProps> = ({ loading, courtDates }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <CalendarClock className="mr-2 h-5 w-5" />
          Upcoming Court Dates
        </CardTitle>
        <CardDescription>
          Your scheduled court appearances and deadlines
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : courtDates.length > 0 ? (
          <div className="space-y-4">
            {courtDates.map((date) => (
              <div key={date.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-semibold">{date.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {date.caseTitle ? `Case: ${date.caseTitle}` : 'No case specified'}
                  </p>
                  <p className="text-sm mt-1">{date.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{format(new Date(date.date), 'MMM d, yyyy')}</div>
                  <div className="text-sm">{date.time}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No upcoming court dates scheduled.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
