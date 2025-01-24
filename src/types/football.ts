export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  area: Area;
  currentSeason?: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday?: number;
  };
}

export interface CompetitionsResponse {
  count: number;
  competitions: Competition[];
}
