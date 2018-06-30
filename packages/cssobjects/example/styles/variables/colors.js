const palette = {
  green: value => `hsla(120, 100%, ${value / 10}%, 1)`,
  blue: value => `hsla(240, 100%, ${value / 10}%, 1)`,
  yellow: value => `hsla(60, 100%, ${value / 10}%, 1)`
};

export const colors = (hue, value) => {
  if (
    !Object.keys(palette).includes(hue) ||
    ![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(value)
  ) {
    throw Error("The selected collor is not within your palette.");
  }
  return palette[hue](value);
};
