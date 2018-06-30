import CSSObjects from "../../build/index.es.js";
import { colors } from "./variables/colors";
import { row } from "./variables/grid";

const name = "row";
const scope = "demo";
const rules = `
    background: ${colors("green", 700)};
    ${row}
`;

const media = {
  "screen and (max-width:700px)": `background: ${colors("green", 500)};`,
  "screen and (max-width:400px)": `background: ${colors("green", 300)};`
};

export default CSSObjects.class({ name, scope, rules, media });
