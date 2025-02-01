"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/action";
import Link from "next/link";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function ReservationList({ bookings }) {
  const [optimisticBookings, deleteOptimistic] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  const router = useRouter()

  async function handleDelete(bookingId) {
    deleteOptimistic(bookingId);
    await deleteReservation(bookingId);
  }
  return (
    <>
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

      <div className="flex mt-12 gap-4">
        <Link
          href="/checkout"
          className="text-2xl flex justify-center items-center p-2 gap-2 bg-accent-500 rounded-md "
        >
          Pay
          <CreditCardIcon className="h-5" />
        </Link>
        <button className="border-2 border-accent-500 px-4 rounded-md" onClick={()=>router.push("/")}>
          Cancel
        </button>
      </div>
    </>
  );
}
