import { useEffect, useState } from "react";
import { subscribeToEvents } from "@/services/api";
import type { DecoyEvent } from "@/types";

export function useLiveEvents(seed: DecoyEvent[] = [], limit = 8) {
  const [events, setEvents] = useState<DecoyEvent[]>(seed);

  useEffect(() => setEvents(seed.slice(0, limit)), [seed.length, limit]);

  useEffect(() => {
    return subscribeToEvents((event) => {
      setEvents((prev) => [event, ...prev].slice(0, limit));
    });
  }, [limit]);

  return events;
}
