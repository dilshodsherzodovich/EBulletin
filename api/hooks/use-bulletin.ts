import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bulletinService } from "../services/bulletin.service";
import { queryKeys } from "../querykey";
import { BulletinCreateBody } from "../types/bulleten";

export const useBulletin = (params: { page: number }) => {
  return useQuery({
    queryKey: [queryKeys.bulletins.list, { ...params }],
    queryFn: () => {
      return bulletinService.getBulletins(params);
    },
  });
};

export const useCreateBulletin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeys.bulletins.create],
    mutationFn: (data: BulletinCreateBody) =>
      bulletinService.createBulletin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bulletins.list] });
    },
  });
};

export const useUpdateBulletin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeys.bulletins.edit],
    mutationFn: ({ id, data }: { id: string; data: BulletinCreateBody }) =>
      bulletinService.updateBulletin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bulletins.list] });
    },
  });
};

export const useDeleteBulletin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeys.bulletins.delete],
    mutationFn: (id: string) => bulletinService.deleteBulletin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bulletins.list] });
    },
  });
};
