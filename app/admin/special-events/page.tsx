"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { collection, query, orderBy, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { checkUserRole } from "@/utils/roleCheck"
import { useRouter } from "next/navigation"
import type { SpecialEvent, SpecialTimeSlot } from "@/utils/eventTypes"

export default function SpecialEventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<SpecialEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null)

  // Event form fields
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isHoliday, setIsHoliday] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [specialMenu, setSpecialMenu] = useState(false)
  const [specialPricing, setSpecialPricing] = useState(false)
  const [timeSlots, setTimeSlots] = useState<SpecialTimeSlot[]>([
    {
      id: `slot-${Date.now()}`,
      start: "10:00 AM",
      end: "12:00 PM",
      display: "10:00 AM - 12:00 PM",
      available: true,
      maxOrders: 20,
    },
  ])

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return

      try {
        const hasAdminRole = await checkUserRole(user, ["admin"])
        setIsAdmin(hasAdminRole)
        if (!hasAdminRole) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error checking admin role:", error)
        router.push("/dashboard")
      }
    }

    checkAdmin()
  }, [user, router])

  useEffect(() => {
    const fetchSpecialEvents = async () => {
      if (!user || !isAdmin) return

      try {
        const eventsRef = collection(db, "specialEvents")
        const eventsQuery = query(eventsRef, orderBy("startDate", "desc"))
        const eventsSnapshot = await getDocs(eventsQuery)

        const eventsData: SpecialEvent[] = []
        eventsSnapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() } as SpecialEvent)
        })

        setEvents(eventsData)
      } catch (error) {
        console.error("Error fetching special events:", error)
        setError("Failed to load special events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchSpecialEvents()
    }
  }, [user, isAdmin])

  const resetForm = () => {
    setEventName("")
    setEventDescription("")
    setStartDate("")
    setEndDate("")
    setIsHoliday(false)
    setIsActive(true)
    setSpecialMenu(false)
    setSpecialPricing(false)
    setTimeSlots([
      {
        id: `slot-${Date.now()}`,
        start: "10:00 AM",
        end: "12:00 PM",
        display: "10:00 AM - 12:00 PM",
        available: true,
        maxOrders: 20,
      },
    ])
    setEditingEvent(null)
  }

  const handleEditEvent = (event: SpecialEvent) => {
    setEditingEvent(event)
    setEventName(event.name)
    setEventDescription(event.description)
    setStartDate(event.startDate)
    setEndDate(event.endDate)
    setIsHoliday(event.isHoliday)
    setIsActive(event.active)
    setSpecialMenu(event.specialMenu || false)
    setSpecialPricing(event.specialPricing || false)
    setTimeSlots(event.timeSlots)
    setShowForm(true)
  }

  const handleAddTimeSlot = () => {
    const newSlot: SpecialTimeSlot = {
      id: `slot-${Date.now()}`,
      start: "10:00 AM",
      end: "12:00 PM",
      display: "10:00 AM - 12:00 PM",
      available: true,
      maxOrders: 20,
    }
    setTimeSlots([...timeSlots, newSlot])
  }

  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
  }

  const handleTimeSlotChange = (id: string, field: keyof SpecialTimeSlot, value: any) => {
    setTimeSlots(
      timeSlots.map((slot) => {
        if (slot.id === id) {
          const updatedSlot = { ...slot, [field]: value }

          // Update display if start or end time changes
          if (field === "start" || field === "end") {
            updatedSlot.display = `${updatedSlot.start} - ${updatedSlot.end}`
          }

          return updatedSlot
        }
        return slot
      }),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventName || !eventDescription || !startDate || !endDate || timeSlots.length === 0) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const eventData: Omit<SpecialEvent, "id"> = {
        name: eventName,
        description: eventDescription,
        startDate,
        endDate,
        isHoliday,
        active: isActive,
        timeSlots,
        specialMenu,
        specialPricing,
      }

      if (editingEvent) {
        // Update existing event
        await updateDoc(doc(db, "specialEvents", editingEvent.id), eventData)

        // Update local state
        setEvents(
          events.map((event) =>
            event.id === editingEvent.id ? { ...event, ...eventData, id: editingEvent.id } : event,
          ),
        )
      } else {
        // Create new event with a generated ID
        const newId = `event-${Date.now()}`
        await setDoc(doc(db, "specialEvents", newId), eventData)

        // Update local state
        setEvents([{ id: newId, ...eventData } as SpecialEvent, ...events])
      }

      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error("Error saving special event:", error)
      setError("Failed to save special event. Please try again.")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this special event?")) return

    try {
      await deleteDoc(doc(db, "specialEvents", eventId))

      // Update local state
      setEvents(events.filter((event) => event.id !== eventId))
    } catch (error) {
      console.error("Error deleting special event:", error)
      setError("Failed to delete special event. Please try again.")
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Special Events & Holidays</h1>
          <Link href="/admin" className="text-blue-600 hover:underline flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </Link>
        </div>

        {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <div className="mb-6">
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Cancel" : "Add New Special Event"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingEvent ? "Edit Special Event" : "Create Special Event"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name*
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="eventDescription"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date*
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date*
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isHoliday}
                      onChange={(e) => setIsHoliday(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Holiday (Replaces Regular Hours)</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={specialMenu}
                      onChange={(e) => setSpecialMenu(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Special Menu</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={specialPricing}
                      onChange={(e) => setSpecialPricing(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Special Pricing</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Time Slots*</h3>
                  <button
                    type="button"
                    onClick={handleAddTimeSlot}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    Add Time Slot
                  </button>
                </div>

                {timeSlots.map((slot, index) => (
                  <div key={slot.id} className="border p-4 rounded-md mb-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Time Slot {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(slot.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={timeSlots.length === 1}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="text"
                          value={slot.start}
                          onChange={(e) => handleTimeSlotChange(slot.id, "start", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 10:00 AM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="text"
                          value={slot.end}
                          onChange={(e) => handleTimeSlotChange(slot.id, "end", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 12:00 PM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Orders</label>
                        <input
                          type="number"
                          value={slot.maxOrders || ""}
                          onChange={(e) =>
                            handleTimeSlotChange(slot.id, "maxOrders", Number.parseInt(e.target.value) || undefined)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 20"
                        />
                      </div>

                      {specialPricing && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Price (% discount)
                          </label>
                          <input
                            type="number"
                            value={slot.specialPrice || ""}
                            onChange={(e) =>
                              handleTimeSlotChange(
                                slot.id,
                                "specialPrice",
                                Number.parseInt(e.target.value) || undefined,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 10"
                          />
                        </div>
                      )}

                      <div className="md:col-span-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={slot.available}
                            onChange={(e) => handleTimeSlotChange(slot.id, "available", e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Available</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl mb-4">No special events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{event.name}</h2>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.isHoliday && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Holiday</span>
                        )}
                        {event.specialMenu && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Special Menu
                          </span>
                        )}
                        {event.specialPricing && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Special Pricing
                          </span>
                        )}
                        {!event.active && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>
                        )}
                      </div>
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">Dates:</span> {new Date(event.startDate).toLocaleDateString()}{" "}
                          to {new Date(event.endDate).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Time Slots:</span> {event.timeSlots.length}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditEvent(event)} className="p-1 text-blue-600 hover:text-blue-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
