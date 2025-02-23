import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { AddTask } from "../types/types";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaUserCircle,
} from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { formatDistanceToNow, isValid } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

interface UserProfile {
  skills?: string[];
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  bio?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            {children}
            <button
              onClick={onClose}
              className="mt-4 bg-[#F4B860] text-white px-4 py-2 rounded-lg hover:bg-[#F4B860] transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const [userTasks, setUserTasks] = useState<AddTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<AddTask[]>([]);
  const [assinedTasks, setAssinedTasks] = useState<AddTask[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<AddTask[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    isError: boolean;
  }>({
    title: "",
    message: "",
    isError: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm();
  const photoURL = watch("photoURL", user?.photoURL);

  const fetchData = async () => {
    if (user?.uid) {
      const [userDoc, postedQuery, completedQuery, assinedTask, finishedTask] =
        await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getDocs(
            query(
              collection(db, "tasks"),
              where("ownerId", "==", user.uid),
              where("status", "in", ["open", "assigned"])
            )
          ),
          getDocs(
            query(
              collection(db, "tasks"),
              where("ownerId", "==", user.uid),
              where("status", "==", "completed")
            )
          ),
          getDocs(
            query(
              collection(db, "tasks"),
              where("assignedTo", "==", user.uid),
              where("status", "==", "assigned")
            )
          ),
          getDocs(
            query(
              collection(db, "tasks"),
              where("assignedTo", "==", user.uid),
              where("status", "==", "completed")
            )
          ),
        ]);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile(data);
        Object.entries(data).forEach(([key, value]) => setValue(key, value));
      }

      setUserTasks(
        postedQuery.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as AddTask)
        )
      );
      setCompletedTasks(
        completedQuery.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as AddTask)
        )
      );
      setAssinedTasks(
        assinedTask.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as AddTask)
        )
      );
      setFinishedTasks(
        finishedTask.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as AddTask)
        )
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    if (user) {
      setValue("displayName", user.displayName);
      setValue("photoURL", user.photoURL);
    }
  }, [user]);

  const updateUserProfile = async (data: any) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // Update Firebase Authentication profile
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });

      // Update Firestore profile
      await setDoc(
        doc(db, "users", user.uid),
        {
          skills: Array.isArray(data.skills)
            ? data.skills
            : data.skills
                ?.trim()
                .split(",")
                .map((s: string) => s.trim()),
          location: data.location,
          website: data.website,
          github: data.github,
          linkedin: data.linkedin,
          twitter: data.twitter,
          bio: data.bio,
          photoURL: data.photoURL,
        },
        { merge: true }
      );

      setModalContent({
        title: "Success!",
        message: "Profile updated successfully",
        isError: false,
      });
    } catch (error) {
      console.error("Update error:", error);
      setModalContent({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to update profile",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
      setShowModal(true);
    }
  };

  if (!user)
    return (
      <div className="text-center py-8">Please log in to view your profile</div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
      >
        <p
          className={`text-center ${
            modalContent.isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {modalContent.message.slice(0, 40)}
        </p>
      </Modal>

      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-r from-purple-600 to-[#F4B860]">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative group">
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full border-1 border-white shadow-lg"
              />
            ) : (
              <FaUserCircle className="text-xl w-32 h-32 text-gray-600 bg-white rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20">
        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            <input
              {...register("displayName", { required: true })}
              className="text-center bg-transparent focus:bg-gray-100 rounded px-2 py-1"
              placeholder="Enter your name"
            />
          </h1>

          <div className="flex justify-center space-x-4 mt-4">
            {userProfile.location && (
              <div className="flex items-center text-gray-600">
                <MdLocationOn className="mr-1" />
                <span>{userProfile.location}</span>
              </div>
            )}
            {user.email && (
              <div className="flex items-center text-gray-600">
                <MdEmail className="mr-1" />
                <span>{user.email}</span>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            {userProfile.github && (
              <a
                href={userProfile.github}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaGithub size={24} />
              </a>
            )}
            {userProfile.linkedin && (
              <a
                href={userProfile.linkedin}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaLinkedin size={24} />
              </a>
            )}
            {userProfile.twitter && (
              <a
                href={userProfile.twitter}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaTwitter size={24} />
              </a>
            )}
            {userProfile.website && (
              <a
                href={userProfile.website}
                className="text-gray-600 hover:text-gray-900"
              >
                <FaGlobe size={24} />
              </a>
            )}
          </div>

          {userProfile.bio && (
            <div className="mt-6 text-gray-600 max-w-2xl mx-auto">
              <p className="italic">"{userProfile.bio}"</p>
            </div>
          )}

          {userProfile.skills && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {userProfile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#F4B860] text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tasks Sections */}
        <h2 className="mb-4 text-2xl font-medium">Tasks you posted</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Posted Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              Active Tasks ({userTasks.length})
            </h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {userTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h3 className="font-semibold capitalize">{task.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#F4B860] font-medium">
                        ${task.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {isValid(
                          new Date(
                            task.postedAt?.toDate
                              ? task.postedAt.toDate()
                              : new Date(task.postedAt)
                          )
                        )
                          ? `${formatDistanceToNow(
                              new Date(
                                task.postedAt?.toDate
                                  ? task.postedAt.toDate()
                                  : new Date(task.postedAt)
                              )
                            )} ago`
                          : "Invalid date "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              Completed Tasks ({completedTasks.length})
            </h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h3 className="font-semibold capitalize">{task.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-green-600 font-medium">
                        ${task.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {isValid(
                          new Date(
                            task.completedAt?.toDate
                              ? task.completedAt.toDate()
                              : new Date(task.completedAt)
                          )
                        )
                          ? `${formatDistanceToNow(
                              new Date(
                                task.completedAt?.toDate
                                  ? task.completedAt.toDate()
                                  : new Date(task.completedAt)
                              )
                            )} ago`
                          : "Invalid date "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <h2 className="mb-4 text-2xl font-medium">Tasks you Bids</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Assigned Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              Assigned Tasks ({assinedTasks.length})
            </h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {assinedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h3 className="font-semibold capitalize">{task.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#F4B860] font-medium">
                        ${task.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {isValid(
                          new Date(
                            task.postedAt?.toDate
                              ? task.postedAt.toDate()
                              : new Date(task.postedAt)
                          )
                        )
                          ? `${formatDistanceToNow(
                              new Date(
                                task.postedAt?.toDate
                                  ? task.postedAt.toDate()
                                  : new Date(task.postedAt)
                              )
                            )} ago`
                          : "Invalid date "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Finished Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              Finished Tasks ({finishedTasks.length})
            </h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {finishedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h3 className="font-semibold capitalize">{task.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-green-600 font-medium">
                        ${task.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {isValid(
                          new Date(
                            task.completedAt?.toDate
                              ? task.completedAt.toDate()
                              : new Date(task.completedAt)
                          )
                        )
                          ? `${formatDistanceToNow(
                              new Date(
                                task.completedAt?.toDate
                                  ? task.completedAt.toDate()
                                  : new Date(task.completedAt)
                              )
                            )} ago`
                          : "Invalid date "}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Edit Profile Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          <form
            onSubmit={handleSubmit(updateUserProfile)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name *
              </label>
              <input
                {...register("displayName", { required: true })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Photo URL
              </label>
              <input
                {...register("photoURL")}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                {...register("location")}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Skills (comma separated)
              </label>
              <input
                {...register("skills")}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                {...register("bio")}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    GitHub URL
                  </label>
                  <input
                    {...register("github")}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    {...register("linkedin")}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Twitter URL
                  </label>
                  <input
                    {...register("twitter")}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website URL
                  </label>
                  <input
                    {...register("website")}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 bg-[#F4B860] hover:bg-[#F4B860] text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
