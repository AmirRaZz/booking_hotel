import useFetch from "@/hooks/useFetch";
import { HotelType } from "@/types/hotel";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

type BookmarkContextType = {
  bookmarks: HotelType[];
  isLoading: boolean;
  getBookmark: (id: string | undefined) => void;
  currentBookmark: HotelType | null;
  isLoadingCurrentBookmark: boolean;
};

const BookmarkContext = createContext({} as BookmarkContextType);
const BASE_URL = "http://localhost:5000";

function BookmarkListProvider({ children }: { children: React.ReactNode }) {
  const [currentBookmark, setCurrentBookmark] = useState<HotelType | null>(null);
  const [isLoadingCurrentBookmark, setIsLoadingCurrentBookmark] = useState(false);
  const { isLoading, data: bookmarks } = useFetch(`${BASE_URL}/bookmarks`, "");

  async function getBookmark(id: string | undefined) {
    if (!id) return;

    setIsLoadingCurrentBookmark(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/bookmarks/${id}`);
      setCurrentBookmark(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoadingCurrentBookmark(false);
    }
  }

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        isLoading,
        getBookmark,
        currentBookmark,
        isLoadingCurrentBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export default BookmarkListProvider;

export function useBookmark() {
  return useContext(BookmarkContext);
}
