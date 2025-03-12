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
  onSelect?: (selectInfo: { start: Date; end?: Date }) => void;
}

export default function TravelCalendar({ onDelete, onEdit, onSelect }: Props) {
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
        end: travel.exit_date ?? undefined,
        backgroundColor: getPurposeColor(travel.purpose),
        textColor: '#fcfbdc',
        extendedProps: {
          country: travel.country,
          city: travel.city,
          purpose: travel.purpose,
          notes: travel.notes
        }
      }));
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching travel data:', error);
    }
  };

  const getPurposeColor = (purpose: string): string => {
    const colors = {
      home_base: '#024950',
      tourism: '#964734',
      business: '#0FA4AF',
      remote_work: '#AFDDE5',
      relocation: '#2E2E2E',
      default: '#0FA4AF'
    };
    return colors[purpose as keyof typeof colors] || colors.default;
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const endDate = selectInfo.end ? new Date(selectInfo.end) : undefined;
    if (endDate) {
      endDate.setDate(endDate.getDate() - 1);
    }
    
    onSelect?.({
      start: selectInfo.start,
      end: endDate
    });
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
      user_id: '',
      status: null,
      visa_type: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    onEdit?.(travel);
  };

  const handleEventDrop = async (info: any) => {
    try {
      // Get the original start and end dates
      const originalStart = new Date(info.oldEvent.start);
      const originalEnd = info.oldEvent.end ? new Date(info.oldEvent.end) : null;
      
      // Get the new start and end dates after drag
      const newStart = new Date(info.event.start);
      let newEnd = null;
      
      // Calculate the difference in days between old and new start dates
      const daysDifference = Math.floor((newStart.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24));
      
      // If there was an original end date, apply the same day difference
      if (info.event.end) {
        newEnd = new Date(info.event.end);
        // FullCalendar uses exclusive end dates - subtract one day
        newEnd.setDate(newEnd.getDate() - 1);
      } else if (originalEnd) {
        // Calculate new end date based on the day difference
        newEnd = new Date(originalEnd);
        newEnd.setDate(newEnd.getDate() + daysDifference);
      }

      // Validate that newEnd is not before newStart
      if (newEnd && newEnd < newStart) {
        throw new Error('End date cannot be before start date');
      }

      // If start and end dates are the same, add one day to end date
      if (newEnd && 
          newEnd.getFullYear() === newStart.getFullYear() &&
          newEnd.getMonth() === newStart.getMonth() &&
          newEnd.getDate() === newStart.getDate()) {
        newEnd.setDate(newEnd.getDate() + 1);
      }
      
      console.log('Updating travel after drag:', {
        id: info.event.id,
        originalStart: originalStart.toISOString(),
        originalEnd: originalEnd?.toISOString() ?? null,
        newStart: newStart.toISOString(),
        newEnd: newEnd?.toISOString() ?? null,
        daysDifference
      });
      
      const response = await fetch(`/api/travel/${info.event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_date: newStart.toISOString(),
          exit_date: newEnd?.toISOString() ?? null
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to update travel: ${errorText}`);
      }
      
      // Refresh data after successful update
      await fetchTravelData();
    } catch (error) {
      console.error('Error updating travel after drag:', error);
      info.revert();
    }
  };
  
  const handleEventResize = async (info: any) => {
    try {
      const newStart = new Date(info.event.start);
      const newEnd = new Date(info.event.end);
      // FullCalendar uses exclusive end dates, so subtract one day for the actual end date
      newEnd.setDate(newEnd.getDate() - 1);

      // Validate that newEnd is not before newStart
      if (newEnd < newStart) {
        throw new Error('End date cannot be before start date');
      }

      // If start and end dates are the same, add one day to end date
      if (newEnd.getFullYear() === newStart.getFullYear() &&
          newEnd.getMonth() === newStart.getMonth() &&
          newEnd.getDate() === newStart.getDate()) {
        newEnd.setDate(newEnd.getDate() + 1);
      }
      
      console.log('Resizing travel:', {
        id: info.event.id,
        oldEnd: info.oldEvent.end ? new Date(info.oldEvent.end).toISOString() : null,
        newEnd: newEnd.toISOString()
      });
      
      const response = await fetch(`/api/travel/${info.event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exit_date: newEnd.toISOString()
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to update travel end date: ${errorText}`);
      }
      
      // Reload calendar data after successful update
      await fetchTravelData();
    } catch (error) {
      console.error('Error updating travel end date during resize:', error);
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
        eventDurationEditable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
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
