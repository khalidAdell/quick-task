/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { db, auth } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
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
  const [totalTasks, setTotalTasks] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setTasks([]);
        setTotalTasks(0);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const tasksRef = collection(db, "tasks");
        let q = query(tasksRef);

        // Existing filter logic
        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const searchQuery = searchParams.get("search")?.toLowerCase() || "";

        if (category && category !== "all") {
          q = query(q, where("category", "==", category));
        }

        if (minPrice) {
          q = query(q, where("price", ">=", Number(minPrice)));
        }

        if (maxPrice) {
          q = query(q, where("price", "<=", Number(maxPrice)));
        }

        if (searchQuery) {
          q = query(
            q,
            where("title", ">=", searchQuery),
            where("title", "<=", searchQuery + "\uf8ff")
          );
        }

        const documentSnapshots = await getDocs(q);

        const tasksData: Task[] = [];
        documentSnapshots.forEach((doc) => {
          const data = doc.data();
          if (data.status !== "open") return;

          const convertFirestoreDate = (field: any) => {
            if (field?.toDate) return field.toDate();
            if (field?.seconds) return new Date(field.seconds * 1000);
            return new Date();
          };

          tasksData.push({
            id: doc.id,
            title: data.title || "Untitled Task",
            category: data.category || "uncategorized",
            description: data.description || "",
            postedAt: convertFirestoreDate(data.postedAt),
            deadline: data.deadline,
            price: Number(data.price) || 0,
            bids: Number(data.bids) || 0,
            rating: Number(data.rating) || 0,
          } as Task);
        });

        setTasks(tasksData.reverse());
        setTotalTasks(tasksData.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [searchParams, user]);

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
              {user ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Showing {totalTasks} results
                  </h2>
                  <TaskList tasks={tasks} />
                </>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Please log in to view tasks
                  </h2>
                </div>
              )}

              {tasks.length > TASKS_PER_PAGE && user && (
                <div className="flex justify-center mt-8 gap-4">
                  <button className="px-4 py-2 rounded-lg bg-[#f7b654] text-white hover:bg-[#F4A63B]">
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
