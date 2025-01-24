import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";
import CheckoutPage from "./CheckoutPage";

export default async function Page() {
  const session = await auth();
  const fullName = session.user.name;
  const bookings = await getBookings(session.user.guestId);

  return <CheckoutPage name={fullName} bookings={bookings} />;
}
