const dummyTasks = [
  {
    id: 1,
    title: "Fix React Responsive Layout Issues",
    category: "Web Development",
    price: 250,
    description:
      "Need help fixing mobile responsiveness on a Next.js application",
    postedAt: "2023-07-25",
    deadline: "2023-08-01",
    bids: 4,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Logo Design for Tech Startup",
    category: "Graphic Design",
    price: 150,
    description:
      "Modern and minimalist logo design required for new SaaS company",
    postedAt: "2023-07-24",
    deadline: "2023-07-30",
    bids: 7,
    rating: 4.9,
  },
  {
    id: 3,
    title: "WordPress Site Optimization",
    category: "Web Development",
    price: 180,
    description: "Speed optimization for existing WordPress site",
    postedAt: "2023-07-23",
    deadline: "2023-07-29",
    bids: 2,
    rating: 4.5,
  },
  {
    id: 4,
    title: "Write SEO-Friendly Blog Post",
    category: "Content Writing",
    price: 100,
    description: "Need a 1500-word blog post on AI trends with SEO keywords",
    postedAt: "2023-07-22",
    deadline: "2023-07-28",
    bids: 5,
    rating: 4.7,
  },
  {
    id: 5,
    title: "Customer Support Chatbot",
    category: "Tech Support",
    price: 300,
    description: "Develop a chatbot for customer support using OpenAI API",
    postedAt: "2023-07-21",
    deadline: "2023-07-27",
    bids: 6,
    rating: 4.6,
  },
  {
    id: 6,
    title: "Redesign Landing Page UI",
    category: "Graphic Design",
    price: 200,
    description: "Redesign the homepage of an e-commerce store for a better UX",
    postedAt: "2023-07-20",
    deadline: "2023-07-26",
    bids: 3,
    rating: 4.8,
  },
  {
    id: 7,
    title: "Fix JavaScript Bug in Checkout System",
    category: "Web Development",
    price: 120,
    description:
      "Bug in Stripe payment integration causing failed transactions",
    postedAt: "2023-07-19",
    deadline: "2023-07-25",
    bids: 4,
    rating: 4.5,
  },
  {
    id: 8,
    title: "Proofread and Edit Website Content",
    category: "Content Writing",
    price: 80,
    description: "Proofread and refine text for clarity and professionalism",
    postedAt: "2023-07-18",
    deadline: "2023-07-24",
    bids: 2,
    rating: 4.9,
  },
  {
    id: 9,
    title: "Configure AWS Server for App Deployment",
    category: "Tech Support",
    price: 350,
    description:
      "Set up and optimize an EC2 instance for a high-traffic web app",
    postedAt: "2023-07-17",
    deadline: "2023-07-23",
    bids: 5,
    rating: 4.7,
  },
  {
    id: 10,
    title: "Create Social Media Graphics",
    category: "Graphic Design",
    price: 130,
    description: "Design 10 engaging Instagram and LinkedIn post templates",
    postedAt: "2023-07-16",
    deadline: "2023-07-22",
    bids: 3,
    rating: 4.6,
  },
];
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Filters from "../components/Filters";
import TaskList from "../components/TaskList";

const TASKS_PER_PAGE = 5;

const TasksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL, default to 1
  const currentPage = Number(searchParams.get("page")) || 1;

  // Filtering and sorting logic
  const filteredTasks = dummyTasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchParams.get("q")?.toLowerCase() || "");
      const matchesCategory = searchParams.get("category")
        ? task.category === searchParams.get("category")
        : true;
      const price = task.price;
      const minPrice = Number(searchParams.get("minPrice")) || 0;
      const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;

      return (
        matchesSearch &&
        matchesCategory &&
        price >= minPrice &&
        price <= maxPrice
      );
    })
    .sort((a, b) => {
      switch (searchParams.get("sortBy")) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return (
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
          );
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  // Page navigation handlers
  const goToPage = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-4 gap-8"
        >
          <div className="lg:col-span-1">
            <Filters />
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Showing {filteredTasks.length} results
            </h2>

            {/* Render tasks */}
            <TaskList tasks={paginatedTasks} />

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-[#f4b96097] text-gray-400 cursor-not-allowed"
                    : "bg-[#F4B860] text-white hover:bg-[#F4A63B]"
                }`}
              >
                Previous
              </button>

              <span className="text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-[#f4b96097] text-gray-400 cursor-not-allowed"
                    : "bg-[#f7b654] text-white hover:bg-[#F4A63B]"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TasksPage;
