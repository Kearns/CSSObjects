export const width = {
  set: val => `width: ${val}`,
  min: val => `min-width: ${val}`,
  max: val => `max-width: ${val}`
};

export const backgroundColors = (hue, value) => {
  const lightness = `${value / 10}%`;
  const palette = {
    green: value => `hsla(120, 100%, ${lightness}, 1)`,
    blue: value => `hsla(240, 100%, ${lightness}, 1)`,
    yellow: value => `hsla(60, 100%, ${lightness}, 1)`
  };

  if (
    !Object.keys(palette).includes(hue) ||
    ![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(value)
  ) {
    console.log(Object.keys(palette), hue, value);
    throw Error("The selected collor is not within your palette.");
  }
  return `background-color: ${palette[hue]()};`;
};
