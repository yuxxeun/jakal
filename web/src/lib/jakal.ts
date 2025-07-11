import {
  GoodDaysResponse,
  JavaneseDate,
  WetonCompatibility,
} from "@/types/type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

class JakalApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Get today's Javanese date
  async getToday(): Promise<JavaneseDate> {
    return this.fetchApi<JavaneseDate>("/today");
  }

  // Get specific date
  async getByDate(date: string): Promise<JavaneseDate> {
    return this.fetchApi<JavaneseDate>(`/date/${date}`);
  }

  // Get date range
  async getDateRange(start: string, end: string): Promise<JavaneseDate[]> {
    return this.fetchApi<JavaneseDate[]>(`/range/${start}/${end}`);
  }

  // Get dates by year
  async getByYear(year: number): Promise<JavaneseDate[]> {
    return this.fetchApi<JavaneseDate[]>(`/year/${year}`);
  }

  // Get dates by month
  async getByMonth(year: number, month: number): Promise<JavaneseDate[]> {
    return this.fetchApi<JavaneseDate[]>(`/month/${year}/${month}`);
  }

  // Get weton for specific date
  async getWeton(
    date: string,
  ): Promise<{ date: string; weton: string; neptu: number }> {
    return this.fetchApi<{ date: string; weton: string; neptu: number }>(
      `/weton/${date}`,
    );
  }

  // Get neptu for specific date
  async getNeptu(
    date: string,
  ): Promise<{ date: string; neptu: number; description: string }> {
    return this.fetchApi<{ date: string; neptu: number; description: string }>(
      `/neptu/${date}`,
    );
  }

  // Get weton compatibility
  async getWetonCompatibility(
    date1: string,
    date2: string,
  ): Promise<WetonCompatibility> {
    return this.fetchApi<WetonCompatibility>(
      `/compatibility/${date1}/${date2}`,
    );
  }

  // Get good days
  async getGoodDays(
    birthDate: string,
    targetYear: number,
  ): Promise<GoodDaysResponse> {
    return this.fetchApi<GoodDaysResponse>(
      `/good-days/${birthDate}/${targetYear}`,
    );
  }
}

export const jakalApi = new JakalApiService();
