import { pushCssObj } from "./StylishContainer";

// TODO: Allow single instances of classes that can be manipulated separate from main class ie (class = demo__class, instance = demo__class--eoj2is23)
export default class CSSObject {
  static createClass(args) {
    return new CSSObject(args);
  }

  constructor({ name, rules, scope = "_", media = {} }) {
    this.class = name;
    this.rules = rules;
    this.media = media;
    // when setting rules, should check if it is array or string and convert to array for easy value replacement
    this.scope = scope;
    pushCssObj({
      class: name,
      rules: rules,
      media: media,
      scope: scope
    });
  }

  add(rule) {
    this.rules = Array.isArray(rule)
      ? [...this.rules, ...rule]
      : [...this.rules, rule];
  }

  set class(val) {
    this._class = val;
  }

  get class() {
    const { _scope, _class } = this;
    return _scope ? `${_scope}__${_class}` : _class;
  }

  set rules(rules) {
    this._rules = rules;
  }

  get rules() {
    return this._rules;
  }

  set scope(scope) {
    this._scope = scope;
  }

  get scope() {
    return this._scope;
  }
}
