import useSWR from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch room details');
  }
  return response.json();
};

const useRoomDetails = (roomId) => {
  const { data, error, isLoading } = useSWR(
    roomId ? `${import.meta.env.VITE_BASE_URL}/api/rooms/${roomId}` : null,
    fetcher
  );

  return {
    room: data,
    isLoading,
    isError: error,
  };
};

export default useRoomDetails;