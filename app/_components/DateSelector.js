"use client";

import { useReservation } from "@/app/context/ReservationContext";
import { differenceInDays, isPast, isWithinInterval , isSameDay} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange } = useReservation();
  // console.log(settings);


  const displayRange = isAlreadyBooked(range , bookedDates) ? {} : range;

  const { regularPrice, discount } = cabin;
  const numNights = differenceInDays(displayRange.to, displayRange.from);
  const cabinPrice = numNights * (regularPrice - discount);

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between lg:w-[650px]">
      <div className="flex shrink-0">
        <DayPicker
          className="pt-12 "
          mode="range"
          onSelect={setRange}
          selected={displayRange}
          min={minBookingLength + 1}
          max={maxBookingLength}
          startMonth={new Date()}
          startDate={new Date()}
          endMonth={new Date(2030, 0)}
          captionLayout="dropdown"
          numberOfMonths={2} // Two months side by side
          hideNavigation
          disabled={(curDate) =>
            isPast(curDate) ||
            bookedDates.some((date) => isSameDay(date , curDate))
          }
        />
      </div>
      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
          {range.from || range.to ? (
            <button
              className="border border-primary-800 py-2 px-4 text-sm font-semibold"
              onClick={resetRange}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DateSelector;
