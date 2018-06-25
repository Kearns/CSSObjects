import demo__el from "./demo__el";
import demo__row from "./demo__row";
import demo__container from "./demo__container";
const baseRules = demo__el.rules;

let start = null;
let progress = null;

function step(timestamp) {
  if (!start) start = timestamp;
  progress = timestamp - start;

  demo__el.rules = `
    ${baseRules}
    opacity: .${Math.round(progress)};
    `;
  if (progress > 998) {
    start = 0
  }
  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
