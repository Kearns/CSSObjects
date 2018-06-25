import Stylish from "../../build/index.es.js";
import { colors } from "./variables/colors";
import { grid } from "./variables/grid";

const name = "container";
const scope = "demo";

const rules = `
    background-color: ${colors("yellow", 700)};
    ${grid}
`;

const media = {
  "screen and (max-width:700px)": `
    background: ${colors("yellow", 500)};
  `,
  "screen and (max-width:400px)": `
    background: ${colors("yellow", 300)};
  `
};

export default Stylish.class({ name, scope, rules, media });
