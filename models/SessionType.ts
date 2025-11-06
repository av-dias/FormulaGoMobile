import { WeatherType } from "./WeatherType";

export interface SessionType {
  /**
   * The unique identifier for the circuit where the event takes place.
   */
  circuit_key: number;

  /**
   * The short or common name of the circuit where the event takes place (e.g., 'Monaco').
   */
  circuit_short_name: string;

  /**
   * A code (e.g., 'FRA', 'GBR') that uniquely identifies the country.
   */
  country_code: string;

  /**
   * The unique identifier for the country where the event takes place.
   */
  country_key: number;

  /**
   * The full name of the country where the event takes place (e.g., 'United Kingdom').
   */
  country_name: string;

  /**
   * The UTC ending date and time of the session, in ISO 8601 format.
   */
  date_end: string;

  /**
   * The UTC starting date and time of the session, in ISO 8601 format.
   */
  date_start: string;

  /**
   * The difference in hours and minutes between local time at the event
   * and Greenwich Mean Time (GMT). Example: '+02:00'.
   */
  gmt_offset: string;

  /**
   * The city or geographical location where the event takes place.
   */
  location: string;

  /**
   * The unique identifier for the meeting (e.g., the Grand Prix weekend).
   * Can be a number or the string 'latest'.
   */
  meeting_key: number | string;

  /**
   * The unique identifier for the specific session (e.g., FP1, Race).
   * Can be a number or the string 'latest'.
   */
  session_key: number | string;

  /**
   * The name of the session (e.g., 'Practice 1', 'Qualifying', 'Race').
   */
  session_name: string;

  /**
   * The type of the session (e.g., 'Practice', 'Qualifying', 'Race').
   */
  session_type: string;

  /**
   * The year the event takes place.
   */
  year: number;

  /**
   * The weather information.
   */
  weather?: WeatherType;
}
