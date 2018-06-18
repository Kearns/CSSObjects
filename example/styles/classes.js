import { CSSObject } from "../../build/index.es.js";
import { width, backgroundColors } from "./variables";

export const DemoStyleObject = CSSObject.createClass({
  name: "button",
  scope: "global",
  rules: [
    backgroundColors("green", 500),
    width.set("100%"),
    width.min("300px"),
    width.max("800px"),
    'color: white'
  ],
  media: {
    "screen and (max-width:500px)": [
      backgroundColors("green", 500),
      width.set("50%"),
      width.min("100px"),
      width.max("300px")
    ],
    "screen and (max-width:300px)": [
      backgroundColors("green", 500),
      width.set("10%"),
      width.min("10px"),
      width.max("30px")
    ]
  }
});

CSSObject.createClass({
  name: "test2",
  scope: "demo",
  rules: [
    backgroundColors("green", 500),
    width.set("100%"),
    width.min("300px"),
    width.max("800px")
  ],
  media: {
    "screen and (max-width:500px)": [
      backgroundColors("green", 500),
      width.set("50%"),
      width.min("100px"),
      width.max("300px")
    ]
  }
});

CSSObject.createClass({
  name: "test23",
  scope: "demo",
  rules: [
    backgroundColors("green", 500),
    width.set("100%"),
    width.min("300px"),
    width.max("800px")
  ]
});

/* should also allow template strings for rules
  *
  * ie.
  * rules:`
  *     ${widths.min};
  *     ${widths.max}
  *     ${bgGreen}`
  */
