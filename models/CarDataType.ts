/**
 * Represents a single snapshot of F1 car telemetry and session data.
 */
export type CarDataType = {
  /**
   * Whether the brake pedal is pressed (100) or not (0).
   * Values range from 0 (off) to 100 (fully pressed).
   */
  brake: number;

  /**
   * The UTC date and time when the data was recorded, in ISO 8601 format.
   * e.g., "2025-10-26T17:20:11.000Z"
   */
  date: string;

  /**
   * The unique number assigned to an F1 driver.
   */
  driver_number: number;

  /**
   * The Drag Reduction System (DRS) status.
   * (The value depends on the external mapping table, but is often an integer or string).
   */
  drs: number | string;

  /**
   * The unique identifier for the meeting. 'latest' can be used to identify the current meeting.
   */
  meeting_key: number | string;

  /**
   * Current gear selection, ranging from 1 to 8. 0 indicates neutral or no gear engaged.
   */
  n_gear: number;

  /**
   * Revolutions per minute of the engine.
   */
  rpm: number;

  /**
   * The unique identifier for the session. 'latest' can be used to identify the current session.
   */
  session_key: number | string;

  /**
   * Velocity of the car in kilometers per hour (km/h).
   */
  speed: number;

  /**
   * Percentage of maximum engine power being used (0 to 100).
   */
  throttle: number;
};
