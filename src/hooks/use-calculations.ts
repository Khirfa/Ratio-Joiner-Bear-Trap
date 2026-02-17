import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Calculation, InsertCalculation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCalculations() {
  return useQuery({
    queryKey: [api.calculations.list.path],
    queryFn: async () => {
      const res = await fetch(api.calculations.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.calculations.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCalculation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCalculation) => {
      const res = await fetch(api.calculations.create.path, {
        method: api.calculations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.calculations.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to save calculation");
      }
      return api.calculations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calculations.list.path] });
      toast({
        title: "Saved!",
        description: "Calculation saved to history.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCalculation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.calculations.delete.path, { id });
      const res = await fetch(url, { method: api.calculations.delete.method });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Calculation not found");
        throw new Error("Failed to delete calculation");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calculations.list.path] });
      toast({
        title: "Deleted",
        description: "Calculation removed from history.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
