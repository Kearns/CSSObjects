import demo__el from "./demo__el";
import demo__row from "./demo__row";
import demo__container from "./demo__container";

const updateOpacity = () => {
  const baseRules = demo__el.rules;
  let opacity = 10;
  let increment = true;

  function step() {
    increment ? ++opacity : --opacity;
    if (opacity >= 99) increment = false;
    if (opacity <= 10) increment = true;
    demo__el.rules = `
    ${baseRules}
    opacity: .${opacity};
    `;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
};

const updateColors = () => {
  const baseRules = demo__container.rules;
  let rgb = [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255)
  ];

  let increment = [true, true, true];

  function step() {
    rgb = rgb.map((color, i) => {
      increment[i] ? ++color : --color;
      if (color >= 255) increment[i] = false;
      if (color <= 0) increment[i] = true;
      console.log(color);
      return color;
    });

    demo__container.rules = `
    ${baseRules}
    background: rgb(${rgb.toString()});
    `;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
};

updateOpacity();
updateColors();
