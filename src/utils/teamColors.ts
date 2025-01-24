interface TeamColors {
  [key: string]: {
    from: string;
    to: string;
  };
}

export const teamColors: TeamColors = {
  // Spanish Teams
  "FC Barcelona": {
    from: "#A50044",
    to: "#004D98",
  },
  "Real Madrid CF": {
    from: "#00529F",
    to: "#FFFFFF",
  },
  "Atlético Madrid": {
    from: "#CB3524",
    to: "#1C4A98",
  },

  // English Teams
  "Manchester City FC": {
    from: "#6CABDD",
    to: "#1C2C5B",
  },
  "Manchester United FC": {
    from: "#DA291C",
    to: "#000000",
  },
  "Liverpool FC": {
    from: "#C8102E",
    to: "#00B2A9",
  },
  "Arsenal FC": {
    from: "#EF0107",
    to: "#063672",
  },
  "Chelsea FC": {
    from: "#034694",
    to: "#0A4595",
  },

  // German Teams
  "Bayern München": {
    from: "#DC052D",
    to: "#0066B2",
  },
  "Borussia Dortmund": {
    from: "#FDE100",
    to: "#000000",
  },

  // Default colors if team not found
  default: {
    from: "#10B981",
    to: "#047857",
  },
};
