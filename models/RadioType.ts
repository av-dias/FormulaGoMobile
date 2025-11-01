export interface F1RadioData {
  /**
   * The UTC date and time when the radio message was recorded, in ISO 8601 format.
   * Example: '2025-10-26T17:20:11Z'
   */
  date: string;

  /**
   * The unique number assigned to the F1 driver who sent or received the message.
   */
  driver_number: number;

  /**
   * The unique identifier for the race meeting (e.g., Miami Grand Prix).
   * Can be a number or the string 'latest' for API requests.
   */
  meeting_key: number | string;

  /**
   * The URL pointing to the audio recording of the radio transmission.
   */
  recording_url: string;

  /**
   * The unique identifier for the specific session (e.g., FP1, Race).
   * Can be a number or the string 'latest' for API requests.
   */
  session_key: number | string;
}
