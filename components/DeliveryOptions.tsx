"use client"

import { useState, useEffect } from "react"
import { useDelivery } from "@/contexts/DeliveryContext"
import { isZipCodeInDeliveryArea, calculateDeliveryFee } from "@/utils/deliveryUtils"
import ScheduleSelector from "./ScheduleSelector"

interface DeliveryOptionsProps {
  subtotal: number
  onFeeChange: (fee: number) => void
}

export default function DeliveryOptions({ subtotal, onFeeChange }: DeliveryOptionsProps) {
  const {
    deliveryZones,
    pickupLocations,
    selectedMethod,
    setSelectedMethod,
    updateDeliveryInfo,
    isLoading,
    isScheduled,
    setIsScheduled,
  } = useDelivery()

  const [street, setStreet] = useState("")
  const [apt, setApt] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [instructions, setInstructions] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [deliveryZone, setDeliveryZone] = useState<any>(null)
  const [deliveryError, setDeliveryError] = useState("")

  // Check if zip code is in delivery area when it changes
  useEffect(() => {
    if (zipCode.length === 5 && selectedMethod === "delivery") {
      const zone = isZipCodeInDeliveryArea(zipCode, deliveryZones)
      setDeliveryZone(zone)

      if (!zone) {
        setDeliveryError("Sorry, we don't deliver to this area yet.")
        onFeeChange(0)
      } else {
        setDeliveryError("")
        const fee = calculateDeliveryFee(subtotal, zone)
        onFeeChange(fee)

        // Update delivery info in context
        updateDeliveryInfo({
          method: "delivery",
          fee,
          estimatedTime: zone.estimatedTime,
          address: {
            street,
            apt,
            city,
            state,
            zipCode,
            instructions,
          },
          contactPhone,
          isScheduled,
        })
      }
    }
  }, [
    zipCode,
    selectedMethod,
    deliveryZones,
    subtotal,
    onFeeChange,
    updateDeliveryInfo,
    street,
    apt,
    city,
    state,
    instructions,
    contactPhone,
    isScheduled,
  ])

  // Update delivery info when pickup location changes
  useEffect(() => {
    if (selectedMethod === "pickup" && selectedLocation) {
      const location = pickupLocations.find((loc) => loc.id === selectedLocation)
      if (location) {
        onFeeChange(0) // No fee for pickup

        // Update delivery info in context
        updateDeliveryInfo({
          method: "pickup",
          fee: 0,
          estimatedTime: location.estimatedTime,
          pickupLocation: selectedLocation,
          contactPhone,
          isScheduled,
        })
      }
    }
  }, [selectedMethod, selectedLocation, pickupLocations, onFeeChange, updateDeliveryInfo, contactPhone, isScheduled])

  // Set default pickup location when options load
  useEffect(() => {
    if (pickupLocations.length > 0 && selectedMethod === "pickup" && !selectedLocation) {
      setSelectedLocation(pickupLocations[0].id)
    }
  }, [pickupLocations, selectedMethod, selectedLocation])

  const handleMethodChange = (method: "delivery" | "pickup") => {
    setSelectedMethod(method)

    // Reset delivery error when switching methods
    if (method === "pickup") {
      setDeliveryError("")
      onFeeChange(0)
    } else if (zipCode.length === 5) {
      // Recheck delivery zone if switching back to delivery
      const zone = isZipCodeInDeliveryArea(zipCode, deliveryZones)
      setDeliveryZone(zone)

      if (!zone) {
        setDeliveryError("Sorry, we don't deliver to this area yet.")
        onFeeChange(0)
      } else {
        setDeliveryError("")
        const fee = calculateDeliveryFee(subtotal, zone)
        onFeeChange(fee)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>

      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => handleMethodChange("delivery")}
          className={`flex-1 py-2 rounded-md ${
            selectedMethod === "delivery" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Delivery
        </button>
        <button
          type="button"
          onClick={() => handleMethodChange("pickup")}
          className={`flex-1 py-2 rounded-md ${
            selectedMethod === "pickup" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Pickup
        </button>
      </div>

      {/* Schedule toggle */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Schedule for later</span>
        </label>
      </div>

      {/* Schedule selector */}
      <ScheduleSelector />

      {selectedMethod === "delivery" ? (
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address*
            </label>
            <input
              type="text"
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="apt" className="block text-sm font-medium text-gray-700 mb-1">
              Apartment/Suite (Optional)
            </label>
            <input
              type="text"
              id="apt"
              value={apt}
              onChange={(e) => setApt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City*
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State*
              </label>
              <input
                type="text"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code*
            </label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={5}
              required
            />
          </div>

          {deliveryError && <div className="p-3 bg-red-100 text-red-700 rounded-md">{deliveryError}</div>}

          {deliveryZone && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              <p>Delivery available to {deliveryZone.name}</p>
              {!isScheduled && <p>Estimated delivery time: {deliveryZone.estimatedTime}</p>}
              <p>Delivery fee: ${(deliveryZone.fee / 100).toFixed(2)}</p>
              {subtotal < deliveryZone.minimumOrderAmount && (
                <p className="font-medium mt-1">
                  Minimum order for delivery: ${(deliveryZone.minimumOrderAmount / 100).toFixed(2)}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location*
            </label>
            <select
              id="pickupLocation"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {pickupLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {selectedLocation && (
            <div className="p-3 bg-blue-100 text-blue-700 rounded-md">
              {pickupLocations.find((loc) => loc.id === selectedLocation)?.address}
              <p className="mt-1">Hours: {pickupLocations.find((loc) => loc.id === selectedLocation)?.hours}</p>
              {!isScheduled && (
                <p>
                  Estimated preparation time:{" "}
                  {pickupLocations.find((loc) => loc.id === selectedLocation)?.estimatedTime}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Phone*
        </label>
        <input
          type="tel"
          id="contactPhone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="(123) 456-7890"
          required
        />
      </div>
    </div>
  )
}
