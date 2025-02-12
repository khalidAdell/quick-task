// TaskDetails.tsx
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegClock,
  FaRegStar,
  FaDollarSign,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const dummyTasks = [
  {
    id: 1,
    title: "Fix React Responsive Layout Issues",
    category: "Web Development",
    price: 250,
    description:
      "Need help fixing mobile responsiveness on a Next.js application. The current layout breaks on mobile devices and needs proper media queries implementation.",
    postedAt: "2023-07-25",
    deadline: "2023-08-01",
    bids: [
      { id: 1, bidder: "John D.", amount: 220, timestamp: "2023-07-26" },
      { id: 2, bidder: "Sarah M.", amount: 240, timestamp: "2023-07-27" },
    ],
    rating: 4.8,
    requirements: [
      "Proven React experience",
      "Responsive design portfolio",
      "Available for quick turnaround",
    ],
  },
  {
    id: 2,
    title: "Logo Design for Tech Startup",
    category: "Graphic Design",
    price: 150,
    description:
      "Modern and minimalist logo design required for new SaaS company.",
    postedAt: "2023-07-24",
    deadline: "2023-07-30",
    bids: [
      { id: 3, bidder: "Emily R.", amount: 140, timestamp: "2023-07-25" },
      { id: 4, bidder: "Michael B.", amount: 150, timestamp: "2023-07-26" },
    ],
    rating: 4.9,
    requirements: [
      "Experience in SaaS branding",
      "Portfolio of modern logo designs",
    ],
  },
  {
    id: 3,
    title: "WordPress Site Optimization",
    category: "Web Development",
    price: 180,
    description: "Speed optimization for existing WordPress site.",
    postedAt: "2023-07-23",
    deadline: "2023-07-29",
    bids: [
      { id: 5, bidder: "Liam W.", amount: 175, timestamp: "2023-07-24" },
      { id: 6, bidder: "Sophia K.", amount: 180, timestamp: "2023-07-25" },
    ],
    rating: 4.5,
    requirements: [
      "Expertise in WP performance tuning",
      "Experience with caching and CDNs",
    ],
  },
  {
    id: 4,
    title: "Write SEO-Friendly Blog Post",
    category: "Content Writing",
    price: 100,
    description: "Need a 1500-word blog post on AI trends with SEO keywords.",
    postedAt: "2023-07-22",
    deadline: "2023-07-28",
    bids: [
      { id: 7, bidder: "David P.", amount: 95, timestamp: "2023-07-23" },
      { id: 8, bidder: "Emma J.", amount: 100, timestamp: "2023-07-24" },
    ],
    rating: 4.7,
    requirements: [
      "Strong SEO writing skills",
      "Knowledge of AI industry trends",
    ],
  },
  {
    id: 5,
    title: "Customer Support Chatbot",
    category: "Tech Support",
    price: 300,
    description: "Develop a chatbot for customer support using OpenAI API.",
    postedAt: "2023-07-21",
    deadline: "2023-07-27",
    bids: [
      { id: 9, bidder: "Noah C.", amount: 290, timestamp: "2023-07-22" },
      { id: 10, bidder: "Olivia H.", amount: 300, timestamp: "2023-07-23" },
    ],
    rating: 4.6,
    requirements: ["Experience with AI chatbots", "Knowledge of OpenAI API"],
  },
];

const TaskDetails = () => {
  const { taskId } = useParams();

  const task = dummyTasks.find((t) => t.id === Number(taskId));

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
                  {task.rating} ({task.bids.length} bids)
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

                <button className="w-full bg-[#F4B860] hover:bg-[#e3a24f] text-white py-3 rounded-lg mt-6 transition">
                  Place Bid
                </button>
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
                        <h4 className="font-medium">{bid.bidder}</h4>
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
    </div>
  );
};

export default TaskDetails;
