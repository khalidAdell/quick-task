// EditTaskForm.tsx
import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

interface TaskFormData {
  title: string;
  category: string;
  price: number;
  description: string;
  deadline: string;
  requirements: string;
}

const EditTaskForm = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>();

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoadingTask(true);
      setSubmitError(null);

      if (!taskId) {
        setSubmitError("Task ID is missing");
        setIsLoadingTask(false);
        return;
      }

      try {
        const taskRef = doc(db, "tasks", taskId);
        const taskDoc = await getDoc(taskRef);

        if (!taskDoc.exists()) {
          setSubmitError("Task not found");
          setIsLoadingTask(false);
          return;
        }

        const data = taskDoc.data();
        if (user && data.ownerId !== user.uid) {
          return navigate(`/tasks/${taskId}`);
        }

        reset({
          title: data.title,
          category: data.category,
          price: data.price,
          description: data.description,
          deadline: data.deadline,
          requirements: data.requirements.join("\n"),
        });
      } catch (error) {
        console.error("Error fetching task:", error);
        setSubmitError(`Failed to load task: ${(error as Error).message}`);
      } finally {
        setIsLoadingTask(false);
      }
    };

    fetchTask();
  }, [taskId, reset]);

  const onSubmit = async (data: TaskFormData) => {
    if (!user || !taskId) {
      setSubmitError("Unauthorized");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const taskRef = doc(db, "tasks", taskId);
      const currentTask = await getDoc(taskRef);

      if (!currentTask.exists()) {
        setSubmitError("Task no longer exists");
        return;
      }

      if (currentTask.data().ownerId !== user.uid) {
        setSubmitError("You can only edit your own tasks");
        return;
      }

      await updateDoc(taskRef, {
        title: data.title,
        category: data.category,
        price: Number(data.price),
        description: data.description,
        deadline: data.deadline,
        requirements: data.requirements.split("\n").filter((r) => r.trim()),
      });

      navigate(`/tasks/${taskId}`);
    } catch (error) {
      console.error("Error updating task:", error);
      setSubmitError(`Failed to update task: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoadingTask) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4B860]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to edit tasks
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#F4B860] text-white px-6 py-2 rounded-lg hover:bg-[#e3a24f]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Task</h1>

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Task Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            >
              <option value="Web Development">Web Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Tech Support">Tech Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <input
              type="number"
              {...register("price", {
                required: "Price is required",
                min: { value: 1, message: "Minimum price is $1" },
              })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            />
            {errors.price && (
              <span className="text-red-500 text-sm">
                {errors.price.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              rows={4}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="date"
              {...register("deadline", {
                required: "Deadline is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return (
                    selectedDate >= today || "Deadline must be in the future"
                  );
                },
              })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            />
            {errors.deadline && (
              <span className="text-red-500 text-sm">
                {errors.deadline.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Requirements (one per line)
            </label>
            <textarea
              {...register("requirements", {
                required: "At least one requirement is needed",
                validate: (value) => {
                  const requirements = value
                    .split("\n")
                    .filter((r) => r.trim());
                  return (
                    requirements.length > 0 ||
                    "At least one requirement is needed"
                  );
                },
              })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              rows={4}
            />
            {errors.requirements && (
              <span className="text-red-500 text-sm">
                {errors.requirements.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#F4B860] hover:bg-[#e3a24f] text-white py-3 rounded-lg flex items-center justify-center disabled:opacity-50"
          >
            {isSubmitting ? "Updating Task..." : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskForm;
