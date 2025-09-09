import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../querykey";
import { monitoringService } from "../services/monitoring.service";

export const useMonitoring = () => {
  return useQuery({
    queryKey: [queryKeys.monitoring.get],
    queryFn: () => {
      return monitoringService.getMonitoring();
    },
  });
};
