import { AnimatePresence, motion } from "framer-motion";
import type { Transition, HTMLMotionProps } from "framer-motion";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import useTasks from "./hooks/useTasks";
import RootLayout from "./layout/RootLayout";

const springCard: Transition = { type: "spring", stiffness: 300, damping: 24, mass: 0.6 };

const cardMotion: Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition"> = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -6, scale: 0.995 },
  transition: springCard,
};

export default function App() {
  const { tasks, loading, error, busyId, createTask, updateTask, deleteTask, refetch } =
    useTasks();

  return (
    <RootLayout>
      <motion.div layout>
        <TaskForm onCreate={createTask} />
        <motion.hr
          className="sep"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div key="error" className="empty" {...cardMotion}>
            {/* keep children as normal JSX */}
            <>⚠️ {error}</>
          </motion.div>
        ) : loading ? (
          <motion.div key="loading" className="empty" {...cardMotion}>
            Loading tasks…
          </motion.div>
        ) : tasks.length === 0 ? (
          <motion.div key="empty" className="empty" {...cardMotion}>
            No tasks yet — add your first one!
          </motion.div>
        ) : (
          <motion.div key="list" layout {...cardMotion}>
            <TaskList
              items={tasks}
              busyId={busyId}
              onChange={(id, patch) => updateTask(id, patch)}
              onDelete={(id) => deleteTask(id)}
              onRefresh={refetch}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </RootLayout>
  );
}
