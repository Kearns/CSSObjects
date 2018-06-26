import demo__el from "./demo__el";
import demo__row from "./demo__row";
import demo__container from "./demo__container";
import Stylish from "../../build/index.es";

const rotate = (el, baseRules) => {
  let radius = 0;
  let increment = true;

  function step() {
    radius = radius === 359 ? 0 : radius + 1;

    el.rules = `
    ${baseRules}
    transform: rotate3d(0, 1, 0, ${radius}deg);
    `;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
};

const updateColors = (el, baseRules) => {
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
      if (color <= 50) increment[i] = true;
      return color;
    });

    el.rules = `
    ${baseRules}
    background: rgb(${rgb.toString()});
    `;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
};

const demoEls = [].slice.call(document.querySelectorAll(`.${demo__el.class}`));

const elStyleInstances = demoEls.map(el => {
  const elInstance = Stylish.instance(demo__el);
  el.classList.add(elInstance.class);
  return elInstance;
});

let baseRotate = 0

// console.log(elStyleInstances)

elStyleInstances.forEach( el => {
    // console.log(el)
    el.rules = `
    ${el.rules}
    transform: rotateY(${baseRotate += 15}deg)translateZ(124px);
    border-radius: 100%;
    position: absolute;
    background: none;
    border: 5px solid blue;
    `
    // rotate(el, el.rules);

})


// const elements = [demo__container, demo__row, demo__el];
// const baseRules = [demo__container.rules, demo__row.rules, demo__el.rules];

// elements.forEach((el, i) => updateColors(el, baseRules[i]));
