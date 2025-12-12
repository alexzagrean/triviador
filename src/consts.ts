export const defaultColors = [
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
  { color: "#C1C1C1", base: false },
]

export const defaultLandValues = [
  200,
  200,
  200,
  200,
  200,
  200,
  200,
  200,
  200,
  200,
  200,
  200,
  200,
  200,
  200,
]

export const greenTeamColor = '#236A4D';
export const greenTeamColorLight1 = '#5A965C';
export const greenTeamColorLight2 = '#78B47A';

export const redTeamColor = '#C82817';
export const redTeamColorLight1 = '#FF7878';
export const redTeamColorLight2 = '#FF9696';

export const blueTeamColor = '#FFBA00';
export const blueTeamColorLight1 = '#FFD966';
export const blueTeamColorLight2 = '#FFE699';

export const teamColors = [
  { color: redTeamColor, base: false },
  { color: greenTeamColor, base: false },
  { color: blueTeamColor, base: false },
]


export const mapColorLight1 = (color: string) => {
  switch (color) {
    case redTeamColor:
      return redTeamColorLight1;
    case greenTeamColor:
      return greenTeamColorLight1;
    case blueTeamColor:
      return blueTeamColorLight1;
  }
}

export const mapColorLight2 = (color: string) => {
  switch (color) {
    case redTeamColor:
      return redTeamColorLight2;
    case greenTeamColor:
      return greenTeamColorLight2;
    case blueTeamColor:
      return blueTeamColorLight2;
  }
}