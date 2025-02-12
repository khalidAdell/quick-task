import { Link } from "react-router-dom";
import { FaRegClock, FaRegStar } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const TaskCard = ({ task }: { task: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[#F4B860]/30 text-[#eba63f] font-medium px-3 py-1 rounded-full text-sm">
              {task.category}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaRegStar className="text-[#F4B860]" />
              <span>{task.rating}</span>
              <span className="text-gray-300">•</span>
              <span>{task.bids} bids</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <Link to={`/tasks/${task.id}`} className="hover:text-[#F4B860]">
              {task.title}
            </Link>
          </h3>
          <p className="text-gray-600 mb-4">{task.description}</p>
        </div>
        <div className="md:w-48 flex flex-col items-start md:items-end gap-2">
          <div className="text-2xl font-bold text-[#F4B860]">${task.price}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <FaRegClock />
            <span>{formatDistanceToNow(new Date(task.postedAt))} ago</span>
          </div>
          <Link
            to={`/tasks/${task.id}`}
            className="w-full md:w-auto bg-[#F4B860] hover:bg-[#e3a24f] text-white px-6 py-2 rounded-lg transition"
          >
            Place Bid
          </Link>
        </div>
      </div>
    </div>
  );
};
export default TaskCard;
