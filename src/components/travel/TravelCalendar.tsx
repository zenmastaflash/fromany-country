// src/components/travel/TravelCalendar.tsx - FINAL CORRECTED VERSION
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
        allDay: true, // Explicitly mark as all-day events
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
      let newEnd = info.event.end ? new Date(info.event.end) : null;
      
      // Calculate the difference in days between old and new start dates
      const daysDifference = Math.round(
        (newStart.getTime() - originalStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // If there was an original end date, apply the same day difference
      if (originalEnd && daysDifference !== 0) {
        newEnd = new Date(originalEnd);
        newEnd.setDate(newEnd.getDate() + daysDifference);
      }
      
      // Ensure end date is after start date (at least next day)
      if (newEnd) {
        // If dates would be the same or end before start after the drag
        if (newEnd <= newStart) {
          newEnd = new Date(newStart);
          newEnd.setDate(newEnd.getDate() + 1);
        }
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
        const errorText = await response.json();
        console.error('Server response:', errorText);
        throw new Error(`Failed to update travel: ${JSON.stringify(errorText)}`);
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
      const originalStart = new Date(info.event.start);
      const newEnd = new Date(info.event.end);
      
      // FullCalendar uses exclusive end dates, subtract one day for display
      newEnd.setDate(newEnd.getDate() - 1);
      
      // Ensure the end date is after the start date
      if (newEnd <= originalStart) {
        console.warn('Invalid resize: End date must be after start date');
        info.revert();
        return;
      }
      
      console.log('Resizing travel:', {
        id: info.event.id,
        originalStart: originalStart.toISOString(),
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
        const errorText = await response.json();
        console.error('Server response:', errorText);
        throw new Error(`Failed to update travel end date: ${JSON.stringify(errorText)}`);
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
        eventStartEditable={true}
        eventDurationEditable={true}
        eventResizableFromStart={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="100%"
        allDaySlot={true}
        slotEventOverlap={false}
        fixedWeekCount={false}
        views={{
          dayGrid: {
            eventResizableFromStart: true
          },
          timeGrid: {
            eventResizableFromStart: true
          }
        }}
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
