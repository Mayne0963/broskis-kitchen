"use client"

import { useState, useEffect } from "react"
import { useDelivery } from "@/contexts/DeliveryContext"
import { formatDate, getCombinedTimeSlotsForDate } from "@/utils/scheduleUtils"
import type { TimeSlot } from "@/utils/deliveryTypes"

export default function ScheduleSelector() {
  const {
    availableDates,
    isScheduled,
    setIsScheduled,
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    specialEvents,
    selectedSpecialEvent,
    setSelectedSpecialEvent,
  } = useDelivery()

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSpecialSlots, setHasSpecialSlots] = useState(false)

  // Update time slots when selected date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedDate) {
        setLoading(true)
        try {
          const { timeSlots, hasSpecialSlots } = await getCombinedTimeSlotsForDate(selectedDate)
          setTimeSlots(timeSlots)
          setHasSpecialSlots(hasSpecialSlots)

          // If there was a selected time slot that's no longer available, clear it
          if (selectedTimeSlot && !timeSlots.some((slot) => slot.display === selectedTimeSlot)) {
            setSelectedTimeSlot(null)
          }
        } catch (error) {
          console.error("Error fetching time slots:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchTimeSlots()
  }, [selectedDate, selectedTimeSlot, setSelectedTimeSlot])

  // Set first date as default when component mounts
  useEffect(() => {
    if (availableDates.length > 0 && isScheduled && !selectedDate) {
      setSelectedDate(availableDates[0])
    }
  }, [availableDates, isScheduled, selectedDate, setSelectedDate])

  if (!isScheduled) {
    return null
  }

  return (
    <div className="mt-4 border rounded-md p-4 bg-blue-50">
      <h3 className="font-medium mb-3">Schedule Your Order</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {availableDates.map((date) => (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`py-2 px-1 text-sm rounded-md text-center ${
                selectedDate && selectedDate.toDateString() === date.toDateString()
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Special Events Section */}
      {specialEvents.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Events</label>
          <div className="bg-yellow-50 p-3 rounded-md mb-3">
            <p className="text-sm text-yellow-800">
              Special events are available on this date! Select an event to see special time slots.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {specialEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedSpecialEvent(event)}
                className={`p-3 text-left rounded-md border ${
                  selectedSpecialEvent?.id === event.id
                    ? "bg-yellow-100 border-yellow-400"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{event.name}</div>
                <div className="text-sm text-gray-600">{event.description}</div>
                {event.specialMenu && (
                  <div className="text-xs mt-1 inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Special Menu
                  </div>
                )}
                {event.specialPricing && (
                  <div className="text-xs mt-1 ml-1 inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Special Pricing
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : selectedDate ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Time Slot {hasSpecialSlots && "(Special time slots available)"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                disabled={!slot.available}
                onClick={() => setSelectedTimeSlot(slot.display)}
                className={`py-2 px-1 text-sm rounded-md text-center ${
                  selectedTimeSlot === slot.display
                    ? "bg-blue-600 text-white"
                    : slot.available
                      ? slot.id.startsWith("special-")
                        ? "bg-yellow-50 border-yellow-300 border hover:bg-yellow-100"
                        : "bg-white border hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {slot.display}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-yellow-600">Please select a date to see available time slots</p>
      )}

      {!selectedTimeSlot && selectedDate && !loading && (
        <p className="text-sm text-yellow-600 mt-2">Please select a time slot to continue</p>
      )}
    </div>
  )
}
