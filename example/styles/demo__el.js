import Stylish from "../../build/index.es.js";
import { colors } from "./variables/colors";
import { col } from "./variables/grid";

const name = "el";
const scope = "demo";

const rules = `
    background: ${colors("blue", 700)};
    ${col(5)}
`;
const media = {
  "screen and (max-width:700px)": `
    background: ${colors("blue", 500)}
  `,
  "screen and (max-width:400px)": `
    background: ${colors("blue", 300)};
  `
};

export default Stylish.class({ name, scope, rules, media });
