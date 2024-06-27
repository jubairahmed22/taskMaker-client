import React from "react";

const TaskCard = ({
  comment,
  user,
  capitalizeFirstWord,
  handleMakeOngoing,
  handleMakeDone,
  timeSince,
  handleRemoveItem,
}) => {

    const taskEndDate = new Date(comment.taskEndDate);
    const currentDate = new Date();
  
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(currentDate.getTime() - taskEndDate.getTime());
  
    // Check if the time difference is less than or equal to 5 seconds (5000 milliseconds)
    const isWithin5Seconds = timeDifference <= 5000;

    console.log(isWithin5Seconds);
    console.log("Time Difference:", timeDifference);

  return (
    <div className={`card ${isWithin5Seconds ? " border-red-700 border-2 bg-blue-500" : "bg-white"}`}>
      <p className="cmntName">{taskEndDate.toLocaleString()}</p>
      <div className="bg-gray-100 flex flex-row justify-between rounded px-5 py-2 mt-2">
        <div>
          <p className="cmntName">{comment.taskGiver}</p>
          <p className="cmntName">
            {new Date(comment.taskEndDate).toLocaleString()}
          </p>
          <p className="cmnt mt-2"> {capitalizeFirstWord(comment.task)}</p>
        </div>
        <div>
          <button className="" onClick={() => handleMakeOngoing(comment._id)}>
            Ongoing
          </button>
          <button className="ml-5" onClick={() => handleMakeDone(comment._id)}>
            Done
          </button>
        </div>
        <div>
          <div className="mr-3">
            <h1>
              <p className="comment-time">{timeSince(comment.postedDate)}</p>
            </h1>
          </div>
          <div>
            {comment.taskGiver === user.email ? (
              <button
                className="btnDelete mt-2"
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
    </div>
  );
};

export default TaskCard;
