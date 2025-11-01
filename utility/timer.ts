/**
 * Allows to trigger a future callback
 
 * @param timeoutRef    timer reference
 * @param callback      callback action
 * @param time          amount of time to wait
 */
export const loadTimer = (timeoutRef: React.MutableRefObject<any>, callback: any, time: number) => {
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    callback();
  }, time);
};
