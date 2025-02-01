"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import convertToSubcurrency from "@/app/_lib/convertToSubcurrency";
import SpinnerMini from "./SpinnerMini";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

function CheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // console.log(clientSecret);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `https://the-wild-oasis-next-js-delta.vercel.app/api/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements)
    return (
      <div className="flex justify-center items-center">
        <SpinnerMini />
      </div>
    );
  return (
    <form className="p-8 rounded-md" onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      <button
        className="text-white w-full p-5 bg-gradient-to-tr from-accent-200 to-accent-500 mt-6 mb-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
        disabled={!stripe || loading}
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
}

export default CheckoutForm;
