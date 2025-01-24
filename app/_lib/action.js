"use server";

import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import {
  updateGuest,
  deleteBooking,
  getBookings,
  updateBooking,
  createBooking,
} from "./data-service";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationalID, nationality, countryFlag };

  await updateGuest(session.user.guestId, updateData);

  revalidatePath("/account/profile");
}

export async function updateReservation(formData) {
  // 1- Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2-Authorization
  const bookingId = Number(formData.get("bookingId"));
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingId = guestBookings.map((booking) => booking.id);
  console.log(guestBookingId);

  if (!guestBookingId.includes(bookingId))
    throw new Error("You aren't allowed to Edit this booking");

  //3-update booking
  const updateData = {
    numGuests: formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
  };

  //-4 Mutation
  await updateBooking(bookingId, updateData);

  //5- revalidate cache
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  //6-redirect to reservation page
  redirect("/account/reservations");
}

export async function createReservation(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    created_at: new Date(),
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    isPaid: false,
    hasBreakfast: false,
    totalPrice: bookingData.cabinPrice,
    status: "unconfirmed",
  };
  console.log(newBooking);

  await createBooking(newBooking);
  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingId = guestBookings.map((booking) => booking.id);
  if (!guestBookingId.includes(bookingId))
    throw new Error("You aren't allowed to delete this booking");

  await deleteBooking(bookingId);

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
