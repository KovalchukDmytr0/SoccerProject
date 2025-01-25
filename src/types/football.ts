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

export interface PersonDetails extends Player {
  currentTeam: Team & {
    contract: {
      start: string;
      until: string;
    };
  };
  section: string;
  age: number;
  birthCountry: string;
  birthPlace?: string;
  nationality: string;
  height?: string;
  weight?: string;
  marketValue?: string;
  lastUpdated: string;
}

export interface TeamDetails extends Team {
  area: Area;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  coach: {
    id: number;
    name: string;
    nationality: string;
    contract: {
      start: string;
      until: string;
    };
  };
  squad: (Player & {
    dateOfBirth: string;
    nationality: string;
    position: string;
  })[];
  staff: {
    id: number;
    name: string;
    nationality: string;
    role: string;
  }[];
  runningCompetitions: Competition[];
  lastUpdated: string;
}
