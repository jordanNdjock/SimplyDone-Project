"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isToday,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  addDays,
  subDays,
} from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/src/components/ui/button"
import { useIsMobile } from "@/src/hooks/use-mobile"
import { selectTasks, useTaskStore } from "@/src/store/taskSlice"
import { TaskListItems } from "../tasks/TaskListItems"
import { CalendarFold, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/src/hooks/use-toast"
import { selectUser, useAuthStore } from "@/src/store/authSlice"
import FloatingActionButton from "../layout/FloatingActionButton"
import { dateLabel, formatTaskDates } from "@/src/utils/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { usePrefUserStore } from "@/src/store/prefUserSlice"

const CalendarComponent: React.FC = () => {
  const tasks = useTaskStore(selectTasks)
  const { calendar_DisplayFinishedTasks, calendar_ViewMode } = usePrefUserStore();
  const { listenToTasks, fetchTasks } = useTaskStore()
  const user = useAuthStore(selectUser)
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const today = startOfDay(new Date())

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(today)
  const [showAllActive, setShowAllActive] = useState(false)
  const [showAllCompleted, setShowAllCompleted] = useState(false)

  const targetDate = selectedDate ?? today

  const daysToDisplay = useMemo(() => {
    if (calendar_ViewMode === "mois") {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      })
    }
    if (calendar_ViewMode === "semaine") {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { locale: fr, weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { locale: fr, weekStartsOn: 1 }),
      })
    }
    if (calendar_ViewMode === "jour") {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      })
    }

    return []
  }, [calendar_ViewMode, currentDate])

  const tasksForTargetDate = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.start_date || !task.end_date) return false
      const start = parseISO(task.start_date)
      const end = parseISO(task.end_date)
      return isWithinInterval(startOfDay(targetDate), { start, end })
    })
  }, [tasks, targetDate])

  const activeTasks = tasksForTargetDate.filter((t) => !t.completed)
  const completedTasks = tasksForTargetDate.filter((t) => t.completed)

  const goToPrevious = () => {
    const newDate =
      calendar_ViewMode === "mois"
        ? subMonths(currentDate, 1)
        : calendar_ViewMode === "jour" ? subDays(currentDate, 1) 
        : subWeeks(currentDate, 1)
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate =
      calendar_ViewMode === "mois"
        ? addMonths(currentDate, 1)
        : calendar_ViewMode === "jour" ? addDays(currentDate, 1) 
        : addWeeks(currentDate, 1)
    setCurrentDate(newDate)
  }

  useEffect(() => {
    listenToTasks()
  }, [listenToTasks])

  useEffect(() => {
    if (user) {
      try {
        fetchTasks(user.$id)
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue"
        toast({ title: message, variant: "error" })
      }
    }
  }, [fetchTasks, user, toast])

  const getTitleLabel = () => {
    if (calendar_ViewMode === "mois") {
      return format(currentDate, "MMMM yyyy", { locale: fr })
    }
    if (calendar_ViewMode === "semaine") {
      const start = startOfWeek(currentDate, { locale: fr, weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { locale: fr, weekStartsOn: 1 })

      if(isMobile){
        return `${formatTaskDates(startOfDay(start).toISOString(), end.toISOString())} ${format(end, 'yyyy', { locale: fr }) 
        < "2026" ? format(end, 'yyyy', { locale: fr }) : ""}`
      }
      
      return `Semaine du ${format(start, "dd MMM", {
        locale: fr,
      })} au ${format(end, "dd MMM yyyy", { locale: fr })}`
    }
    return format(currentDate, "EEEE dd MMM yyyy", { locale: fr })
  }

  return (
    <>
      <div className="max-w-full mx-auto w-full flex-col items-center justify-center bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
        <div className="w-full max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <Button disabled={calendar_ViewMode === "jour"} variant="outline" className="font-bold" onClick={goToPrevious}>
              ←
            </Button>

            <h2 className="flex flex-col items-center text-center font-semibold text-lg md:text-2xl">
              <div className="flex items-center">
                <CalendarFold className="mr-2 w-6 h-6" />
                <span>
                  {getTitleLabel()}
                </span>
              </div>

              <div className="mt-2  md:w-48">
                <Select
                  onValueChange={(val) => {
                    setSelectedDate(new Date(val))
                    if(calendar_ViewMode === "jour") setCurrentDate(new Date(val))
                  }}
                  value={selectedDate?.toISOString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une date"/>
                  </SelectTrigger>
                  <SelectContent>
                    {daysToDisplay.map((day) => (
                      <SelectItem key={day.toISOString()} value={day.toISOString()}>
                        {format(day, "EEEE dd MMM", { locale: fr })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </h2>

            <Button variant="outline" disabled={calendar_ViewMode === "jour"} className="font-bold" onClick={goToNext}>
              →
            </Button>
          </div>

          {calendar_ViewMode === "jour" ? (
              <div className="flex items-center justify-center my-6">
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 sm:gap-4 w-full">
                {daysToDisplay.map((day) => {
                  const isCurrent = isToday(day)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)

                  const baseClass =
                    "flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl shadow transition cursor-pointer min-w-0 w-full hover:bg-blue-100 dark:hover:bg-blue-800"
                  const colorClass = isCurrent
                    ? "bg-blue-600 text-white font-semibold"
                    : isSelected
                    ? "bg-indigo-500 text-white font-semibold"
                    : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"

                  return (
                    <div
                      key={day.toISOString()}
                      className={`${baseClass} ${colorClass}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {!isMobile && (
                        <div className="text-sm uppercase font-medium text-center">
                          {format(day, "EEE", { locale: fr })}
                        </div>
                      )}
                      <div className={`text-lg ${isMobile ? "font-semibold" : "sm:text-xl"}`}>
                        {format(day, "d")}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}


          <div className="mt-12 space-y-2">
            <h2 className="text-lg md:text-xl font-bold mb-6">
              Tâches {dateLabel(targetDate, today)}
            </h2>

            {tasksForTargetDate.length > 0 ? (
              <>
                <div className="space-y-2">
                  {(showAllActive ? activeTasks : activeTasks.slice(0, 4)).map((task) => (
                    <TaskListItems key={task.id} tasks={[task]} />
                  ))}

                  {activeTasks.length > 4 && (
                    <button
                      onClick={() => setShowAllActive(!showAllActive)}
                      className="text-blue-600 text-sm mt-3 flex"
                    >
                      {showAllActive ? (
                        <>
                          Voir moins <ChevronUp className="w-5 h-5 ml-1" />
                        </>
                      ) : (
                        <>
                          Voir plus <ChevronDown className="w-5 h-5 ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {completedTasks.length > 0 && calendar_DisplayFinishedTasks && (
                  <div className="opacity-60 space-y-2">
                    <h2 className="text-md md:text-lg font-bold text-gray-500 mb-2 mt-6">
                      Terminées
                    </h2>

                    {(showAllCompleted ? completedTasks : completedTasks.slice(0, 2)).map((task) => (
                      <TaskListItems key={task.id} tasks={[task]} />
                    ))}

                    {completedTasks.length > 2 && (
                      <button
                        onClick={() => setShowAllCompleted(!showAllCompleted)}
                        className="text-blue-600 text-sm mt-3 flex"
                      >
                        {showAllCompleted ? (
                          <>
                            Voir moins <ChevronUp className="w-5 h-5 ml-1" />
                          </>
                        ) : (
                          <>
                            Voir plus <ChevronDown className="w-5 h-5 ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500 mt-6">Aucune tâche pour cette date.</div>
            )}
          </div>
        </div>
      </div>

      <FloatingActionButton dateCalendar={targetDate} />
    </>
  )
}

export default CalendarComponent
