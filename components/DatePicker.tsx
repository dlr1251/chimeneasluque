"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { getDayOfWeek, getAvailableHours, isValidDate, formatDate } from "@/lib/reservations";

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  existingReservations: any[];
}

export default function DatePicker({ selectedDate, onDateSelect, existingReservations }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (date: Date) => {
    if (!isValidDate(date)) return false;
    const dayOfWeek = getDayOfWeek(date);
    return dayOfWeek !== 0; // Domingo no disponible
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (date: Date) => {
    return date < today;
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateAvailable(date) && !isPast(date)) {
      onDateSelect(date.toISOString().split("T")[0]);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    if (nextMonth <= maxDate) {
      setCurrentMonth(nextMonth);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const days = [];
  
  // Días del mes anterior (para completar la primera semana)
  const prevMonthDays = getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i),
    });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    days.push({
      day,
      isCurrentMonth: true,
      date,
    });
  }

  // Días del mes siguiente (para completar la última semana)
  const remainingDays = 42 - days.length; // 6 semanas * 7 días
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day),
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <h3 className="text-xl font-bold text-primary capitalize">
          {monthName}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) > maxDate}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-semibold py-2 ${
              index === 0 ? "text-red-500" : "text-primary"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-2">
        {days.map(({ day, isCurrentMonth, date }, index) => {
          const available = isDateAvailable(date);
          const selected = isDateSelected(date);
          const today = isToday(date);
          const past = isPast(date);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={!available || past || !isCurrentMonth}
              className={`
                aspect-square rounded-lg transition-all duration-200 font-medium text-sm
                ${!isCurrentMonth ? "text-gray-300 cursor-not-allowed" : ""}
                ${past ? "text-gray-300 cursor-not-allowed bg-gray-50" : ""}
                ${!available && isCurrentMonth && !past
                  ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                  : ""
                }
                ${available && isCurrentMonth && !past && !selected
                  ? "text-primary bg-white hover:bg-accent-500/10 hover:border-accent-500 border border-gray-200"
                  : ""
                }
                ${selected
                  ? "bg-accent-500 text-white border-2 border-accent-500 shadow-lg scale-105"
                  : ""
                }
                ${today && !selected
                  ? "ring-2 ring-accent-500/50"
                  : ""
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent-500"></div>
          <span className="text-gray-600">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-gray-200"></div>
          <span className="text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-50"></div>
          <span className="text-gray-600">No disponible</span>
        </div>
      </div>
    </div>
  );
}


