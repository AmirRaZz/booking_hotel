import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useFetch(url: string, query: string) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${url}?${query}`);
        setData(data);
      } catch (err: unknown) {
        setData([]);
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.error || "An error occurred");
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query, url]);
  return { data, isLoading };
}
