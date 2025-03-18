import React from 'react'
import MyCalendar from './MyCalendar'
import RoomSelect from './Home/RoomSelect'
import Navbar from './Layouts/Navbar'

function Home() {
  return (
    <div className=' '>
        <Navbar/>
        <RoomSelect/>
    </div>
  )
}

export default Home