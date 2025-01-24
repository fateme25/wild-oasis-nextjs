import Link from "next/link";

export default function Page() {
  return (
    <div className="text-center space-y-6 mt-4 flex flex-col items-center">
      <h1 className="text-3xl font-semibold">
        Thank you for your reservation!
      </h1>
      <Link
        href="/account/reservations"
        className="underline text-xl text-accent-500 inline-block pb-8"
      >
        Manage your reservations &rarr;
      </Link>

      <Link
        href="/cabins/checkout"
        className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all w-60 "
      >
        Checkout
      </Link>
    </div>
  );
}
