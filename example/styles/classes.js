import Stylish from "../../build/index.es.js";
import { width, backgroundColors } from "./variables";

const base_rules = ["margin: auto", width.set("100%"), width.max("700px")];

export const DemoStyleObject1 = Stylish.class({
  name: "el1",
  scope: "demo",
  rules: [backgroundColors("green", 700), ...base_rules],
  media: {
    "screen and (max-width:700px)": [backgroundColors("green", 500)],
    "screen and (max-width:400px)": [backgroundColors("green", 300)]
  }
});

export const DemoStyleObject2 = Stylish.class({
  name: "el2",
  scope: "demo",
  rules: [backgroundColors("blue", 700), ...base_rules],
  media: {
    "screen and (max-width:700px)": [backgroundColors("blue", 500)],
    "screen and (max-width:400px)": [backgroundColors("blue", 300)]
  }
});

export const DemoStyleObject3 = Stylish.class({
  name: "el3",
  scope: "demo",
  rules: `
    margin: auto; 
    ${width.set("100%")}; 
    ${width.max("700px")};
    ${backgroundColors("yellow", 700)};
    `,
  media: {
    "screen and (max-width:700px)": `${backgroundColors("yellow", 500)};`,
    "screen and (max-width:400px)": `${backgroundColors("yellow", 300)};`
  }
});

/* should also allow template strings for rules
  *
  * ie.
  * rules:`
  *     ${widths.min};
  *     ${widths.max}
  *     ${bgGreen}`
  */
