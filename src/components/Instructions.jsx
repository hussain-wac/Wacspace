// Instructions.jsx
import React from 'react';
import { PlusCircle, Calendar, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Instructions = () => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-6 border border-neutral-200 dark:border-neutral-700"
    >
      <motion.h2
        variants={itemVariants}
        className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2"
      >
        <Info className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        How to Schedule a Meeting
      </motion.h2>
      <ul className="space-y-4 text-neutral-600 dark:text-neutral-300">
        <motion.li variants={itemVariants} className="flex items-start gap-3">
          <PlusCircle className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
          <span>Click on the calendar where you want to add your meeting or event.</span>
        </motion.li>
        <motion.li variants={itemVariants} className="flex items-start gap-3">
          <Calendar className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
          <span>Select the date and time slot that works best for your schedule.</span>
        </motion.li>
        <motion.li variants={itemVariants} className="flex items-start gap-3">
          <Clock className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
          <span>Specify the duration and add details like title and description.</span>
        </motion.li>
      </ul>
      <motion.p
        variants={itemVariants}
        className="mt-4 text-sm text-neutral-500 dark:text-neutral-400"
      >
        Note: Available time slots are shown in white. Booked slots are shaded.
      </motion.p>
    </motion.div>
  );
};

export default Instructions;