export const fetchWithTimeout = (
  url: string,
  timeout = 5000
): Promise<Response> =>
  Promise.race([
    fetch(url),
    new Promise<Response>((_, reject) => setTimeout(() => reject(), timeout)),
  ]);
