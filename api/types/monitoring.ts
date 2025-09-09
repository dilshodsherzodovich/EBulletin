export interface MonitoringOrganization {
  id: string;
  name: string;
  total_count: number;
  on_time_count: number;
  late_count: number;
  missed_count: number;
  on_time_percentage: number;
  late_percentage: number;
  missed_percentage: number;
}

export interface MonitoringTotalStats {
  total_count: number;
  on_time_count: number;
  late_count: number;
  missed_count: number;
  on_time_percentage: number;
  late_percentage: number;
  missed_percentage: number;
}

export interface MonitoringResults {
  total_stats: MonitoringTotalStats;
  organizations: MonitoringOrganization[];
}

export interface MonitoringApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MonitoringResults;
}
