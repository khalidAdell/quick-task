import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import Filters from "../components/Filters";
import TaskList from "../components/TaskList";

const TASKS_PER_PAGE = 5;

interface Task {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  postedAt: string;
  deadline: string;
  bids: number;
  rating: number;
}

const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksRef = collection(db, "tasks");
        let q = query(tasksRef);

        // Apply filters
        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sortBy = searchParams.get("sortBy") || "newest";
        const searchQuery = searchParams.get("q") || "";

        if (category && category !== "all") {
          q = query(q, where("category", "==", category));
        }

        if (minPrice) {
          q = query(q, where("price", ">=", Number(minPrice)));
        }

        if (maxPrice) {
          q = query(q, where("price", "<=", Number(maxPrice)));
        }

        // Apply sorting
        switch (sortBy) {
          case "price-asc":
            q = query(q, orderBy("price", "asc"));
            break;
          case "price-desc":
            q = query(q, orderBy("price", "desc"));
            break;
          case "rating":
            q = query(q, orderBy("rating", "desc"));
            break;
          default:
            q = query(q, orderBy("postedAt", "desc"));
        }

        // Apply search
        if (searchQuery) {
          q = query(
            q,
            where("title", ">=", searchQuery),
            where("title", "<=", searchQuery + "\uf8ff")
          );
        }

        // Pagination
        const paginatedQuery = query(q, limit(TASKS_PER_PAGE));
        const documentSnapshots = await getDocs(paginatedQuery);

        const tasksData: Task[] = [];
        documentSnapshots.forEach((doc) => {
          const data = doc.data();

          // Add validation for timestamp fields
          const convertFirestoreDate = (field: any) => {
            if (field?.toDate) return field.toDate();
            if (field?.seconds) return new Date(field.seconds * 1000);
            console.error("Invalid date field:", field);
            return new Date(); // Fallback value
          };

          tasksData.push({
            id: doc.id,
            title: data.title || "Untitled Task",
            category: data.category || "uncategorized",
            description: data.description || "",
            postedAt: convertFirestoreDate(data.postedAt),
            deadline: convertFirestoreDate(data.deadline),
            price: Number(data.price) || 0,
            bids: Number(data.bids) || 0,
            rating: Number(data.rating) || 0,
          } as Task);
        });

        setTasks(tasksData);
        setLastVisible(
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        );
        setTotalTasks(tasksData.length);
        setLoading(false);
      } catch (err) {
        setError("Error fetching tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, [searchParams]);

  const handleNextPage = async () => {
    try {
      const tasksRef = collection(db, "tasks");
      let q = query(tasksRef, startAfter(lastVisible), limit(TASKS_PER_PAGE));

      const documentSnapshots = await getDocs(q);
      const tasksData: Task[] = [];
      documentSnapshots.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });

      setTasks(tasksData);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setCurrentPage((prev) => prev + 1);
    } catch (err) {
      setError("Error fetching next page");
    }
  };

  const handlePrevPage = async () => {
    // Implement previous page logic similarly
    // Note: Firestore doesn't natively support previous page
    // You might need to keep track of previous document snapshots
  };

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold mb-4">{error}</h1>
  //         <Link to="/" className="text-[#F4B860] hover:text-[#e3a24f]">
  //           Return to homepage
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

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

          {loading ? (
            <div className="lg:col-span-3 min-h-[70vh] bg-gray-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4B860]"></div>
            </div>
          ) : (
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Showing {totalTasks} results
              </h2>

              <TaskList tasks={tasks} />
              {tasks.length > TASKS_PER_PAGE && (
                <div className="flex justify-center mt-8 gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? "bg-[#f4b96097] text-gray-400 cursor-not-allowed"
                        : "bg-[#F4B860] text-white hover:bg-[#F4A63B]"
                    }`}
                  >
                    Previous
                  </button>

                  <span className="text-lg font-semibold">
                    Page {currentPage}
                  </span>

                  <button
                    onClick={handleNextPage}
                    className={`px-4 py-2 rounded-lg bg-[#f7b654] text-white hover:bg-[#F4A63B]`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TasksPage;
