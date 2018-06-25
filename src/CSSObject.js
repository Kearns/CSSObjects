import Container from "./Container";

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
