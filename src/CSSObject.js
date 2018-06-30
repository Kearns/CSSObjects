import Container from "./Container";
import generateUID from "./utils/generateUID";
import invariant from "./utils/invariant";
import styleRegex from "./utils/styleRegex";

const handler = {
  get(target, key) {
    invariant(key, "get");
    switch (key) {
      case "class":
        return target.scope ? `${target.scope}__${target.name}` : target.name;
      default:
        return target[key];
    }
  },
  set(target, key, value) {
    if (key === "rules") {
      // Container.updateClass(Object.assign(target, { [key]: value }));

      let existingRules = target.rules.replace(/\s*/g, "").split(";");
      let trimmedValues = value.replace(/\s*/g, "");
      existingRules.forEach(style => {
        // const regex = styleRegex(rule[0]);
        console.group(`${style};`);
        trimmedValues.replace(`${style};`, "");
        console.groupEnd();
      });
      Container.updateClass(Object.assign(target, { [key]: trimmedValues }));
    } else {
      Container.updateClass(Object.assign(target, { [key]: value }));
    }
    return true;
  }
};

export const createClass = ({ name, scope, rules = {}, media = {} }) =>
  Container.pushClass(
    new Proxy(
      {
        name,
        scope,
        rules,
        media,
        class: scope ? `${scope}__${name}` : name
      },
      handler
    )
  );

export const createInstance = styleObject =>
  createClass({
    ...styleObject,
    name: `${styleObject.name}--${generateUID()}`
  });
