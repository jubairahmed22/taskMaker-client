import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthProvider";
import SmallSpinner from "../../Components/Spinner/SmallSpinner";
import DatePicker from "react-datepicker";
import taskCard from "./TaskCard";
import TaskCard from "./TaskCard";

const New = ({ workDetails }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useContext(AuthContext);

  const [NewTask, setNewTask] = useState([]);

  const fetchNewTask = async () => {
    try {
      const response = await fetch("https://server-tawny-tau.vercel.app/taskNewData");
      const data = await response.json();
      setNewTask(data.reverse());
    } catch (error) {
      console.error("Error fetching NewTask:", error);
    }
  };

  useEffect(() => {
    fetchNewTask();
  }, []);

  const [message, setMessage] = useState("");
  ////////// date
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
  );

  const handleSubmit = () => {
    const newDate = new Date();
    const updatedFormData = {
      postedDate: newDate.toDateString() + " " + newDate.toLocaleTimeString(), // Combine date and time
      task: message,
      inviterEmail: workDetails.UserEmail,
      invitedWorkId: workDetails.workId,
      inviteWorkspaceName: workDetails.WorkspaceName,
      taskGiver: user?.email,
      taskMove: "new",
      taskStartDate: startDate,
      taskEndDate: endDate,
    };

    // Set loading state to true
    setIsUploading(true);
    console.log(updatedFormData);

    fetch("https://server-tawny-tau.vercel.app/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        console.log("Response from server:", data);

        // Show a success toast
        toast.success("Your task added successfully!");
        setNewTask((prevComments) => [data, ...prevComments]);
        fetchNewTask();
      })
      .catch((error) => {
        console.error("Error sending POST request:", error);
      })
      .finally(() => {
        // Set loading state to false after the request is completed
        setIsUploading(false);
        setMessage("");
      });
  };

  const IdNewTask = NewTask.filter(
    (Apply) => Apply.invitedWorkId === workDetails?.workId
  );

  function capitalizeFirstWord(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleRemoveItem = (id) => {
    const proceed = window.confirm("Are you sure, you want to delete the task");
    if (proceed) {
      fetch(`https://server-tawny-tau.vercel.app/task/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            fetchNewTask();
            // alert('deleted successfully');

            // const remaining = Users.filter((odr) => odr._id !== id);
            // setUsers(remaining);
          }
        });
    }
  };

  const timeSince = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const secondsPast = (now - commentDate) / 1000;

    if (secondsPast < 60) {
      return `${parseInt(secondsPast)}s ago`;
    }
    if (secondsPast < 3600) {
      return `${parseInt(secondsPast / 60)}m ago`;
    }
    if (secondsPast <= 86400) {
      return `${parseInt(secondsPast / 3600)}h ago`;
    }
    // Format for over a day
    const day = commentDate.getDate();
    const month = commentDate
      .toDateString()
      .match(/ [a-zA-Z]*/)[0]
      .replace(" ", "");
    const year =
      commentDate.getFullYear() === now.getFullYear()
        ? ""
        : ` ${commentDate.getFullYear()}`;
    return `${day} ${month}${year}`;
  };

  const handleMakeOngoing = (id) => {
    fetch(`https://server-tawny-tau.vercel.app/task/ongoing/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          toast.success("Make admin successful.");

          fetchNewTask();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occur during the request
      });
  };

  const handleMakeDone = (id) => {
    fetch(`https://server-tawny-tau.vercel.app/task/done/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          toast.success("Done successful.");

          fetchNewTask();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occur during the request
      });
  };
  return (
    <div>
      <div className="w-full  bg-green-500 rounded p-5">
        <h1 className="text-white text-xl  font-roboto font-bold mx-5 my-5">
          New
        </h1>
        <div>
          <div className=" mt-3 ">
            {IdNewTask.map((comment, index) => (
              <div className="bg-gray-100 flex flex-col my-5 rounded">
                <div className=" flex flex-row justify-between rounded px-5 py-2 mt-2">
                  <div>
                    <p className="text-green-800 text-sm font-bold font-roboto">
                      User: {comment.taskGiver}
                    </p>
                    <p className="text-green-600 text-sm font-roboto">
                      Start Date:{" "}
                      {new Date(comment.taskStartDate).toLocaleString()}
                    </p>
                    <p className="text-green-600 text-sm font-roboto">
                      End Date: {new Date(comment.taskEndDate).toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <button
                        className="bg-green-800 hover:bg-green-900 text-white font-roboto px-2 py-1 rounded-lg"
                        onClick={() => handleMakeOngoing(comment._id)}
                      >
                        Ongoing
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white font-roboto px-2 py-1 rounded-lg ml-2"
                        onClick={() => handleMakeDone(comment._id)}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between flex-row">
                    <div className="mr-1">
                      <h1>
                        <p className="comment-time">
                          {timeSince(comment.postedDate)}
                        </p>
                      </h1>
                    </div>
                    <div>
                      {comment.taskGiver === user.email ? (
                        <button
                          className="px-3 py-1 rounded-xl text-sm bg-green-500 "
                          onClick={() => handleRemoveItem(comment._id)}
                        >
                          Delete
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="py-2 px-2 mt-2 w-full bg-gray-300 rounded">
                  <p className=" text-md font-roboto ">
                    {" "}
                    {capitalizeFirstWord(comment.task)}
                  </p>
                </div>
              </div>
              // <TaskCard
              // comment={comment}
              // user={user}
              // capitalizeFirstWord={capitalizeFirstWord}
              // handleMakeOngoing={handleMakeOngoing}
              // handleMakeDone={handleMakeDone}
              // timeSince={timeSince}
              // handleRemoveItem={handleRemoveItem}
              // ></TaskCard>
            ))}
          </div>
          <div className="bg-green-100 rounded-lg p-5 my-5 sticky bottom-0">
            <textarea
              id="message"
              rows="4"
              class="block p-2.5 w-full bg-white mt-3 text-sm font-roboto"
              placeholder="Write your task..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div className="shadow-md rounded-md my-2 p-3 flex justify-between items-center bg-white">
              <div>
                <p className="block text-sm text-gray-500">Start Date</p>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="w-2/3"
                  showTimeSelect
                />
              </div>
              <div>
                <p className="block text-sm text-gray-500">End Date</p>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  className="w-2/3"
                />
              </div>
              <button
                onClick={handleSubmit}
                className=" text-white text-roboto buttonPost bg-green-500 hover:bg-green-700 px-5 py-3"
              >
                {isUploading ? <SmallSpinner></SmallSpinner> : "Post"}
              </button>

              {/* text field end     */}
            </div>
          </div>
          {/* task end  */}
        </div>
      </div>
    </div>
  );
};

export default New;
