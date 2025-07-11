export interface JavaneseDate {
  gregorian_date: string;
  javanese_date: string;
  day_name: string;
  pasaran: string;
  weton: string;
  neptu: number;
  year: number;
  month: number;
  day: number;
}

export interface WetonCompatibility {
  date1: string;
  date2: string;
  weton1: string;
  weton2: string;
  neptu1: number;
  neptu2: number;
  compatibility_score: number;
  compatibility_level: string;
  description: string;
}

export interface GoodDaysResponse {
  birth_date: string;
  target_year: number;
  good_days: JavaneseDate[];
  total_days: number;
}
