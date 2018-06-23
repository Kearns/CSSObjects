(function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

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

  var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
  };

  var classCallCheck$1 = function classCallCheck$$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass$1 = function () {
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

  var toConsumableArray$1 = function toConsumableArray$$1(arr) {
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
      container.classes[cssObj.scope] = [].concat(toConsumableArray$1(container.classes[cssObj.scope]), [cssObj.className]);
      var mainSheet = container.sheets.find(function (sheet) {
        return sheet.id === MAIN_SHEET_ID;
      });
      if (Array.isArray(cssObj.rules)) {
        mainSheet.sheet.insertRule("." + cssObj.class + " { " + cssObj.rules.join(";") + " }", 0);
      } else if (typeof cssObj.rules === "string") {
        mainSheet.sheet.insertRule("." + cssObj.class + " {\n        " + cssObj.rules + "\n    }", 0);
      } else if (_typeof$1(cssObj.rules) === "object") {
        console.log("." + cssObj.class + " { \n          " + Object.keys(cssObj.rules).map(function (key) {
          return key + ": " + cssObj.rules[key];
        }).join(";") + "\n        }");
        mainSheet.sheet.insertRule("." + cssObj.class + " { \n          " + Object.keys(cssObj.rules).map(function (key) {
          return key + ": " + cssObj.rules[key];
        }).join(";") + "\n        }");
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
          container.sheets = [mediaSheet].concat(toConsumableArray$1(container.sheets));
          document.head.appendChild(mediaSheet);
        }

        if (Array.isArray(cssObj.media[mediaQuery])) {
          mediaSheet.sheet.insertRule("." + cssObj.class + " { " + cssObj.media[mediaQuery].join(";"), 0);
        } else if (typeof cssObj.media[mediaQuery] === "string") {
          mediaSheet.sheet.insertRule("." + cssObj.class + " {\n            " + cssObj.media[mediaQuery] + "\n        }", 0);
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
      classCallCheck$1(this, CSSObject);

      this.name = name;
      this.rules = rules;
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
      return this.class;
    }

    createClass$1(CSSObject, [{
      key: "update",
      value: function update(_ref2) {
        var rules = _ref2.rules,
            media = _ref2.media;

        this.rules = rules;
        this.media = media;
        Container.updateClassObject(this);
      }
    }]);
    return CSSObject;
  }();

  var createClass$1$1 = function createClass$$1(args) {
    return new CSSObject(args);
  };

  var Stylish = {
    class: createClass$1$1
  };

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

  var colors = function colors(hue, value) {
    if (!Object.keys(palette).includes(hue) || ![100, 200, 300, 400, 500, 600, 700, 800, 900].includes(value)) {
      throw Error("The selected collor is not within your palette.");
    }
    return palette[hue](value);
  };

  var padded = "\n    width: 80%;\n    padding: 10%;\n";

  var grid = "\n    display: flex;\n    flex-direction: column;\n    max-width: 700px;\n    margin: 0 auto;\n    " + padded + "\n";

  var row = "\n    justify-content: space-around;\n    display: flex;\n    flex-direction: row;\n    " + padded + "\n";

  var col = function col(width) {
      return "\n    display: flex;\n    flex-direction: column;\n    padding: 10% 0;\n    margin: 5%;\n    width: " + 10 * width + "%;\n";
  };

  var name = "el";
  var scope = "demo";

  var rules = "\n    background: " + colors("blue", 700) + ";\n    " + col(5) + "\n";
  var media = {
    "screen and (max-width:700px)": "\n    background: " + colors("blue", 500) + "\n  ",
    "screen and (max-width:400px)": "\n    background: " + colors("blue", 300) + ";\n  "
  };

  Stylish.class({ name: name, scope: scope, rules: rules, media: media });

  var name$1 = "row";
  var scope$1 = "demo";
  var rules$1 = "\n    background: " + colors("green", 700) + ";\n    " + row + "\n";
  console.log('row', rules$1);
  var media$1 = {
    "screen and (max-width:700px)": "background: " + colors("green", 500) + ";",
    "screen and (max-width:400px)": "background: " + colors("green", 300) + ";"
  };

  Stylish.class({ name: name$1, scope: scope$1, rules: rules$1, media: media$1 });

  var name$2 = "container";
  var scope$2 = "demo";

  var rules$2 = "\n    background: " + colors("yellow", 700) + ";\n    " + grid + "\n";

  var media$2 = {
    "screen and (max-width:700px)": "\n    background: " + colors("yellow", 500) + ";\n  ",
    "screen and (max-width:400px)": "\n    background: " + colors("yellow", 300) + ";\n  "
  };

  Stylish.class({ name: name$2, scope: scope$2, rules: rules$2, media: media$2 });

}());
