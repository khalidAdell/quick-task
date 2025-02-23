import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegClock,
  FaRegStar,
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { formatDistanceToNow, isValid } from "date-fns";
import { db, auth } from "../lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { Bid, Task } from "../types/types";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { fetchWithAuth } from "../lib/api";

// Call this after selecting a bidder

const TaskDetails = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);
  const [editingBidId, setEditingBidId] = useState<string | null>(null);

  const sendNotification = async (bidderId: string, taskId: string) => {
    try {
      await addDoc(collection(db, "notifications"), {
        userId: bidderId,
        taskId: taskId,
        message: "Your bid has been selected!",
        read: false,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const taskRef = doc(db, "tasks", taskId);
    const unsubscribe = onSnapshot(
      taskRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const taskData = snapshot.data() as Omit<Task, "id">;

          const postedAt = taskData.postedAt?.toDate
            ? taskData.postedAt.toDate()
            : new Date(taskData.postedAt);

          const deadline = new Date(taskData.deadline);

          setTask({
            ...taskData,
            id: snapshot.id,
            postedAt: isValid(postedAt) ? postedAt : new Date(),
            deadline: isValid(deadline) ? deadline : new Date(),
            status: taskData.status || "open",
            winningBid: taskData.winningBid || undefined,
          });
          setLoading(false);
        } else {
          setError("Task not found");
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message || "Error fetching task");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [taskId]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !task || !auth.currentUser) return;

    if (auth.currentUser.uid === task.ownerId) {
      setError("You cannot bid on your own task.");
      return;
    }

    const hasAlreadyBid = task.bids.some(
      (bid) => bid.bidderId === auth.currentUser?.uid
    );
    if (hasAlreadyBid && !editingBidId) {
      setError("You have already placed a bid on this task.");
      return;
    }

    try {
      const bid: Bid = {
        id: editingBidId || Date.now().toString(),
        bidderId: auth.currentUser.uid,
        bidderName: auth.currentUser.displayName || "Anonymous",
        bidderPhotoURL: auth.currentUser.photoURL || "",
        amount: Number(bidAmount),
        timestamp: new Date().toISOString(),
      };

      const taskRef = doc(db, "tasks", taskId);

      if (editingBidId) {
        const updatedBids = task.bids.filter((b) => b.id !== editingBidId);
        await updateDoc(taskRef, {
          bids: [...updatedBids, bid],
        });
      } else {
        await updateDoc(taskRef, {
          bids: arrayUnion(bid),
          bidsCount: (task.bidsCount || 0) + 1,
        });
      }

      setShowBidForm(false);
      setBidAmount("");
      setEditingBidId(null);
    } catch (err) {
      console.error("Failed to submit bid:", err);
      setError("Failed to submit bid");
    }
  };

  const handleDeleteBid = async (bidId: string) => {
    if (!taskId || !auth.currentUser) return;

    try {
      const taskRef = doc(db, "tasks", taskId);
      const updatedBids = task?.bids.filter((bid) => bid.id !== bidId) || [];
      await updateDoc(taskRef, {
        bids: updatedBids,
        bidsCount: updatedBids.length,
      });
    } catch (err) {
      console.error("Failed to delete bid:", err);
      setError("Failed to delete bid");
    }
  };

  const handleEditBid = (bidId: string) => {
    const bidToEdit = task?.bids.find((bid) => bid.id === bidId);
    if (bidToEdit) {
      setBidAmount(bidToEdit.amount.toString());
      setEditingBidId(bidId);
      setShowBidForm(true);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId || !auth.currentUser || auth.currentUser.uid !== task?.ownerId)
      return;

    try {
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);
      navigate("/tasks");
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task");
    }
  };

  const handleSelectBid = async (bidId: string) => {
    if (!taskId || !auth.currentUser || auth.currentUser.uid !== task?.ownerId)
      return;

    const selectedBid = task.bids.find((bid) => bid.id === bidId);
    if (!selectedBid) return;

    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: "assigned",
        winningBid: selectedBid,
        assignedTo: selectedBid.bidderId,
      });
      sendNotification(selectedBid.bidderId, taskId);
    } catch (err) {
      console.error("Failed to select bid:", err);
      setError("Failed to select bid");
    }
  };

  const renderWinningBid = () => {
    if (!task?.winningBid) return null;

    return (
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Selected Bidder</h2>
        <div className="flex items-center gap-3">
          {task.winningBid.bidderPhotoURL && (
            <img
              src={task.winningBid.bidderPhotoURL}
              alt={task.winningBid.bidderName}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h4 className="font-medium">{task.winningBid.bidderName}</h4>
            <p className="text-sm text-gray-500">
              Winning Amount: ${task.winningBid.amount}
            </p>
            <p className="text-sm text-gray-500">
              Selected{" "}
              {formatDistanceToNow(new Date(task.winningBid.timestamp))} ago
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderBidActions = (bid: Bid) => {
    if (auth.currentUser?.uid === task?.ownerId && task?.status === "open") {
      return (
        <button
          onClick={() => handleSelectBid(bid.id)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-2"
        >
          <FaCheck /> Select
        </button>
      );
    }

    if (bid.id === task?.winningBid?.id) {
      return (
        <span className="bg-green-500 text-white px-3 py-1 rounded-lg">
          Selected
        </span>
      );
    }

    if (auth.currentUser?.uid === bid.bidderId) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditBid(bid.id)}
            className="text-blue-500 hover:text-blue-600"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteBid(bid.id)}
            className="text-red-500 hover:text-red-600"
          >
            <FaTrash />
          </button>
        </div>
      );
    }

    return null;
  };

  const renderBids = () => {
    if (task?.bids.length === 0) {
      return (
        <div className="text-gray-500 py-4">No bids yet - be the first!</div>
      );
    }

    return (
      <div className="space-y-4">
        {task?.bids.map((bid) => (
          <div
            key={bid.id}
            className={`bg-gray-50 rounded-lg p-4 border ${
              bid.id === task.winningBid?.id
                ? "border-green-300 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {bid.bidderPhotoURL && (
                  <img
                    src={bid.bidderPhotoURL}
                    alt={bid.bidderName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-medium">{bid.bidderName}</h4>
                  <p className="text-sm text-gray-500">
                    {isValid(new Date(bid.timestamp))
                      ? `${formatDistanceToNow(new Date(bid.timestamp))} ago`
                      : "Invalid date"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#F4B860]">
                <FaDollarSign />
                <span className="font-bold">{bid.amount}</span>
                {renderBidActions(bid)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleCompleteTask = async () => {
    if (!taskId || !auth.currentUser) return;

    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: "completed",
      });
      // Send notification to task owner
      await addDoc(collection(db, "notifications"), {
        userId: task?.ownerId,
        taskId: taskId,
        message: "Your task has been completed!",
        read: false,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };

  const renderTaskStatus = () => {
    if (!task) return null;

    const statusColors = {
      open: "bg-blue-100 text-blue-800",
      assigned: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          statusColors[task.status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {task.status.toUpperCase()}
      </span>
    );
  };

  const [processingPayment, setProcessingPayment] = useState(false);

  const handleCompletePayment = async () => {
    if (!taskId || !task?.winningBid) return;

    setProcessingPayment(true);
    try {
      // Call Strapi payment endpoint
      const response = await fetchWithAuth(`/api/payments`, {
        method: "POST",
        body: JSON.stringify({
          taskId,
          amount: task.winningBid.amount,
          recipientId: task.winningBid.bidderId,
          currency: "USD",
        }),
      });

      if (!response.ok) throw new Error("Payment failed");

      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        paymentStatus: "completed",
        status: "closed",
      });

      await Promise.all([
        addDoc(collection(db, "notifications"), {
          userId: task.ownerId,
          message: "Payment successfully processed!",
          read: false,
          timestamp: serverTimestamp(),
        }),
        addDoc(collection(db, "notifications"), {
          userId: task.winningBid.bidderId,
          message: `Payment of $${task.winningBid.amount} received!`,
          read: false,
          timestamp: serverTimestamp(),
        }),
      ]);
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment processing failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4B860]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link to="/tasks" className="text-[#F4B860] hover:text-[#e3a24f]">
            Browse available tasks
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <Link to="/tasks" className="text-[#F4B860] hover:text-[#e3a24f]">
            Browse available tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/tasks"
          className="inline-flex items-center text-[#F4B860] hover:text-[#e3a24f] mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to Tasks
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {task.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {renderTaskStatus()}
                <span className="bg-[#F4B860]/10 text-[#F4B860] px-3 py-1 rounded-full">
                  {task.category}
                </span>
                <span className="flex items-center gap-1">
                  <FaRegStar className="text-[#F4B860]" />
                  {task.rating} ({task.bidsCount} bids)
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-2xl font-bold text-[#F4B860]">
              ${task.price}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {task.description}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2">
                  {task.requirements.map((req, index) => (
                    <li key={index} className="text-gray-600">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Task Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaRegClock className="flex-shrink-0" />
                    <div>
                      <p className="text-sm">Posted</p>
                      <p className="font-medium">
                        {isValid(task.postedAt)
                          ? `${formatDistanceToNow(task.postedAt)} ago`
                          : "Invalid date"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaRegClock className="flex-shrink-0" />
                    <div>
                      <p className="text-sm">Deadline</p>
                      <p className="font-medium">
                        {isValid(task.deadline)
                          ? `${formatDistanceToNow(task.deadline)} left`
                          : "Invalid date"}
                      </p>
                    </div>
                  </div>
                  {auth.currentUser?.uid === task?.assignedTo &&
                    task?.status === "assigned" && (
                      <button
                        onClick={handleCompleteTask}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Finish Task
                      </button>
                    )}
                </div>

                {auth.currentUser &&
                  auth.currentUser.uid !== task.ownerId &&
                  task.status === "open" && (
                    <button
                      onClick={() => setShowBidForm(true)}
                      className="w-full bg-[#F4B860] hover:bg-[#e3a24f] text-white py-3 rounded-lg mt-6 transition"
                    >
                      Place Bid
                    </button>
                  )}

                {auth.currentUser?.uid === task.ownerId &&
                  task.status !== "completed" && (
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => navigate(`/tasks/${taskId}/edit`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteTask}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                {auth.currentUser?.uid === task.ownerId &&
                  task.status === "completed" &&
                  !task.paymentStatus && (
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={handleCompletePayment}
                        disabled={processingPayment}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        {processingPayment
                          ? "Processing..."
                          : "Release Payment"}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Current Bids</h2>
            {renderBids()}
            {renderWinningBid()}
          </div>
        </div>
      </div>

      {showBidForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingBidId ? "Edit Bid" : "Place a Bid"}
            </h3>
            <form onSubmit={handleBidSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Bid Amount ($)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBidForm(false);
                    setEditingBidId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#F4B860] hover:bg-[#e3a24f] text-white rounded-lg"
                >
                  {editingBidId ? "Update Bid" : "Submit Bid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
