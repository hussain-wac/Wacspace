// src/hooks/useRooms.js
import useSWR from "swr";
import axios from "axios";

// Fetcher function for SWR using Axios
const fetcher = (url) => axios.get(url).then((res) => res.data);

const useRooms = (date) => {
  const apiUrl = `http://localhost:5000/api/rooms/availability/${date}`;

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false, // Optional: Prevents revalidation on window focus
    refreshInterval: 60000, // Optional: Refreshes every 60 seconds
  });

  return {
    rooms: data || [],
    isLoading,
    isError: error,
  };
};

export default useRooms;