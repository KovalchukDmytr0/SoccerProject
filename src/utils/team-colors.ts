interface TeamColors {
  from: string;
  to: string;
}

const teamColors: Record<number, TeamColors> = {
  // Premier League
  65: { from: "#A50044", to: "#004D98" }, // Manchester City (Sky Blue to Dark Blue)
  66: { from: "#DA291C", to: "#000000" }, // Manchester United (Red to Black)
  67: { from: "#003399", to: "#FFFFFF" }, // Newcastle (Navy to White)
  73: { from: "#EF0107", to: "#063672" }, // Tottenham (Red to Navy)
  61: { from: "#003875", to: "#8F1516" }, // Chelsea (Blue to Red)
  64: { from: "#EF0107", to: "#023474" }, // Liverpool (Red to Dark Blue)
  57: { from: "#EF0107", to: "#000000" }, // Arsenal (Red to Black)

  // La Liga
  81: { from: "#004D98", to: "#A50044" }, // Barcelona (Blue to Deep Red)
  86: { from: "#00529F", to: "#FFFFFF" }, // Real Madrid (Royal Blue to White)
  78: { from: "#CB3524", to: "#1C4A98" }, // Atletico Madrid (Red to Blue)

  // Bundesliga
  4: { from: "#DC052D", to: "#000000" }, // Bayern Munich (Red to Black)
  4209: { from: "#FDE100", to: "#000000" }, // Borussia Dortmund (Yellow to Black)

  // Default colors if team not found
  default: { from: "#374151", to: "#111827" }, // Default slate gradient
};

export const getTeamColors = (teamId: number): TeamColors => {
  return teamColors[teamId] || teamColors.default;
};
