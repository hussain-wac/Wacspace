import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from './Layouts/Navbar';
import MyCalendar from './MyCalendar';

function Schedule() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId'); // Extract roomId from URL
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </Button>
        <MyCalendar roomId={roomId} /> {/* Pass roomId to MyCalendar */}
      </div>
    </div>
  );
}

export default Schedule;
