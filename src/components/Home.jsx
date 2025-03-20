import React from 'react'
import RoomSelect from './Home/RoomSelect'
import Navbar from './Layouts/Navbar'
import NotificationComponent from './NotificationComponent'


function Home() {
  return (
    <div className=' '>
        <Navbar/>
{/* <NotificationComponent/>         */}
        <RoomSelect/>
    </div>
  )
}

export default Home