"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { DeliveryMethod, DeliveryInfo, DeliveryZone, PickupLocation } from "@/utils/deliveryTypes"
import type { SpecialEvent } from "@/utils/eventTypes"
import { getDeliveryZones, getPickupLocations } from "@/utils/deliveryUtils"
import { getAvailableDates, getSpecialEventsForDate } from "@/utils/scheduleUtils"

interface DeliveryContextType {
  deliveryZones: DeliveryZone[]
  pickupLocations: PickupLocation[]
  selectedMethod: DeliveryMethod
  deliveryInfo: DeliveryInfo | null
  availableDates: Date[]
  isScheduled: boolean
  setIsScheduled: (isScheduled: boolean) => void
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  selectedTimeSlot: string | null
  setSelectedTimeSlot: (timeSlot: string | null) => void
  setSelectedMethod: (method: DeliveryMethod) => void
  updateDeliveryInfo: (info: Partial<DeliveryInfo>) => void
  clearDeliveryInfo: () => void
  isLoading: boolean
  specialEvents: SpecialEvent[]
  selectedSpecialEvent: SpecialEvent | null
  setSelectedSpecialEvent: (event: SpecialEvent | null) => void
  refreshSpecialEvents: (date: Date) => Promise<void>
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined)

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([])
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([])
  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod>("delivery")
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [isScheduled, setIsScheduled] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([])
  const [selectedSpecialEvent, setSelectedSpecialEvent] = useState<SpecialEvent | null>(null)

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        setIsLoading(true)
        const zones = await getDeliveryZones()
        const locations = await getPickupLocations()

        setDeliveryZones(zones)
        setPickupLocations(locations)

        // Set available dates for scheduling
        setAvailableDates(getAvailableDates())
      } catch (error) {
        console.error("Error fetching delivery options:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeliveryOptions()
  }, [])

  // Update delivery info when scheduling options change
  useEffect(() => {
    if (isScheduled && selectedDate && selectedTimeSlot) {
      updateDeliveryInfo({
        isScheduled,
        scheduledTime: {
          date: selectedDate,
          timeSlot: selectedTimeSlot,
        },
        specialEvent: selectedSpecialEvent ? selectedSpecialEvent.id : undefined,
      })
    } else if (!isScheduled) {
      updateDeliveryInfo({
        isScheduled: false,
        scheduledTime: undefined,
        specialEvent: undefined,
      })
    }
  }, [isScheduled, selectedDate, selectedTimeSlot, selectedSpecialEvent])

  // Fetch special events when date changes
  const refreshSpecialEvents = async (date: Date) => {
    if (date) {
      const events = await getSpecialEventsForDate(date)
      setSpecialEvents(events)

      // Clear selected special event if it's not available on this date
      if (selectedSpecialEvent && !events.some((e) => e.id === selectedSpecialEvent.id)) {
        setSelectedSpecialEvent(null)
      }
    } else {
      setSpecialEvents([])
      setSelectedSpecialEvent(null)
    }
  }

  // Update special events when selected date changes
  useEffect(() => {
    if (selectedDate) {
      refreshSpecialEvents(selectedDate)
    } else {
      setSpecialEvents([])
      setSelectedSpecialEvent(null)
    }
  }, [selectedDate])

  const updateDeliveryInfo = (info: Partial<DeliveryInfo>) => {
    setDeliveryInfo((prev) => {
      if (!prev) {
        return {
          method: "delivery",
          isScheduled: false,
          estimatedTime: "",
          fee: 0,
          contactPhone: "",
          ...info,
        } as DeliveryInfo
      }
      return { ...prev, ...info }
    })
  }

  const clearDeliveryInfo = () => {
    setDeliveryInfo(null)
    setIsScheduled(false)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
    setSelectedSpecialEvent(null)
  }

  return (
    <DeliveryContext.Provider
      value={{
        deliveryZones,
        pickupLocations,
        selectedMethod,
        deliveryInfo,
        availableDates,
        isScheduled,
        setIsScheduled,
        selectedDate,
        setSelectedDate,
        selectedTimeSlot,
        setSelectedTimeSlot,
        setSelectedMethod,
        updateDeliveryInfo,
        clearDeliveryInfo,
        isLoading,
        specialEvents,
        selectedSpecialEvent,
        setSelectedSpecialEvent,
        refreshSpecialEvents,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  )
}

export function useDelivery() {
  const context = useContext(DeliveryContext)
  if (context === undefined) {
    throw new Error("useDelivery must be used within a DeliveryProvider")
  }
  return context
}
