import { useQuery } from "@tanstack/react-query";
import { classificatorDetailService } from "../services/classificator-detail.service";
import { queryKeys } from "../querykey";

export const useGetClassificatorDetail = (id: string) => {
  if (!id) return;
  return useQuery({
    queryKey: [queryKeys.classificators.detail(id)],
    queryFn: () => classificatorDetailService.getClassificatorDetail(id),
    retry: false,
  });
};
