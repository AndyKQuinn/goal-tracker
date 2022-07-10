import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import { addDays } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

interface IDatePicker {
  selectedDate: Date
  onDateChange: any
  today: Date
}

export default function CustomDatePicker(props: IDatePicker) {
  const { selectedDate, onDateChange, today } = props
  const [disableDayIncrement, setDisableDayIncrement] = useState(false)

  const handleDateChange = (adjAmount: number) => {
    const newDate = addDays(selectedDate, adjAmount)
    onDateChange(newDate)
  }

  useEffect(() => {
    if (selectedDate.toLocaleDateString() === today.toLocaleDateString()) {
      setDisableDayIncrement(true)
    } else {
      setDisableDayIncrement(false)
    }
  }, [selectedDate, today])

  return (
    <div className="flex content-center justify-center p-2 mt-2 text-center">
      <button onClick={() => handleDateChange(-1)}>     
        <AiFillCaretLeft className="text-4xl text-white" />
      </button>
      <DatePicker
        className="text-2xl text-center"
        selected={selectedDate}
        onChange={(date:Date) => onDateChange(date)}
        maxDate={new Date()}
      />
      <button disabled={disableDayIncrement} onClick={() => handleDateChange(1)}>
        <AiFillCaretRight className="text-4xl text-white"  />
      </button>
    </div>
  )
}
