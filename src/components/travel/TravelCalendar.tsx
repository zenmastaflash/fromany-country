'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg } from '@fullcalendar/core';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

interface Travel {
  id: string;
  country: string;
  city: string;
  entry_date: string;
  exit_date?: string;
  purpose: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  textColor?: string;
  notes?: string;
}

interface Props {
  onDelete?: (id: string) => Promise<void>;
}

export default function TravelCalendar({ onDelete }: Props) {
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
        start: travel.entry_date,
        end: travel.exit_date,
        backgroundColor: getPurposeColor(travel.purpose),
        textColor: '#fcfbdc'
      }));
      
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
    if (onDelete && window.confirm('Are you sure you want to delete this travel?')) {
      onDelete(info.event.id);
    }
  };

  const handleEventDrop = async (info: any) => {
    try {
      const response = await fetch(`/api/travel/${info.event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_date: info.event.start,
          exit_date: info.event.end
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
