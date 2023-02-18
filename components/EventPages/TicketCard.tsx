
export const TicketCard = () => {
  return <div>
      <h1 className="mt-12 text-xl font-semibold sm:text-2xl ">
        Ticket Options (Types)
      </h1>
      <div className="py-4 sm:py-8">
        <div className="center card flex items-center justify-between gap-6 border-2 border-gray-200 bg-white p-6 lg:card-side">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-xl font-bold text-gray-700">Ticket Name</h1>
            <span>
              <p className="text-md font-semibold text-blue-600">Ticket Type</p>
              <p className="text-sn text-gray-700">Premium</p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-600">Price</p>
              <p className="text-sn text-gray-700">$999</p>
            </span>
            <span className="flex gap-4">
              <p className="text-md font-semibold text-gray-700">
                Sale Duration
              </p>
              <p className="text-sn text-gray-700">placeholder</p>
            </span>
            <span className="flex gap-4">
              <p className="text-md font-semibold text-gray-700">Event Date</p>
              <p className="text-sn text-gray-700">placeholder</p>
            </span>
            <span className="flex gap-4">
              <p className="text-md font-semibold text-gray-700">
                Event Location
              </p>
              <p className="text-sn text-gray-700">placeholder</p>
            </span>
            <span className="mt-6 flex flex-col gap-4">
              <p className="text-md text-blue-600">
                Perks of owning this ticket:
              </p>
              <p className="text-sn text-gray-700">• Access to...</p>
            </span>
          </div>
        </div>
      </div>
    </div>;
};
  