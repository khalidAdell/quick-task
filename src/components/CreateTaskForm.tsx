// CreateTaskForm.tsx
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface TaskFormData {
  title: string;
  category: string;
  price: number;
  description: string;
  deadline: string;
  requirements: string;
}

const CreateTaskForm = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>();

  const onSubmit = async (data: TaskFormData) => {
    if (!user) {
      setSubmitError("You must be logged in to create a task");
      return;
    }

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "tasks"), {
        ...data,
        price: Number(data.price),
        requirements: data.requirements.split("\n").filter((r) => r.trim()),
        ownerId: user.uid,
        postedAt: serverTimestamp(),
        bids: 0,
        rating: 0,
        status: "open",
      });
      navigate("/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
      setSubmitError("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
            Please log in to create tasks
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
        <h1 className="text-3xl font-bold mb-6">Create New Task</h1>

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
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Posting Task...
              </>
            ) : (
              "Post Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
