# Stylish

JS driven, scoped and sane styles. Framework agnostic - for use with React, Angular, or good old vanilla JS.

**_IN DEVELOPMENT_**

## Class

The class interface allows us to define scoped classes. If another class with the same name is defined in scope, the program throws an error.

- `name`: Defines the name of the class object
- `scope`: A namespace to avoid class collisions
- `rules`: An array of CSS rules that comprise the class styles, these rules could be simple strings (ie. 'margin: 0'), or functions that generate strings
- `media`: Takes an object with key value pairs where the key is your media query and the value is an array of style rules.

```JS
import Stylish from "../../build/index.es.js";
import { colors } from "./variables/colors";
import { col } from "./variables/grid";

const name = "example";
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

//React example
import { example } from './styles';
const demoEl1 = props => <div className={example.class} />;
// output: <div class="demo__example"></div>
```

Browser Testing: **PASSED**  
Supported Browsers: **Chrome**, **Firefox**, **Edge**, **Safari**, **IE11\***  
_\*with babel-polyfill loaded browser side_

**TODO:**

- Testing suite
- POC Keyframes
- Class Instances
- Performance/Load Testing
