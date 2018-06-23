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
    return this.class;
  }

  update({ rules, media }) {
    this.rules = rules;
    this.media = media;
    Container.updateClassObject(this);
  }
}

export const createClass = args => new CSSObject(args);
