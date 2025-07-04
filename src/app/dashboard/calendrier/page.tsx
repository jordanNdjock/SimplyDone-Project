import CalendarComponent from '../../../components/calendar/CalendarComponent';
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Calendrier"
}
export default function Calendar(){
    return (
        <>
          <CalendarComponent />
        </>
    );
}