import oocss from "cssobjects";

export const textColor = color =>
  oocss.class({
    name: "textColor",
    scope: "global",
    rules: `text-color: inherit;`
  });
