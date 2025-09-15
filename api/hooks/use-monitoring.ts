import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../querykey";
import { monitoringService } from "../services/monitoring.service";

export const useMonitoring = (
  params: { no_page?: boolean } = { no_page: true }
) => {
  return useQuery({
    queryKey: [queryKeys.monitoring.get],
    queryFn: () => {
      return monitoringService.getMonitoring(params);
    },
  });
};
