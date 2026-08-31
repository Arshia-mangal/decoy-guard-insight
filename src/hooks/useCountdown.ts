import { useEffect, useMemo, useState } from "react";

export interface Countdown {
  hours: string;
  minutes: string;
  seconds: string;
  totalMs: number;
  expired: boolean;
  progress: number;
}

/** Counts down to `deadline`, assuming a `windowHours` reporting window. */
export function useCountdown(deadline: string | undefined, windowHours = 6): Countdown {
  const target = useMemo(() => (deadline ? new Date(deadline).getTime() : 0), [deadline]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalMs = Math.max(0, target - now);
  const windowMs = windowHours * 3600_000;
  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

  return {
    hours: pad(totalMs / 3600_000),
    minutes: pad((totalMs % 3600_000) / 60_000),
    seconds: pad((totalMs % 60_000) / 1000),
    totalMs,
    expired: target > 0 && totalMs === 0,
    progress: Math.min(100, Math.max(0, 100 - (totalMs / windowMs) * 100)),
  };
}
