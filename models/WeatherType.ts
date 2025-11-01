export interface WeatherType {
  /**
   * The unique identifier for the meeting/race weekend.
   * Can use 'latest' as a string placeholder in API requests, but the returned data is typically a number.
   */
  meeting_key: number;

  /**
   * The unique identifier for the specific session (e.g., FP1, Qualifying, Race).
   * Can use 'latest' as a string placeholder in API requests, but the returned data is typically a number.
   */
  session_key: number;

  /**
   * The UTC date and time when the measurement was taken, in ISO 8601 format.
   * Example: '2025-05-18T13:00:00Z'
   */
  date: string;

  /**
   * Air temperature (°C).
   */
  air_temperature: number;

  /**
   * Track surface temperature (°C).
   */
  track_temperature: number;

  /**
   * Air pressure (mbar).
   */
  pressure: number;

  /**
   * Relative humidity (%).
   */
  humidity: number;

  /**
   * Whether there is rainfall (boolean flag).
   */
  rainfall: boolean;

  /**
   * Wind direction (°), from 0° (North) to 359°.
   */
  wind_direction: number;

  /**
   * Wind speed (m/s).
   */
  wind_speed: number;
}
