"use client";

import convertToSubcurrency from "@/app/_lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../_components/CheckoutForm";
import Image from "next/image";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function CheckoutPage({ bookings }) {
  const { amount, guests } = bookings.reduce(
    (acc, cur) => ({
      amount: acc.amount + cur.totalPrice,
      guests: acc.guests + cur.numGuests,
    }),
    { amount: 0, guests: 0 }
  );

  const formattedBookings = bookings.map((booking) => ({
    startDate: new Date(booking.startDate).toDateString(),
    endDate: new Date(booking.endDate).toDateString(),
  }));

  return (
    <main className="max-w-6xl mx-auto text-white text-center shadow-lg shadow-accent-400/50 m-10  bg-[#2e2e2f80] backdrop-filter backdrop-blur-md backdrop-saturate-150  border-white/12.5 rounded-md">
      <div className="flex justify-between pt-7 px-8 pb-3">
        <div className="flex flex-col divide-y-2 divide-zinc-600 text-left">
          <div>
            <p className="text-4xl font-extrabold mb-2">Your Reservation</p>
            <p className=" text-accent-500 py-2">
              {" "}
              {amount} <span className="text-[20px]  font-bold">USD</span> /
              Night
            </p>
          </div>
          <div className="leading-7">
            <p className="py-2 text-xl font-light">
              {`Entire home for ${guests} ${guests > 1 ? "guests" : "guest"}`}
            </p>
            <ul className=" font-thin">
              {formattedBookings.map((booking, index) => (
                <li key={index}>
                  {booking.startDate} to {booking.endDate}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-2xl">
          {bookings.map((booking, index) => (
            <Image
              src={booking.cabins.image}
              key={index}
              width={120}
              height={120}
              alt=""
              className="m-4 rounded-md"
            />
          ))}
        </div>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <CheckoutForm amount={amount} />
      </Elements>
    </main>
  );
}

export default CheckoutPage;
