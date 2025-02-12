import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";

const TaskList = ({ tasks }: { tasks: any[] }) => {
  return (
    <div className="grid gap-6">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tasks found matching your criteria
        </div>
      )}
    </div>
  );
};
export default TaskList;
