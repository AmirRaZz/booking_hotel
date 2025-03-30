import { BookmarkType } from "@/types/book";
import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import toast from "react-hot-toast";

type BookmarkContextType = {
  bookmarks: BookmarkType[];
  isLoading: boolean;
  getBookmark: (id: string | undefined) => void;
  createBookmark: (newBookmark: BookmarkType) => Promise<void>;
  currentBookmark: BookmarkType | null;
  deleteBookmark: (id: number) => void;
};

const BookmarkContext = createContext({} as BookmarkContextType);
const BASE_URL = "http://localhost:5000";

type BookmarkState = {
  bookmarks: BookmarkType[];
  currentBookmark: BookmarkType | null;
  isLoading: boolean;
  error: unknown | null;
};

type BookmarkAction =
  | { type: "loading" }
  | { type: "bookmarks/loaded"; payload: BookmarkType[] }
  | { type: "bookmark/loaded"; payload: BookmarkType }
  | { type: "bookmark/created"; payload: BookmarkType }
  | { type: "bookmark/deleted"; payload: number }
  | { type: "rejected"; payload: unknown };

const initialState: BookmarkState = {
  bookmarks: [],
  currentBookmark: null,
  isLoading: false,
  error: null,
};

function bookmarkReducer(state: BookmarkState, action: BookmarkAction) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "bookmarks/loaded":
      return { ...state, isLoading: false, bookmarks: action.payload };
    case "bookmark/loaded":
      return { ...state, isLoading: false, currentBookmark: action.payload };
    case "bookmark/created":
      return {
        ...state,
        isLoading: false,
        bookmarks: [...state.bookmarks, action.payload],
        currentBookmark: action.payload,
      };
    case "bookmark/deleted":
      return {
        ...state,
        isLoading: false,
        bookmarks: state.bookmarks.filter(
          (bookmark: BookmarkType) => bookmark.id !== action.payload
        ),
        currentBookmark: null,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Invalid action");
  }
}

function BookmarkListProvider({ children }: { children: React.ReactNode }) {
  const [{ bookmarks, currentBookmark, isLoading }, dispatch] = useReducer(
    bookmarkReducer,
    initialState
  );

  useEffect(() => {
    async function fetchBookmarkList() {
      dispatch({ type: "loading" });
      try {
        const { data } = await axios.get(`${BASE_URL}/bookmarks`);
        dispatch({ type: "bookmarks/loaded", payload: data });
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong!");
          dispatch({ type: "rejected", payload: error });
        }
      }
    }
    fetchBookmarkList();
  }, []);

  async function getBookmark(id: string | undefined) {
    if (currentBookmark?.id === Number(id)) return;

    dispatch({ type: "loading" });
    try {
      const { data } = await axios.get(`${BASE_URL}/bookmarks/${id}`);
      dispatch({ type: "bookmark/loaded", payload: data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
        dispatch({ type: "rejected", payload: error });
      }
    }
  }

  async function createBookmark(newBookmark: BookmarkType) {
    dispatch({ type: "loading" });
    try {
      const { data } = await axios.post(`${BASE_URL}/bookmarks`, newBookmark);
      toast.success("Bookmark created successfully!");
      dispatch({ type: "bookmark/created", payload: data });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
      dispatch({ type: "rejected", payload: error });
    }
  }

  async function deleteBookmark(id: number) {
    dispatch({ type: "loading" });
    try {
      await axios.delete(`${BASE_URL}/bookmarks/${id}`);
      toast.success("Bookmark deleted successfully!");
      dispatch({ type: "bookmark/deleted", payload: id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
      dispatch({ type: "rejected", payload: error });
    }
  }

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        isLoading,
        getBookmark,
        currentBookmark,
        createBookmark,
        deleteBookmark,
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
