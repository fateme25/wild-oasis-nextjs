"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/action";

export default function ReservationList({ bookings }) {
  const [optimisticBookings, deleteOptimistic] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId) {
    deleteOptimistic(bookingId);
    await deleteReservation(bookingId);
  }
  return (
    <div>
      <ul className="space-y-6">
        {optimisticBookings.map((booking) => (
          <ReservationCard
            booking={booking}
            key={booking.id}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
