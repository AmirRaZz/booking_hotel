import { useState } from "react";

export default function useGeoLocation(){
  const [isLoading, setIsLoading]=useState(false)
  const [position, setPosition]=useState({})
  const [error,setError]=useState<string | null>(null)

  function getPosition(){
    if(!navigator.geolocation) return setError("Geolocation is not supported")
    setIsLoading(true)
  navigator.geolocation.getCurrentPosition((pos)=>{
    setPosition({
      lat:pos.coords.latitude,
      lng:pos.coords.longitude
    })
    setIsLoading(false)
  },(error)=>{
    setError(error.message)
    setIsLoading(false)
  })
  }
  return {isLoading,position,error,getPosition}
}