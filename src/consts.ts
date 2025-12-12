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

export const greenTeamColor = '#2F6030';
export const greenTeamColorLight1 = '#5A965C';
export const greenTeamColorLight2 = '#78B47A';

export const redTeamColor = '#EA4444';
export const redTeamColorLight1 = '#FF7878';
export const redTeamColorLight2 = '#FF9696';

export const blueTeamColor = '#2D69A4';
export const blueTeamColorLight1 = '#5A96C8';
export const blueTeamColorLight2 = '#78B4DC';

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