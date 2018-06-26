import Container from "./Container";
import generateUUID from "./utils/generateUUID";
import styleRegex from "./utils/styleRegex";

var handler = {
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
    // if (key === "rules") {
    //   Container.updateClass(Object.assign(target, { [key]: value }));

    //   let newRules = value.replace(/\s*/g, "").split(";");
    //   let rules = target.rules;

    //   newRules.forEach(style => {
    //     const rule = style.split(":");
    //     const regex = styleRegex(rule[0]);
    //     console.log(rules.replace(regex));
    //   });

    //   Container.updateClass(Object.assign(target, { [key]: value }));
    // } else 
    Container.updateClass(Object.assign(target, { [key]: value }));
    return true;
  }
};

function invariant(key, action) {
  if (key[0] === "_") {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

export const createClass = ({ name, scope, rules = {}, media = {} }) => {
  const CSSObj = new Proxy(
    {
      name,
      scope,
      rules,
      media,
      class: scope ? `${scope}__${name}` : name
    },
    handler
  );
  Container.pushClass(CSSObj);
  return CSSObj;
};

export const createInstance = styleObject =>
  createClass({
    ...styleObject,
    name: `${styleObject.name}--${generateUUID()}`
  });
