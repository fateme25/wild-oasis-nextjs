import Spinner from "@/app/_components/Spinner";

function loading() {
  return (
    <div className="grid justify-center items-center">
      <Spinner />
      <p className="text-xl text-primary-100">Loading cabin</p>
    </div>
  );
}

export default loading;
