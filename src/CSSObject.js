import Container from "./Container";

// TODO: Allow single instances of classes that can be manipulated separate from main class ie (class = demo__class, instance = demo__class--eoj2is23)
class CSSObject {
  constructor({ name, rules, scope, media = {} }) {
    this.name = name;
    this._rules = rules;
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

  update({ rules, media }) {
    this.rules = rules;
    this.media = media;
    Container.updateClassObject(this);
  }

  set rules(rules) {
    const usedRules = this._rules.map(rule => rule.split(":")[0]);

    const newRules = rules.filter(rule => {
      const ruleType = rule.split(":")[0];
      if (usedRules.includes(ruleType)) {
   
        return rule;
      }

      return rule;
    });
    //   const ruleName = ruleToFilter.split(":")[0];
    //   console.log(usedRules,ruleToFilter)
    //   if (usedRules.includes(ruleName)) {

    //     return false;
    //   }
    //   usedRules.push(ruleName);
    //   return true;
    // });
    this._rules = newRules;
  }

  get rules() {
    return this._rules;
  }
}

export const createClass = args => new CSSObject(args);
