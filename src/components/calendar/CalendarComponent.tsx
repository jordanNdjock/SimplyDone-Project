"use client"

import React, { useMemo, useState } from 'react'
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isToday,
  isSameDay,
  parseISO,
  isWithinInterval,
  startOfDay,
  isTomorrow,
  isYesterday,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from "@/src/components/ui/button"
import { useIsMobile } from "@/src/hooks/use-mobile"
import { selectTasks, useTaskStore } from '@/src/store/taskSlice'
import { TaskListItems } from '../tasks/TaskListItems';

const CalendarComponent: React.FC = () => {
  const tasks = useTaskStore(selectTasks);
  const isMobile = useIsMobile();

  const today = startOfDay(new Date());

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const start = startOfWeek(currentDate, { locale: fr, weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { locale: fr, weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start, end });

  const goToPreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  const targetDate = selectedDate ?? today;

  const tasksForTargetDate = useMemo(() => {
    return tasks.filter(task => {
      if (!task.start_date || !task.end_date) return false;
      const start = parseISO(task.start_date);
      const end = parseISO(task.end_date);
      return isWithinInterval(startOfDay(targetDate), { start, end });
    });
  }, [tasks, targetDate]);

  const dateLabel = isSameDay(targetDate, today)
    ? "d'aujourd'hui 🔥"
    : isTomorrow(targetDate)
    ? "de demain ⏳"
    : isYesterday(targetDate)
    ? "d'hier 📅"
    : `du ${format(targetDate, 'dd MMM yyyy', { locale: fr })} 📌`;

  return (
    <div className="max-w-full mx-auto w-full flex-col items-center justify-center bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <div className="w-full max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <Button variant="outline" className='font-bold outline-none' onClick={goToPreviousWeek}>←</Button>
          <h2 className={`text-center flex-1 font-semibold ${isMobile ? 'text-sm' : 'text-2xl'}`}>
            📅 {isMobile
              ? `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`
              : `Semaine du ${format(start, 'dd MMM yyyy', { locale: fr })} au ${format(end, 'dd MMM yyyy', { locale: fr })}`}
          </h2>
          <Button variant="outline" className='font-bold outline-none' onClick={goToNextWeek}>→</Button>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 w-full">
          {weekDays.map((day) => {
            const isCurrent = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            const baseClass = "flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl shadow transition cursor-pointer min-w-0 w-full hover:bg-blue-100 dark:hover:bg-blue-800";

            const colorClass = isCurrent
              ? 'bg-blue-600 text-white font-semibold'
              : isSelected
              ? 'bg-indigo-500 text-white font-semibold'
              : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100';

            return (
              <div
                key={day.toISOString()}
                className={`${baseClass} ${colorClass}`}
                onClick={() => setSelectedDate(day)}
              >
                {!isMobile && (
                  <div className="text-sm uppercase font-medium text-center">
                    {format(day, 'EEEE', { locale: fr })}
                  </div>
                )}
                <div className={`text-lg ${isMobile ? 'font-semibold' : 'sm:text-xl'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        <div className='mt-12 space-y-2'>
          <h2 className='text-lg md:text-xl font-bold mb-6'>
            Tâches {dateLabel}
          </h2>
          {tasksForTargetDate.length > 0 ? (
            <TaskListItems tasks={tasksForTargetDate} />
          ) : (
            <h3 className='text-gray-500'>Aucune tâche pour ce jour</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
