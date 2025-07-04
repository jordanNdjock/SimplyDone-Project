"use client";

import * as React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { TaskDialog } from "@/src/components/dialogs/task/TaskDialog";
// import { TaskDrawer } from "@/src/components/drawers/task/TaskDrawer";
import clsx from "clsx";
import { useSidebar } from "../ui/sidebar";

export default function FloatingActionButton({dateCalendar}: {dateCalendar?: Date}) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useSidebar();

  return (
    <>
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: 180, scale: 1.1 }}
          onClick={() => setOpen(true)}
          className={clsx(`fixed md:bottom-10 md:right-10 bg-accent dark:bg-primary text-white p-4 rounded-full shadow-lg transtion duration-200`,
            !isMobile ? "bottom-6 right-6" : "bottom-20 right-2" 
          )}
        >
          <Plus size={24} />
        </motion.button>

        {/* {!isMobile ? ( */}
          <TaskDialog open={open} onClose={() => setOpen(false)} dateCalendar={dateCalendar} />
         {/* ) : ( */}
        {/* <TaskDrawer open={open} onClose={() => setOpen(false)} /> */}
        {/* )} */}
    </>
  );
}
