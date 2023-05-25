const colors = {
  LightOrange: "#E79E2F",
  semiDarkOrange: "#D8722A",
  DarkOrange: "#D54728;",
  gray900: "#191F28",
  gray800: "#333D4B",
  gray700: "#4E5968",
  gray600: "#6B7684",
  gray500: "#8B95A1",
  gray400: "#ADB5BD",
  gray300: "#E5E8EB",
  gray200: "#F7F8FA",
  gray100: "#FFFFFF",
  border: "#E5E8EB",
  system: "#F04452",
};

function FONT({ weight, size, lineHeight }) {
  return `
      font-family: 'Pretendard-Regular';
      font-weight: ${weight};
      font-size: ${size}rem;
      line-height: ${lineHeight}px;
      `;
}

const fonts = {
  heading1: FONT({ weight: 700, size: 2.4, lineHeight: 36 }),
  heading2: FONT({ weight: 700, size: 2.2, lineHeight: 33 }),

  subtitle1: FONT({ weight: 700, size: 1.8, lineHeight: 27 }),
  subtitle2: FONT({ weight: 700, size: 1.3, lineHeight: 19.5 }),

  body1: FONT({ weight: 700, size: 1.6, lineHeight: 24 }),
  body2: FONT({ weight: 400, size: 1.6, lineHeight: 24 }),
  body3: FONT({ weight: 700, size: 1.4, lineHeight: 21 }),
  body4: FONT({ weight: 400, size: 1.4, lineHeight: 21 }),

  caption1: FONT({ weight: 700, size: 1.2, lineHeight: 18 }),
  caption2: FONT({ weight: 400, size: 1.2, lineHeight: 18 }),
  caption3: FONT({ weight: 400, size: 1.0, lineHeight: 16 }),
};

const theme = {
  colors,
  fonts,
};

export default theme;
