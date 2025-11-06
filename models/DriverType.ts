export interface DriverType {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string; // Hex color code
  first_name: string;
  last_name: string;
  headshot_url: string | null;
  country_code: string | null;
}
