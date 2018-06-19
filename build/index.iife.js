var stylish = (function () {
  'use strict';

  const compose = (...fns) => fns.reduceRight((prevFn, nextFn) => (...args) => nextFn(prevFn(...args)), value => value);

  const MAIN_SHEET_ID = `STYLISH_MAIN_${Math.floor(Math.random() * 16)}`;

  const addScopeToContainer = container => cssObj => {
    // ensure that if the scope already exists, that there is no existing class within that scope to collide with
    if (!container.scopes.includes(cssObj.scope)) {
      container.scopes.push(cssObj.scope);
      container.classes[cssObj.scope] = [];
    } else if (container.classes[cssObj.scope].includes(cssObj.class)) {
      throw Error(`ERROR: class "${cssObj.name}" already exists in scope "${cssObj.scope}"`);
    }
    return cssObj;
  };

  const addClassToContainer = container => cssObj => {
    container.classes[cssObj.scope].push(cssObj.className);

    container.sheets.find(sheet => sheet.id === MAIN_SHEET_ID).sheet.insertRule(`.${cssObj.class} { ${cssObj.rules.join(";")} }`);
    return cssObj;
  };

  const addMediaQueriesToContainer = container => cssObj => {
    if (Object.keys(cssObj.media).length === 0 || cssObj.media.length === 0) {
      return null;
    }
    Object.keys(cssObj.media).forEach(mediaQuery => {
      let mediaSheet;

      mediaSheet = container.sheets.find(sheet => sheet.sheet.media["mediaText"].toLowerCase().replace(/\s/g, "") === mediaQuery.toLowerCase().replace(/\s/g, ""));

      if (mediaSheet === undefined) {
        mediaSheet = document.createElement("style");
        mediaSheet.media = mediaQuery;
        container.sheets = [mediaSheet, ...container.sheets];
        document.head.appendChild(mediaSheet);
      }

      mediaSheet.sheet.insertRule(`.${cssObj.class} { ${cssObj.media[mediaQuery].join(";")} }`);
    });
  };

  const mainSheet = document.createElement("style");
  mainSheet.id = MAIN_SHEET_ID;
  document.head.appendChild(mainSheet);

  const Container = {
    sheets: [mainSheet],
    scopes: [],
    classes: {}
  };

  Container.pushClassObject = cssObj => compose(addMediaQueriesToContainer(Container), addClassToContainer(Container), addScopeToContainer(Container))(cssObj);

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
      this.rules = Array.isArray(rule) ? [...this.rules, ...rule] : [...this.rules, rule];
    }
  }

  const createClass = args => new CSSObject(args);

  const Stylish = {
    class: createClass
  };

  return Stylish;

}());
