export default function PaymentSuccess({ searchParams: { amount = 0 } }) {
  return (
    <main className="max-w-6xl mx-auto p-10  text-center shadow-lg shadow-accent-400/50 m-10 rounded-md">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-accent-600">
          We hope to welcome you back soon
        </h1>
        <h2 className="text-2xl ">
          Thank you for your payment
          <br />$ {amount.toLocaleString()}
        </h2>
      </div>
    </main>
  );
}
