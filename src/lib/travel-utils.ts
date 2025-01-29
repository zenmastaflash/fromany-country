// src/lib/travel-utils.ts

import { Travel } from '@/types/travel';

export function getCurrentLocation(travels: Travel[]) {
  const now = new Date();
  return travels.find(t => 
    new Date(t.entry_date) <= now && 
    (!t.exit_date || new Date(t.exit_date) >= now)
  );
}

export function getUpcomingDepartures(travels: Travel[], daysThreshold = 30) {
  const now = new Date();
  return travels
    .filter(t => t.exit_date && 
      new Date(t.exit_date) > now &&
      new Date(t.exit_date).getTime() - now.getTime() <= daysThreshold * 24 * 60 * 60 * 1000
    )
    .sort((a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime());
}
