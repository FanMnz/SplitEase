'use client'

import { useState } from 'react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Shift {
  id: string
  staffId: string
  staffName: string
  role: string
  date: Date
  startTime: string
  endTime: string
  status: 'scheduled' | 'confirmed' | 'absent' | 'late'
  breakTime?: number // minutes
  notes?: string
}

interface StaffMember {
  id: string
  name: string
  role: string
  hourlyRate: number
  skills: string[]
  availability: string[]
  avatar?: string
}

interface StaffSchedulingProps {
  shifts: Shift[]
  staff: StaffMember[]
  onAddShift: (shift: Omit<Shift, 'id'>) => void
  onUpdateShift: (id: string, shift: Partial<Shift>) => void
  onDeleteShift: (id: string) => void
}

export default function StaffScheduling({ 
  shifts, 
  staff, 
  onAddShift, 
  onUpdateShift, 
  onDeleteShift 
}: StaffSchedulingProps) {
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [showAddShift, setShowAddShift] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }) // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => isSameDay(shift.date, date))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-neutral-100 text-neutral-700'
      case 'confirmed': return 'bg-success-100 text-success-700'
      case 'absent': return 'bg-error-100 text-error-700'
      case 'late': return 'bg-warning-100 text-warning-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const calculateShiftHours = (startTime: string, endTime: string, breakTime: number = 0) => {
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return Math.max(0, hours - (breakTime / 60))
  }

  const getWeeklyStats = () => {
    const weekShifts = shifts.filter(shift => 
      shift.date >= weekStart && shift.date <= addDays(weekStart, 6)
    )
    
    const totalHours = weekShifts.reduce((sum, shift) => 
      sum + calculateShiftHours(shift.startTime, shift.endTime, shift.breakTime), 0
    )
    
    const totalCost = weekShifts.reduce((sum, shift) => {
      const staffMember = staff.find(s => s.id === shift.staffId)
      const hours = calculateShiftHours(shift.startTime, shift.endTime, shift.breakTime)
      return sum + (hours * (staffMember?.hourlyRate || 0))
    }, 0)

    return {
      totalShifts: weekShifts.length,
      totalHours: totalHours.toFixed(1),
      totalCost: totalCost.toFixed(2),
      confirmed: weekShifts.filter(s => s.status === 'confirmed').length
    }
  }

  const stats = getWeeklyStats()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Staff Scheduling</h3>
          <p className="text-sm text-neutral-600">Manage shifts and staff assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddShift(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Shift
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedWeek(addDays(selectedWeek, -7))}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <h4 className="text-lg font-medium text-neutral-900">
            Week of {format(weekStart, 'MMM dd, yyyy')}
          </h4>
          <button
            onClick={() => setSelectedWeek(addDays(selectedWeek, 7))}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
        
        {/* Week Stats */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <p className="font-medium text-neutral-900">{stats.totalShifts}</p>
            <p className="text-neutral-600">Shifts</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-neutral-900">{stats.totalHours}h</p>
            <p className="text-neutral-600">Hours</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-neutral-900">€{stats.totalCost}</p>
            <p className="text-neutral-600">Cost</p>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="min-h-40">
            <div className="text-center mb-2 p-2 bg-neutral-50 rounded-lg">
              <p className="text-sm font-medium text-neutral-900">
                {format(day, 'EEE')}
              </p>
              <p className="text-lg font-bold text-neutral-700">
                {format(day, 'd')}
              </p>
            </div>

            <div className="space-y-1">
              {getShiftsForDate(day).map((shift) => {
                const staffMember = staff.find(s => s.id === shift.staffId)
                return (
                  <div
                    key={shift.id}
                    className={`p-2 rounded-lg text-xs cursor-pointer hover:shadow-sm transition-shadow ${getStatusColor(shift.status)}`}
                    onClick={() => {
                      // Open shift details/edit modal
                      console.log('Edit shift:', shift.id)
                    }}
                  >
                    <p className="font-medium truncate">{staffMember?.name}</p>
                    <p className="text-xs opacity-75">{shift.startTime}-{shift.endTime}</p>
                    <p className="text-xs opacity-75">{shift.role}</p>
                  </div>
                )
              })}
              
              {/* Add shift button for empty slots */}
              <button
                onClick={() => {
                  setSelectedDate(day)
                  setShowAddShift(true)
                }}
                className="w-full p-2 text-xs text-neutral-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg border border-dashed border-neutral-300 hover:border-brand-300 transition-colors"
              >
                + Add Shift
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Overview */}
      <div className="border-t border-neutral-200 pt-6">
        <h4 className="font-medium text-neutral-900 mb-3">Staff Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {staff.map((member) => {
            const memberShifts = shifts.filter(s => 
              s.staffId === member.id && 
              s.date >= weekStart && 
              s.date <= addDays(weekStart, 6)
            )
            const weeklyHours = memberShifts.reduce((sum, shift) => 
              sum + calculateShiftHours(shift.startTime, shift.endTime, shift.breakTime), 0
            )

            return (
              <div key={member.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{member.name}</p>
                    <p className="text-xs text-neutral-600">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">{weeklyHours.toFixed(1)}h</p>
                  <p className="text-xs text-neutral-600">{memberShifts.length} shifts</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Shift Modal would be implemented here */}
      {showAddShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Add New Shift</h3>
            <p className="text-sm text-neutral-600 mb-4">
              {selectedDate ? `for ${format(selectedDate, 'MMMM dd, yyyy')}` : ''}
            </p>
            {/* Form fields would go here */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddShift(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddShift(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                Add Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}