(function () {
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

  const width = {
    set: val => `width: ${val}`,
    min: val => `min-width: ${val}`,
    max: val => `max-width: ${val}`
  };

  const backgroundColors = (hue, value) => {
    const lightness = `${value / 10}%`;
    const palette = {
      green: value => `hsla(120, 100%, ${lightness}, 1)`,
      blue: value => `hsla(240, 100%, ${lightness}, 1)`,
      yellow: value => `hsla(60, 100%, ${lightness}, 1)`
    };

    if (!Object.keys(palette).includes(hue) || ![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(value)) {
      console.log(Object.keys(palette), hue, value);
      throw Error("The selected collor is not within your palette.");
    }
    return `background-color: ${palette[hue]()};`;
  };

  const base_rules = ["margin: auto", width.set("100%"), width.max("700px")];

  const DemoStyleObject1 = Stylish.class({
    name: "el1",
    scope: "demo",
    rules: [backgroundColors("green", 700), ...base_rules],
    media: {
      "screen and (max-width:700px)": [backgroundColors("green", 500)],
      "screen and (max-width:400px)": [backgroundColors("green", 300)]
    }
  });

  const DemoStyleObject2 = Stylish.class({
    name: "el2",
    scope: "demo",
    rules: [backgroundColors("blue", 700), ...base_rules],
    media: {
      "screen and (max-width:700px)": [backgroundColors("blue", 500)],
      "screen and (max-width:400px)": [backgroundColors("blue", 300)]
    }
  });

  const DemoStyleObject3 = Stylish.class({
    name: "el3",
    scope: "demo",
    rules: [backgroundColors("yellow", 700), ...base_rules],
    media: {
      "screen and (max-width:700px)": [backgroundColors("yellow", 500)],
      "screen and (max-width:400px)": [backgroundColors("yellow", 300)]
    }
  });

  /* should also allow template strings for rules
    *
    * ie.
    * rules:`
    *     ${widths.min};
    *     ${widths.max}
    *     ${bgGreen}`
    */

  document.querySelector("#demo1").classList.add(DemoStyleObject1.class);
  document.querySelector("#demo2").classList.add(DemoStyleObject2.class);
  document.querySelector("#demo3").classList.add(DemoStyleObject3.class);

}());
