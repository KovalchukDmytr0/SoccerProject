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

export interface Player {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  position: string;
  shirtNumber?: number;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Scorer {
  player: Player;
  team: Team;
  goals: number;
  assists: number;
  penalties: number;
  playedMatches: number;
  minutesPlayed: number;
}

export interface ScorersResponse {
  competition: Competition;
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner?: Team;
  };
  scorers: Scorer[];
}
