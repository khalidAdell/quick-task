import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegClock,
  FaRegStar,
  FaDollarSign,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { db, auth } from "../lib/firebase";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { Bid, Task } from "../types/types";

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const taskRef = doc(db, "tasks", taskId);
    const unsubscribe = onSnapshot(
      taskRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const taskData = snapshot.data() as Task;
          setTask({ ...taskData, id: snapshot.id });
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

    try {
      const bid: Bid = {
        id: Date.now().toString(),
        bidderId: auth.currentUser.uid,
        bidderName: auth.currentUser.displayName || "Anonymous",
        amount: Number(bidAmount),
        timestamp: new Date().toISOString(),
      };

      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        bids: arrayUnion(bid),
        bidsCount: task.bidsCount + 1,
      });

      setShowBidForm(false);
      setBidAmount("");
    } catch (err) {
      setError("Failed to submit bid");
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
          {/* Task Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {task.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
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

          {/* Task Details Grid */}
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

            {/* Timeline & Action Card */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Task Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaRegClock className="flex-shrink-0" />
                    <div>
                      <p className="text-sm">Posted</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(task.postedAt))} ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaRegClock className="flex-shrink-0" />
                    <div>
                      <p className="text-sm">Deadline</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(task.deadline))} left
                      </p>
                    </div>
                  </div>
                </div>

                {auth.currentUser && (
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="w-full bg-[#F4B860] hover:bg-[#e3a24f] text-white py-3 rounded-lg mt-6 transition"
                  >
                    Place Bid
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bids Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Bids</h2>
            {task.bids.length > 0 ? (
              <div className="space-y-4">
                {task.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{bid.bidderName}</h4>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(bid.timestamp))} ago
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[#F4B860]">
                        <FaDollarSign />
                        <span className="font-bold">{bid.amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 py-4">
                No bids yet - be the first!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bid Form Modal */}
      {showBidForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Place a Bid</h3>
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
                  onClick={() => setShowBidForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#F4B860] hover:bg-[#e3a24f] text-white rounded-lg"
                >
                  Submit Bid
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
