import { useQuery } from "@tanstack/react-query";
import { IEventRegistration } from "../RegisterTable";

interface UseEventRegistrationsProps {
  eventId?: number;
  enabled?: boolean;
}

export const useEventRegistrations = ({ eventId, enabled = true }: UseEventRegistrationsProps = {}) => {
  return useQuery({
    queryKey: ["eventRegistrations", eventId],
    queryFn: async () => {
      const url = eventId 
        ? `/api/event_registration?eventId=${eventId}`
        : `/api/event_registration`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch event registrations");
      }
      
      const data = await response.json();
      return data as IEventRegistration[];
    },
  });
};
