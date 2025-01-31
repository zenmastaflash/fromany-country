// src/components/travel/TravelCalendar.tsx
'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventInput } from '@fullcalendar/core';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { Travel } from '@prisma/client';

interface ExtendedProps {
  country: string;
  city: string | null;
  purpose: string;
  notes?: string | null;
}

type CalendarEvent = EventInput & {
  extendedProps?: ExtendedProps;
};

interface Props {
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (travel: Travel) => void;
}

export default function TravelCalendar({ onDelete, onEdit }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetchTravelData();
  }, []); 

  const fetchTravelData = async () => {
    try {
      const response = await fetch('/api/travel');
      if (!response.ok) throw new Error('Failed to fetch travel data');
      
      const data: Travel[] = await response.json();
      const calendarEvents = data.map(travel => ({
        id: travel.id,
        title: `${travel.city}, ${travel.country}`,
        // Keep ISO format from Prisma
        start: travel.entry_date,
        end: travel.exit_date ?? undefined,  // Use nullish coalescing to convert null to undefined
        backgroundColor: getPurposeColor(travel.purpose),
        textColor: '#fcfbdc',
        extendedProps: {
          country: travel.country,
          city: travel.city,
          purpose: travel.purpose,
          notes: travel.notes
        }
      }));
      
      console.log('Calendar events:', calendarEvents); // Debug
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching travel data:', error);
    }
  };

  const getPurposeColor = (purpose: string): string => {
    const colors = {
      home_base: '#024950',    // secondary
      tourism: '#964734',      // accent
      business: '#0FA4AF',     // primary
      remote_work: '#AFDDE5',  // link
      relocation: '#2E2E2E',   // background
      default: '#0FA4AF'       // primary
    };
    return colors[purpose as keyof typeof colors] || colors.default;
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log('Selected dates:', selectInfo.startStr, selectInfo.endStr);
  };

  const handleEventClick = (info: any) => {
    const travel: Travel = {
      id: info.event.id,
      country: info.event.extendedProps.country,
      city: info.event.extendedProps.city,
      entry_date: new Date(info.event.start),
      exit_date: info.event.end ? new Date(info.event.end) : null,
      purpose: info.event.extendedProps.purpose,
      notes: info.event.extendedProps.notes || null,
      user_id: '',   // Will be handled by backend
      status: null,  
      visa_type: null,
      created_at: new Date(), // Will be handled by backend
      updated_at: new Date()  // Will be handled by backend
    };
    onEdit?.(travel);
  };

  const handleEventDrop = async (info: any) => {
    try {
      const response = await fetch(`/api/travel/${info.event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Keep ISO format for Prisma
          entry_date: info.event.start.toISOString(),
          exit_date: info.event.end?.toISOString() ?? null  // Convert undefined back to null for Prisma
        })
      });
      if (!response.ok) throw new Error('Failed to update travel');
      fetchTravelData();
    } catch (error) {
      console.error('Error updating travel:', error);
      info.revert();
    }
  };

  return (
    <div className="h-[800px] bg-secondary rounded-lg p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        editable={true}
        eventDrop={handleEventDrop}
        height="100%"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        eventDidMount={(info) => {
          if (info.event.extendedProps?.notes) {
            tippy(info.el, {
              content: info.event.extendedProps.notes,
              theme: 'light',
              placement: 'top',
            });
          }
        }}
      />
    </div>
  );
}
