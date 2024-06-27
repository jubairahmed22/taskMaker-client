import React, { Fragment, useContext, useEffect, useState } from "react";
import CreateWorspaceForm from "../../Components/Form/CreateWorspaceForm";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import { addHome, deleteHome } from "../../api/services";
import toast from "react-hot-toast";
import "./WorkSpace.css";
import DeleteModal from "../../Components/Modal/DeleteModal";
import { Dialog, Transition } from "@headlessui/react";
import { set } from "date-fns";

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [WorkSpaceType, setWorkSpaceType] = useState("");
  const [preview, setPreview] = useState([]);
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(
    new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModal] = useState(false);

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const generateRandomLink = () => {
    return Math.random().toString(36).substr(2, 8);
  };

  const [WorkSpaceData, setWorkSpaceData] = useState([]);

  const fetchData = async () => {
    const UserEmail = user?.email; // Ensure this variable has the correct email value.
    const url = `https://server-tawny-tau.vercel.app/works/${UserEmail}`;
    console.log("url", url);
    const res = await fetch(url);
    const data = await res.json();
    setWorkSpaceData(data);
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  console.log(WorkSpaceData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const WorkspaceName = event.target.WorkspaceName.value;
    const WorkSpaceTypes = WorkSpaceType;
    const WorkspaceDescription = event.target.WorkspaceDescription.value;
    const UserEmail = user?.email;
    const workId = generateRandomId();
    const workLink = generateRandomLink();

    setLoading(true);

    try {
      const homeData = {
        WorkspaceName,
        WorkSpaceTypes,
        WorkspaceDescription,
        UserEmail,
        workId,
        workLink,
        user: {
          name: user?.displayName,
          image: user?.photoURL,
          email: user?.email,
        },
      };

      await addHome(homeData);

      setLoading(false);
      toast.success("Workspace added!");
      setIsModalOpen(false); // Close the modal after successful submission
      navigate("/dashboard/create-workspace");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openModal = (id) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedId(null);
  };
  const closeInviteModal = () => {
    setInviteModal(false);
  };

  const modalHandler = (id) => {
    deleteHome(id)
      .then((data) => {
        console.log(data);
        fetchData();
        toast.success("Home deleted");
      })
      .catch((err) => console.log(err));
    closeModal();
  };

  // /////////////////////// Invited data see

  const [invitedData, setInvitedData] = useState([]);

  const fetchInvitedData = async () => {
    const userEmail = user?.email; // Ensure this variable has the correct email value.
    const url = `https://server-tawny-tau.vercel.app/worksInvited/${userEmail}`;
    console.log("url", url);
    const res = await fetch(url);
    const data = await res.json();
    setInvitedData(data);
  };

  useEffect(() => {
    fetchInvitedData();

    const intervalId = setInterval(() => {
      fetchInvitedData();
    }, 1000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  //////////////// ACCEPTED DATA START

  const [AcceptedData, setAcceptedData] = useState([]);

  const fetchAcceptedData = async () => {
    const userEmail = user?.email; // Ensure this variable has the correct email value.
    const url = `https://server-tawny-tau.vercel.app/acceptedEmails/${userEmail}`;
    console.log("url", url);
    const res = await fetch(url);
    const data = await res.json();
    setAcceptedData(data);
  };

  useEffect(() => {
    fetchAcceptedData();

    const intervalId = setInterval(() => {
      fetchAcceptedData();
    }, 1000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  //////////////// ACCEPTED DATA END

  const handleMakeAccept = (id) => {
    const acceptInviteDateTime = new Date().toISOString();
    const acceptedEmail = [user?.email]; // Wrap email in an array

    fetch(`https://server-tawny-tau.vercel.app/users/sentAccepted/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("aircnc-token")}`,
      },
      body: JSON.stringify({
        acceptInviteDateTime,
        acceptedEmail,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          toast.success("Accept invite successfully.");
        }
      })
      .catch((error) => {
        console.error("Error sending invite:", error);
      });
  };

  return (
    <div>
      <div className="flex justify-start">
        <button
          className="px-4 py-2 bg-green-500 text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Create Work Space +
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white ml-5"
          onClick={() => setInviteModal(true)}
        >
          New Invitation
        </button>
      </div>

     <div className="bg-gray-300 p-5 mt-5">
      <h1 className="my-5 text-xl font-bold font-roboto text-green-900">My Work space</h1>
     {WorkSpaceData.length > 0 ? (
        <div className="grid grid-cols-4 gap-5 my-10">
          {WorkSpaceData.map((work) => (
            <div
              className="w-[380px]  bg-green-500 hover:bg-green-700 rounded p-5"
              key={work.workId}
            >
              <Link to={`/dashboard/workspace-details/${work?._id}`}>
                <div>
                  <h1 className="text-xl font-roboto font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">Work Space Name : {work.WorkspaceName}</h1>
                  <h1 className="textlg font-roboto text-green-100">{work.WorkspaceDescription}</h1>
                  <h1 className="text-md font-roboto text-green-100">Work Id:  {work.workId}</h1>
                </div>
              </Link>
              <div className="flex justify-end">
                <span
                  onClick={() => openModal(work._id)}
                  className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                  ></span>
                  <span className="relative">Delete</span>
                </span>
                <DeleteModal
                  isOpen={isOpen}
                  closeModal={closeModal}
                  modalHandler={() => modalHandler(selectedId)}
                  id={selectedId}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-min text-4xl font-roboto">
          <button
          className="px-4 py-2 bg-green-500 text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Create Work Space +
        </button>
        </div>
      )}
     </div>
     <div className="bg-gray-300 p-5 my-5">
     <h1 className="my-5 text-xl font-bold font-roboto text-green-900">Accepted Work space</h1>
     {AcceptedData.length > 0 ? (
        <div className="grid grid-cols-4 gap-5 my-10">
          {AcceptedData.map((work) => (
          <div
          className="w-[380px]  bg-green-500 hover:bg-green-700 rounded p-5"
          key={work.workId}
        >
          <Link to={`/dashboard/workspace-details/${work?._id}`}>
            <div>
              <h1 className="text-xl font-roboto font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">Work Space Name : {work.WorkspaceName}</h1>
              <h1 className="textlg font-roboto text-green-100">{work.WorkspaceDescription}</h1>
              <h1 className="text-md font-roboto text-green-100">Work Id:  {work.workId}</h1>
            </div>
          </Link>
          <div className="flex justify-end">
            <span
              onClick={() => openModal(work._id)}
              className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
              ></span>
              <span className="relative">Delete</span>
            </span>
            <DeleteModal
              isOpen={isOpen}
              closeModal={closeModal}
              modalHandler={() => modalHandler(selectedId)}
              id={selectedId}
            />
          </div>
        </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-min text-4xl font-roboto">
          "no accepted workspace"
        </div>
      )}
     </div>

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
                  <div className=" ">
                    <div className="">
                      <div className="flex  justify-between">
                        <div className="flex justify-center items-center w-full">
                          <h1 className="text-xl text-green-900">
                            Create Workspace
                          </h1>
                        </div>
                        <button
                          className="bg-green-700 rounded hover:bg-green-900 px-4 py-2 text-white"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Close
                        </button>
                      </div>
                      <CreateWorspaceForm
                        handleSubmit={handleSubmit}
                        loading={loading}
                        preview={preview}
                        setWorkSpaceType={setWorkSpaceType}
                        WorkSpaceType={WorkSpaceType}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={isInviteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeInviteModal}>
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
                  <div className=" ">
                    <div className="">
                      <div className="flex  justify-between">
                        <div className="flex justify-center items-center w-full">
                          <h1 className="text-xl text-green-900">Invitation</h1>
                        </div>
                        <button
                          className="bg-green-700 rounded hover:bg-green-900 px-4 py-2 text-white"
                          onClick={() => setInviteModal(false)}
                        >
                          Close
                        </button>
                      </div>
                      {invitedData.length > 0 ? (
                        <div className="mt-5">
                          {invitedData.map((work) => (
                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden w-96">
                              <table className="min-w-full leading-normal">
                                <tbody>
                                  <tr>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        {work.WorkspaceName}
                                      </p>
                                    </td>

                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      {work.workId}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      {work.workLink}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <button
                                        className="bg-green-500 px-4 py-2 text-white"
                                        onClick={() =>
                                          handleMakeAccept(work._id)
                                        }
                                      >
                                        Accept
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-min text-4xl font-roboto">
                          <h1 className="text-center">No Invitation</h1>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CreateWorkspace;
