import oocss from "cssobjects";

export const textColor = color =>
  oocss.class({
    name: "textColor",
    rules: `text-color: inherit;`
  });

export const container = oocss.class({
  name: "container",
  rules: `
        height: 100vh;
        display: flex;
    `
});

export const width_50vw = oocss.class({
  name: "width",
  rules: `width: 50vw; max-width: 50vw; overflow: hidden;`
});
