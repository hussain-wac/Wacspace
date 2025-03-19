// src/hooks/useRooms.js
import useSWR from "swr";
import axios from "axios";

// Fetcher function for SWR using Axios
const fetcher = (url) => axios.get(url).then((res) => res.data);

const useRooms = (date) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/api/rooms/availability/${date}`;

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false, 
    refreshInterval: 60000, 
  });

  // console.log(data)
  return {
    rooms: data || [],
    isLoading,
    isError: error,
  };
};

export default useRooms;