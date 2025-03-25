import useFetch from "@/hooks/useFetch";
import { HotelType } from "@/types/hotel";
import { createContext, useContext } from "react";
import { useSearchParams } from "react-router";

type HotelContextType = {
  hotels: HotelType[];
  isLoading: boolean;
};
const HotelContext = createContext({} as HotelContextType);

function HotelsProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination") || "";
  const room = JSON.parse(searchParams.get("options") || "[]").room;
  const { data: hotels, isLoading } = useFetch(
    "http://localhost:5000/hotels",
    `q=${destination || ""}&accommodates_gte=${room || 1}`
  );

  return <HotelContext.Provider value={{hotels,isLoading}}>{children}</HotelContext.Provider>;
}

export default HotelsProvider;

export function useHotels() {
  return useContext(HotelContext);
}

