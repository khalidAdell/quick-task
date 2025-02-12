import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { AddTask } from "../types/types";

const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const [userTasks, setUserTasks] = useState<AddTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (user?.uid) {
        const q = query(
          collection(db, "tasks"),
          where("ownerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AddTask[];
        setUserTasks(tasks);
        setLoading(false);
      }
    };

    fetchUserTasks();
    if (user) {
      setValue("displayName", user.displayName);
      setValue("photoURL", user.photoURL);
    }
  }, [user]);

  const updateUserProfile = async (data: any) => {
    if (user) {
      try {
        await updateProfile(user, {
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
        alert("Profile updated successfully!");
      } catch (error) {
        alert("Error updating profile");
      }
    }
  };

  if (!user) return <div>Please log in to view your profile</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

          <form
            onSubmit={handleSubmit(updateUserProfile)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                {...register("displayName")}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Photo URL
              </label>
              <input
                {...register("photoURL")}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-[#F4B860] hover:bg-[#e3a24f] text-white px-6 py-2 rounded-lg"
            >
              Update Profile
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Your Posted Tasks</h2>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-600">
                    ${task.price} • {task.category}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
