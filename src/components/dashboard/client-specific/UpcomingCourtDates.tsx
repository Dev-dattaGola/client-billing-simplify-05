
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface CourtDate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

interface UpcomingCourtDatesProps {
  clientId: string;
}

// Mock data for court dates - in a real app, this would come from your API
const getMockCourtDates = (clientId: string): CourtDate[] => {
  return [
    {
      id: '1',
      title: 'Initial Hearing',
      date: '2025-06-15',
      time: '09:30 AM',
      location: 'County Courthouse, Room 302',
      description: 'Initial hearing for your personal injury case'
    },
    {
      id: '2',
      title: 'Settlement Conference',
      date: '2025-07-22',
      time: '10:00 AM',
      location: 'Mediation Center, 5th Floor',
      description: 'Conference with opposing counsel to discuss potential settlement'
    },
    {
      id: '3',
      title: 'Deposition',
      date: '2025-06-05',
      time: '02:00 PM',
      location: 'Law Offices of Smith & Associates',
      description: 'Your deposition with defense attorneys'
    }
  ];
};

const UpcomingCourtDates: React.FC<UpcomingCourtDatesProps> = ({ clientId }) => {
  const [courtDates, setCourtDates] = useState<CourtDate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourtDates = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          const dates = getMockCourtDates(clientId);
          setCourtDates(dates);
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error("Failed to fetch court dates:", error);
        toast({
          title: "Error",
          description: "Failed to load your upcoming court dates. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (clientId) {
      fetchCourtDates();
    }
  }, [clientId, toast]);

  // Sort court dates by date (closest first)
  const sortedCourtDates = [...courtDates].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Upcoming Court Dates</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : sortedCourtDates.length > 0 ? (
          <div className="space-y-4">
            {sortedCourtDates.map((event) => (
              <div key={event.id} className="flex items-start space-x-4 p-3 rounded-md border bg-card hover:bg-accent/40 transition-colors">
                <div className="bg-primary/10 p-2 rounded-md flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {new Date(event.date).toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  <p className="text-sm mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>No upcoming court dates scheduled.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingCourtDates;
