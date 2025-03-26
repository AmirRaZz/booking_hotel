import useFetch from "@/hooks/useFetch";
import { HotelType } from "@/types/hotel";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router";

type HotelContextType = {
  hotels: HotelType[];
  isLoading: boolean;
  getHotel: (id: string | undefined) => void;
  currentHotel: HotelType | null;
  isLoadingCurrentHotel: boolean;
};

const HotelContext = createContext({} as HotelContextType);
const BASE_URL = "http://localhost:5000/hotels";

function HotelsProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const [currentHotel, setCurrentHotel] = useState<HotelType | null>(null);
  const [isLoadingCurrentHotel, setIsLoadingCurrentHotel] = useState(false);
  const destination = searchParams.get("destination") || "";
  const room = JSON.parse(searchParams.get("options") || "[]").room;
  const { data: hotels, isLoading } = useFetch(
    BASE_URL,
    `q=${destination || ""}&accommodates_gte=${room || 1}`
  );

  async function getHotel(id: string | undefined) {
    if (!id) return;

    setIsLoadingCurrentHotel(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`);
      setCurrentHotel(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoadingCurrentHotel(false);
    }
  }

  return (
    <HotelContext.Provider
      value={{
        hotels,
        isLoading,
        getHotel,
        currentHotel,
        isLoadingCurrentHotel,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

export default HotelsProvider;

export function useHotels() {
  return useContext(HotelContext);
}
