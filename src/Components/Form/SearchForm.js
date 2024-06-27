import React, { useState } from "react";
import PrimaryButton from "../Button/PrimaryButton";
import { CalendarIcon } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";

const SearchForm = () => {
  const [location, setLocation] = useState("Dhaka");
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(
    new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000)
  );

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const query = {
      location: location,
      from: arrivalDate,
      to: departureDate,
    };
    console.log(query);
    navigate("/search-result", { state: query });
  };

  return (
    <div className="w-full">
      {/* <p className='text-md  font-semibold text-orange-500'>
        Where do you want to go
      </p> */}

      <form onSubmit={handleSubmit} className="rounded-lg bg-white ">
        <div className="mt-6 flex flex-row gap-5 bg-white p-5 ">
          <div className=" border-custom-dark border-r-2 my-2 p-3 w-[400px]">
            <p className=" text-center font-marcellus text-sm text-gray-500">
              Location
            </p>

            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              name="location"
              required
              placeholder="Add city, Landmark or address"
              className="block w-full border-2 border-gray-200 mt-2 font-jost p-1 text-gray-700 text-center bg-white   focus:border-indigo-800 focus:ring-indigo-800 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="flex justify-between gap-5">
            <div className=" my-2 p-3 flex justify-between items-center border-custom-dark border-r-2">
              <div className="flex justify-center items-center flex-col">
                <p className="block text-center  text-sm text-gray-500 font-marcellus">
                  Arrival
                </p>
                <DatePicker
                  selected={arrivalDate}
                  onChange={(date) => setArrivalDate(date)}
                  className="w-full text-black text-center mt-2 font-jost"
                />
              </div>
            </div>
            <div className=" my-2 p-3 flex justify-between items-center border-custom-dark border-r-2">
              <div>
                <p className="block text-center text-sm text-gray-500 font-marcellus">
                  Departure
                </p>
                <DatePicker
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date)}
                  className="w-full text-black text-center mt-2 font-jost "
                />
              </div>
            </div>
            <div className="flex justify-center items-center">
              <PrimaryButton
                type="submit"
                classes="w-full px-24 py-6 font-roboto tracking-wide transition-colors duration-300 transform "
              >
                Search
              </PrimaryButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
