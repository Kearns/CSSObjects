(function () {
  'use strict';

  var compose = function compose() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    return fns.reduceRight(function (prevFn, nextFn) {
      return function () {
        return nextFn(prevFn.apply(undefined, arguments));
      };
    }, function (value) {
      return value;
    });
  };

  var MAIN_SHEET_ID = "STYLISH_MAIN_" + Math.floor(Math.random() * 16);

  var classCallCheck = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var toConsumableArray = function toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /**
   * adds class to container
   * @param {Object} container
   * @param {Object} cssObj
   *
   */
  var addClassToContainer = function addClassToContainer(container) {
    return function (cssObj) {
      // ensure that if the scope already exists, that there is no existing class within that scope to collide with
      if (container.classes[cssObj.scope].includes(cssObj.class)) {
        throw Error("ERROR: class \"" + cssObj.name + "\" already exists in scope \"" + cssObj.scope + "\"");
      }
      container.classes[cssObj.scope] = [].concat(toConsumableArray(container.classes[cssObj.scope]), [cssObj.className]);
      var mainSheet = container.sheets.find(function (sheet) {
        return sheet.id === MAIN_SHEET_ID;
      });
      if (Array.isArray(cssObj.rules)) {
        mainSheet.sheet.insertRule("." + cssObj.class + " { " + cssObj.rules.join(";") + " }", 0);
      } else if (typeof cssObj.rules === "string") {
        mainSheet.sheet.insertRule("." + cssObj.class + " { " + cssObj.rules + " }", 0);
      }
      return cssObj;
    };
  };

  /**
   * adds scope to container
   * @param {Object} container
   * @param {Object} cssObj
   *
   */

  var addScopeToContainer = function addScopeToContainer(container) {
    return function (cssObj) {
      if (!container.scopes.includes(cssObj.scope)) {
        container.scopes.push(cssObj.scope);
        container.classes[cssObj.scope] = [];
      }
      return cssObj;
    };
  };

  /**
   * adds media queries to container
   * @param {Object} container
   * @param {Object} cssObj
   *
   */
  var addMediaQueriesToContainer = function addMediaQueriesToContainer(container) {
    return function (cssObj) {
      if (Object.keys(cssObj.media).length === 0 || cssObj.media.length === 0) {
        return null;
      }
      Object.keys(cssObj.media).forEach(function (mediaQuery) {
        var mediaSheet = void 0;

        mediaSheet = container.sheets.find(function (sheet) {
          return sheet.sheet.media["mediaText"].toLowerCase().replace(/\s/g, "") === mediaQuery.toLowerCase().replace(/\s/g, "");
        });

        if (mediaSheet === undefined) {
          mediaSheet = document.createElement("style");
          mediaSheet.media = mediaQuery;
          container.sheets = [mediaSheet].concat(toConsumableArray(container.sheets));
          document.head.appendChild(mediaSheet);
        }

        if (Array.isArray(cssObj.media[mediaQuery])) {
          mediaSheet.sheet.insertRule("." + cssObj.class + " { " + cssObj.media[mediaQuery].join(";"), 0);
        } else if (typeof cssObj.media[mediaQuery] === "string") {
          mediaSheet.sheet.insertRule("." + cssObj.class + " { " + cssObj.media[mediaQuery] + " }", 0);
        }
      });
    };
  };

  /**
   * adds class to container
   * @param {Object} container
   * @param {Object} cssObj
   *
   */
  var updateClassToContainer = function updateClassToContainer(container) {
    return function (cssObj) {
      var mainSheet = container.sheets.find(function (sheet) {
        return sheet.id === MAIN_SHEET_ID;
      }).sheet;

      var index = -1;
      index = Object.values(mainSheet.rules).findIndex(function (rule) {
        return rule.selectorText === "." + cssObj.class;
      });
      mainSheet.deleteRule(index);
      mainSheet.insertRule("." + cssObj.class + " { " + cssObj.rules.join(";") + " }", mainSheet.rules.length);
      return cssObj;
    };
  };

  var mainSheet = document.createElement("style");
  mainSheet.id = MAIN_SHEET_ID;
  document.head.appendChild(mainSheet);

  var Container = {
    sheets: [mainSheet],
    scopes: [],
    classes: {}
  };

  Container.pushClassObject = function (cssObj) {
    return compose(addMediaQueriesToContainer(Container), addClassToContainer(Container), addScopeToContainer(Container))(cssObj);
  };

  Container.updateClassObject = function (cssObj) {
    return compose(updateClassToContainer(Container))(cssObj);
  };

  // TODO: Allow single instances of classes that can be manipulated separate from main class ie (class = demo__class, instance = demo__class--eoj2is23)

  var CSSObject = function () {
    function CSSObject(_ref) {
      var name = _ref.name,
          rules = _ref.rules,
          scope = _ref.scope,
          _ref$media = _ref.media,
          media = _ref$media === undefined ? {} : _ref$media;
      classCallCheck(this, CSSObject);

      this.name = name;
      this._rules = rules;
      this.media = media;
      // when setting rules, should check if it is array or string and convert to array for easy value replacement
      this.scope = scope;
      this.class = scope ? scope + "__" + name : name;
      Container.pushClassObject({
        class: this.class,
        name: name,
        rules: rules,
        media: media,
        scope: scope
      });
    }

    createClass(CSSObject, [{
      key: "update",
      value: function update(_ref2) {
        var rules = _ref2.rules,
            media = _ref2.media;

        this.rules = rules;
        this.media = media;
        Container.updateClassObject(this);
      }
    }, {
      key: "rules",
      set: function set$$1(rules) {
        var usedRules = this._rules.map(function (rule) {
          return rule.split(":")[0];
        });

        var newRules = rules.filter(function (rule) {
          var ruleType = rule.split(":")[0];
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
      },
      get: function get$$1() {
        return this._rules;
      }
    }]);
    return CSSObject;
  }();

  var createClass$1 = function createClass$$1(args) {
    return new CSSObject(args);
  };

  var Stylish = {
    class: createClass$1
  };

  var width = {
    set: function set(val) {
      return "width: " + val;
    },
    min: function min(val) {
      return "min-width: " + val;
    },
    max: function max(val) {
      return "max-width: " + val;
    }
  };

  var backgroundColors = function backgroundColors(hue, value) {
    var palette = {
      green: function green(value) {
        return "hsla(120, 100%, " + value / 10 + "%, 1)";
      },
      blue: function blue(value) {
        return "hsla(240, 100%, " + value / 10 + "%, 1)";
      },
      yellow: function yellow(value) {
        return "hsla(60, 100%, " + value / 10 + "%, 1)";
      }
    };

    if (!Object.keys(palette).includes(hue) || ![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(value)) {
      throw Error("The selected collor is not within your palette.");
    }
    return "background-color: " + palette[hue](value) + ";";
  };

  var base_rules = ["margin: auto", width.set("100%"), width.max("700px")];

  var DemoStyleObject1 = Stylish.class({
    name: "el1",
    scope: "demo",
    rules: [backgroundColors("green", 700)].concat(base_rules),
    media: {
      "screen and (max-width:700px)": [backgroundColors("green", 500)],
      "screen and (max-width:400px)": [backgroundColors("green", 300)]
    }
  });

  var DemoStyleObject2 = Stylish.class({
    name: "el2",
    scope: "demo",
    rules: [backgroundColors("blue", 700)].concat(base_rules),
    media: {
      "screen and (max-width:700px)": [backgroundColors("blue", 500)],
      "screen and (max-width:400px)": [backgroundColors("blue", 300)]
    }
  });

  var DemoStyleObject3 = Stylish.class({
    name: "el3",
    scope: "demo",
    rules: "\n    margin: auto; \n    " + width.set("100%") + "; \n    " + width.max("700px") + ";\n    " + backgroundColors("yellow", 700) + ";\n    ",
    media: {
      "screen and (max-width:700px)": backgroundColors("yellow", 500) + ";",
      "screen and (max-width:400px)": backgroundColors("yellow", 300) + ";"
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

  // var framerate = 50; // In milliseconds (divide by 1000 to get seconds).

  // let height = 20;
  // let direction = "up";

  // var interval = setInterval(() => {
  //   if (height >= 50 && direction === "up") direction = "down";
  //   if (height <= 20 && direction === "down") direction = "up";
  //   height = direction === "up" ? height + 1 : height - 1;
  //   DemoStyleObject1.update({
  //     rules: [...DemoStyleObject1.rules, `height: ${height}px`]
  //   });
  //   DemoStyleObject2.update({
  //     rules: [`height: ${height}px`]
  //   });
  // }, 500);

}());
