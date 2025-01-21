'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg } from '@fullcalendar/core';

export default function TravelCalendar() {
  const [events, setEvents] = useState([]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // This will later open our "Add Travel" modal
    console.log('Selected dates:', selectInfo.startStr, selectInfo.endStr);
  };

  return (
    <div className="h-[800px] bg-card rounded-lg p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        select={handleDateSelect}
        height="100%"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
      />
    </div>
  );
}
