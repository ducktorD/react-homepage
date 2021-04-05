import { useState } from 'react';
import Checkbox from '../Settings/Checkbox';
import './style/CalendarEvents.css';

const EventNotification = ({ events, setEvents }) => {
   // console.log(document.querySelector('.react-calendar-container'));

      const updateEventsDone = (id, newDoneValue) => {
         const dateKey = new Date(new Date().toDateString()).getTime();
         setEvents(events => {
            return {...events, [dateKey]: events[dateKey].map((e, i) => {
               if (i === id) {
                  e.done = !newDoneValue;
               }
               return e;
            })}
         });
      }

   return (
      <section className='event-notifications-container'>
         {
            events && events.length > 0
            ? events.map((event, id) => {
               return (
                  <Notification key={id} title={event.title} content={event.content} done={event.done} setDone={(newDoneValue) => updateEventsDone(id, newDoneValue)} />
               )
            })
            : <h1 className='no-events-message'>There are no events today...</h1>
         }
      </section>
   )
}

const Notification = ({ title, content, done, setDone }) => {
   return (
      <div className={`event-notification ${done ? 'event-done' : ''}`}>
         <div className='event-notification-title'>
            {/* <h1>{title}</h1> */}
            <Checkbox htmlName='event-done-checkbox' onClick={() => {
               setDone(!done);
            }} labelText={title} chekced={done} />
         </div>
         <p>{content}</p>
      </div>
   )
}

export default EventNotification;