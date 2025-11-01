// Set the polling interval to 60 seconds (60000 milliseconds)
const REFRESH_INTERVAL_MS = 60000;

export async function PoolingApi(fetchData: () => any) {
  console.log("[Auto-Refresh] Polling started.");

  // 1. Initial fetch when the component mounts
  fetchData();

  // 2. Set the interval to call fetchData every 30 seconds
  const intervalId = setInterval(fetchData, REFRESH_INTERVAL_MS);

  // 3. Cleanup function: Clears the interval when the component unmounts
  return () => {
    clearInterval(intervalId);
    console.log("[Auto-Refresh] Polling stopped (Component unmounted).");
  };
}
