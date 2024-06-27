import React, { Fragment, useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import SmallSpinner from "../../Components/Spinner/SmallSpinner";
import { getAllInviteUser } from "../../api/user";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { AuthContext } from "../../contexts/AuthProvider";
import { CalendarIcon } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import Ongoing from "./Ongoing";
import Done from "./Done";
import New from "./New";

const WorkspaceDetails = () => {
  const workDetails = useLoaderData();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoading(true);
    getAllInviteUser().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmails, setSelectedEmails] = useState({});

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const handleSelectEmail = (email) => {
    setSelectedEmails((prevSelectedEmails) => ({
      ...prevSelectedEmails,
      [email]: !prevSelectedEmails[email],
    }));
  };

  const InvitedWorkIds = workDetails._id;

  const handleMakeInvite = (id) => {
    const inviterEmail = workDetails.UserEmail;
    const invitedWorkId = workDetails.workId;
    const inviteWorkspaceName = workDetails.WorkspaceName;
    const inviteDateTime = new Date().toISOString(); // Get the current date and time

    const invitedEmail = Object.keys(selectedEmails).filter(
      (email) => selectedEmails[email]
    );

    fetch(`https://server-tawny-tau.vercel.app/users/sentInvite/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("aircnc-token")}`,
      },
      body: JSON.stringify({
        inviterEmail,
        invitedWorkId,
        inviteWorkspaceName,
        inviteDateTime,
        invitedEmail,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          toast.success("Invite sent successfully.");
          getUsers();
        }
      })
      .catch((error) => {
        console.error("Error sending invite:", error);
      });
  };

  const getSelectedEmails = () => {
    return Object.keys(selectedEmails).filter((email) => selectedEmails[email]);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };



  return (
    <div>
      <h1 className="text-4xl font-roboto  text-green-900">
        Work space name{" "}
        <span className="text-indigo-700 font-bold">
          : {workDetails.WorkspaceName}
        </span>
      </h1>
      <h1 className="text-xl font-roboto  text-green-900 mt-2">
        Work id{" "}
        <span className="text-indigo-900 font-bold">
          : {workDetails.workId}
        </span>
      </h1>
      <button
        className="px-4 py-2 bg-green-500 text-white my-10"
        onClick={() => setIsModalOpen(true)}
      >
        Invite Users +
      </button>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="rounded-lg z-40 bg-green-300 w-[600px] px-5  shadow-2xl transform overflow-hidden pb-10 pt-5 text-left align-middle  transition-all">
                  <div className="flex flex-col justify-center items-center">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by email"
                        className="mb-4 px-3 py-2 border rounded w-96"
                      />
                      {searchTerm && (
                        <>
                          <ul>
                            {getSelectedEmails().map((email) => (
                              <li
                                className="text-green-900 font-roboto"
                                key={email}
                              >
                                {email}
                              </li>
                            ))}
                          </ul>
                          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden w-96">
                            <table className="min-w-full leading-normal">
                              <tbody>
                                {filteredUsers.map((user, i) => (
                                  <tr key={i}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        {user.email}
                                      </p>
                                    </td>

                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <button
                                        onClick={() =>
                                          handleSelectEmail(user.email)
                                        }
                                      >
                                        {selectedEmails[user.email]
                                          ? "Deselect"
                                          : "Select"}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      <div className=" flex justify-end">
                        <button
                          onClick={() => handleMakeInvite(InvitedWorkIds)}
                          className="px-5 py-3 border-b   bg-green-700 hover:bg-green-900 text-white "
                        >
                          Invite Selected Users
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="grid grid-cols-3 gap-5">
           <New workDetails={workDetails}></New>
        <div className="w-full bg-green-500 rounded ">
           <Ongoing workDetails={workDetails}></Ongoing>
        </div>
        <div className="w-full  bg-green-500 rounded ">
            <Done workDetails={workDetails}></Done>
        </div>
      </div>
     
    </div>
  );
};

export default WorkspaceDetails;
