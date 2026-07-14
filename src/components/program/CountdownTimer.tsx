import { useState, useEffect } from 'react';

interface Props {
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(endDate: string): TimeLeft {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl md:text-4xl font-heading font-bold text-forest-900 tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-earth-800/60 uppercase tracking-wide mt-1">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ endDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(endDate));
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft(endDate);
      setTimeLeft(tl);
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        setExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (expired) return null;

  return (
    <div className="bg-gold-100/50 rounded-2xl p-6 md:p-8 border border-gold-500/20 text-center">
      <p className="text-sm font-medium text-forest-700 mb-4 uppercase tracking-wide">
        Offer expires in
      </p>
      <div className="flex justify-center gap-6 md:gap-8">
        <TimeUnit value={timeLeft.days} label="Days" />
        <span className="text-3xl font-bold text-gold-600 self-start mt-1" aria-hidden="true">:</span>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-3xl font-bold text-gold-600 self-start mt-1" aria-hidden="true">:</span>
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <span className="text-3xl font-bold text-gold-600 self-start mt-1" aria-hidden="true">:</span>
        <TimeUnit value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}
