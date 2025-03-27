import useFetch from "@/hooks/useFetch";
import { BookmarkType } from "@/types/book";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

type BookmarkContextType = {
  bookmarks: BookmarkType[];
  isLoading: boolean;
  getBookmark: (id: string | undefined) => void;
  currentBookmark: BookmarkType | null;
  isLoadingCurrentBookmark: boolean;
};

const BookmarkContext = createContext({} as BookmarkContextType);
const BASE_URL = "http://localhost:5000";

function BookmarkListProvider({ children }: { children: React.ReactNode }) {
  const [currentBookmark, setCurrentBookmark] = useState<BookmarkType | null>(
    null
  );
  const [isLoadingCurrentBookmark, setIsLoadingCurrentBookmark] =
    useState(false);
  const { isLoading, data: bookmarks } = useFetch(`${BASE_URL}/bookmarks`, "");

  async function getBookmark(id: string | undefined) {
    if (!id) return;

    setIsLoadingCurrentBookmark(true);
    setCurrentBookmark(null);
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
