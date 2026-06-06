import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import type { CalendarReminder } from '@/components/Calendar/types';

interface CalendarState {
  reminders: CalendarReminder[];
}

interface CalendarActions {
  addReminder: (data: Omit<CalendarReminder, 'id' | 'sort' | 'completed' | 'notified'>) => void;
  updateReminder: (id: string, data: Partial<Omit<CalendarReminder, 'id'>>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  getRemindersByDate: (dateStr: string) => CalendarReminder[];
  getSortedReminders: () => CalendarReminder[];
}

const initialState: CalendarState = {
  reminders: [],
};

export const useCalendarStore = create<CalendarState & CalendarActions>()(
  persist(
    devtools(
      (set, get) => ({
        ...initialState,

        addReminder: (data) => {
          const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
          const reminders = get().reminders;
          const maxSort =
            reminders.length > 0
              ? Math.max(...reminders.map((r) => r.sort ?? 0))
              : 0;
          const reminder: CalendarReminder = {
            ...data,
            id,
            sort: maxSort + 1,
            completed: false,
            notified: false,
          };
          set(
            (state) => ({ reminders: [...state.reminders, reminder] }),
            false,
            'calendar/addReminder',
          );
        },

        updateReminder: (id, data) => {
          set(
            (state) => ({
              reminders: state.reminders.map((r) =>
                r.id === id ? { ...r, ...data } : r,
              ),
            }),
            false,
            'calendar/updateReminder',
          );
        },

        deleteReminder: (id) => {
          set(
            (state) => ({
              reminders: state.reminders.filter((r) => r.id !== id),
            }),
            false,
            'calendar/deleteReminder',
          );
        },

        completeReminder: (id) => {
          set(
            (state) => ({
              reminders: state.reminders.map((r) =>
                r.id === id ? { ...r, completed: !r.completed } : r,
              ),
            }),
            false,
            'calendar/completeReminder',
          );
        },

        getRemindersByDate: (dateStr) => {
          return get()
            .reminders.filter((r) => r.dateTime.startsWith(dateStr))
            .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
        },

     

        getSortedReminders: () => {
          return get()
            .reminders.slice()
            .sort((a, b) => a.sort - b.sort || a.dateTime.localeCompare(b.dateTime));
        },
      }),
      { name: 'calendar' },
    ),
    {
      name: 'calendar-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
