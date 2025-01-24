import { useQuery } from "@tanstack/react-query";
import { fetchFromAPI } from "@/lib/api-config";
import { Competition, CompetitionsResponse } from "@/types/football";

export const useFootballData = () => {
  const { data, isLoading, error } = useQuery<CompetitionsResponse>({
    queryKey: ["competitions"],
    queryFn: () => fetchFromAPI("/competitions"),
  });

  const organizedData = data?.competitions.reduce((acc, competition) => {
    const areaName = competition.area.name;
    if (!acc[areaName]) {
      acc[areaName] = {
        area: competition.area,
        competitions: [],
      };
    }
    acc[areaName].competitions.push(competition);
    return acc;
  }, {} as Record<string, { area: Competition["area"]; competitions: Competition[] }>);

  return {
    organizedData: organizedData || {},
    isLoading,
    error,
  };
};
