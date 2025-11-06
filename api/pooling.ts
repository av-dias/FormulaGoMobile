// Set the polling interval to 60 seconds (60000 milliseconds)
const REFRESH_INTERVAL_MS = 60000;

export function PoolingApi(
  fetchData: () => void | Promise<void>,
  refresh = REFRESH_INTERVAL_MS
) {
  console.log("[Auto-Refresh] Polling started.");

  // 1. Initial fetch when the component mounts
  fetchData();

  // 2. Set the interval to call fetchData every 30 seconds
  const intervalId = setInterval(fetchData, refresh);

  // 3. Cleanup function: Clears the interval when the component unmounts
  return () => {
    clearInterval(intervalId);
    console.log("[Auto-Refresh] Polling stopped (Component unmounted).");
  };
}
