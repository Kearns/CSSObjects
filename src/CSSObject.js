import Container from "./Container";

// TODO: Allow single instances of classes that can be manipulated separate from main class ie (class = demo__class, instance = demo__class--eoj2is23)
class CSSObject {
  constructor({ name, rules, scope, media = {} }) {
    this.name = name;
    this.rules = rules;
    this.media = media;
    // when setting rules, should check if it is array or string and convert to array for easy value replacement
    this.scope = scope;
    this.class = scope ? `${scope}__${name}` : name;
    Container.pushClassObject({
      class: this.class,
      name,
      rules,
      media,
      scope
    });
  }

  add(rule) {
    this.rules = Array.isArray(rule)
      ? [...this.rules, ...rule]
      : [...this.rules, rule];
  }
}

console.log(Container.sheets);
export const createClass = args => new CSSObject(args);
