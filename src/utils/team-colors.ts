interface TeamColors {
  from: string;
  to: string;
}

const teamColors: Record<number, TeamColors> = {
  // Premier League
  57: { from: "#DA291C", to: "#FBE122" }, // Arsenal
  61: { from: "#95BFE5", to: "#7A003C" }, // Chelsea
  64: { from: "#C8102E", to: "#1D1D1B" }, // Liverpool
  65: { from: "#6CABDD", to: "#1C2C5B" }, // Manchester City
  66: { from: "#DA291C", to: "#FBE122" }, // Manchester United
  73: { from: "#132257", to: "#FFFFFF" }, // Tottenham

  // La Liga
  77: { from: "#004D98", to: "#A50044" }, // Athletic Club
  78: { from: "#CD122D", to: "#004899" }, // Atlético Madrid
  81: { from: "#004D98", to: "#FFED00" }, // Barcelona
  86: { from: "#FFFFFF", to: "#00529F" }, // Real Madrid

  // Bundesliga
  4: { from: "#E32219", to: "#000000" }, // Bayer Leverkusen
  5: { from: "#DD0741", to: "#0066B2" }, // Bayern München
  6: { from: "#FDE100", to: "#000000" }, // Borussia Dortmund

  // Serie A
  98: { from: "#000000", to: "#0B1560" }, // AC Milan
  100: { from: "#1B1B1B", to: "#0066B2" }, // AS Roma
  108: { from: "#000000", to: "#FFFFFF" }, // Inter
  109: { from: "#000000", to: "#FFFFFF" }, // Juventus

  // Default colors
  0: { from: "#047857", to: "#065f46" }, // Default emerald gradient
};

export function getTeamColors(teamId: number): TeamColors {
  return teamColors[teamId] || teamColors[0];
}
