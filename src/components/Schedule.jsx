import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from './Layouts/Navbar'
import MyCalendar from './MyCalendar'

function Schedule() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId'); // Extract roomId from URL

  return (
    <div>
      <Navbar />
      <MyCalendar roomId={roomId} /> {/* Pass roomId to MyCalendar */}
    </div>
  )
}

export default Schedule;
