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
// example style functions
const width = {
  set: val => `width: ${val}`,
  min: val => `min-width: ${val}`,
  max: val => `max-width: ${val}`
};

const backgroundColors = (hue, value) => {
    const lightness = `${value / 10}%`;
    const palette = {
      green: value => `hsla(120, 100%, ${lightness}%, 1)`,
      blue: value => `hsla(240, 100%, ${lightness}, 1)`,
      yellow: value => `hsla(60, 100%, ${lightness}, 1)`
    };

    if (
      !Object.keys(palette).includes(hue) ||
      ![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(value)
    ) {
      throw Error("The selected collor is not within your palette.");
    }
    return `background-color: ${palette[hue]()};`;
  };

const base_rules = ["margin: auto", width.set("100%"), width.max("700px")];

// Class definition
const example = Stylish.class({
  name: "el1",
  scope: "demo",
  rules: [backgroundColors("green", 700), ...base_rules],
  media: {
    "screen and (max-width:700px)": [backgroundColors("green", 500)],
    "screen and (max-width:400px)": [backgroundColors("green", 300)]
  }
});

//React example
const demoEl1 = props => <div className={example.class} />;
```

Browser Testing: **PASSED**
Supported Browsers: **Chrome**, **Firefox**, **Edge**, **Safari**, **IE11\***

_\*with babel-polyfill loaded browser side_

**TODO:**

- Testing suite
- POC Keyframes
- Class Instances
- Performance/Load Testing
