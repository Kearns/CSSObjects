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
  var KEYFRAME_SHEET_ID = "STYLISH_KEYFRAME_" + Math.floor(Math.random() * 16) + ";";

  var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
  };

  var defineProperty$1 = function defineProperty$$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

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
      console.log(cssObj);
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
      mainSheet.insertRule("." + cssObj.class + " { " + cssObj.rules + " }", mainSheet.rules.length);
      return cssObj;
    };
  };

  var mainSheet = document.createElement("style");
  var keyframeSheet = document.createElement("style");
  mainSheet.id = MAIN_SHEET_ID;
  keyframeSheet.id = KEYFRAME_SHEET_ID;
  document.head.appendChild(mainSheet);
  document.head.appendChild(keyframeSheet);

  var Container = {
    sheets: [mainSheet, keyframeSheet],
    scopes: [],
    classes: {}
  };

  Container.pushClass = function (cssObj) {
    return compose(addMediaQueriesToContainer(Container), addClassToContainer(Container), addScopeToContainer(Container))(cssObj);
  };

  Container.updateClass = function (cssObj) {
    return compose(updateClassToContainer(Container))(cssObj);
  };

  var handler = {
    get: function get$$1(target, key) {
      invariant(key, "get");
      switch (key) {
        case "class":
          return target.scope ? target.scope + "__" + target.name : target.name;
        default:
          return target[key];
      }
    },
    set: function set$$1(target, key, value) {
      Container.updateClass(Object.assign(target, defineProperty$1({}, key, value)));
      return true;
    }
  };

  function invariant(key, action) {
    if (key[0] === "_") {
      throw new Error("Invalid attempt to " + action + " private \"" + key + "\" property");
    }
  }

  var createClass$1 = function createClass$$1(_ref) {
    var name = _ref.name,
        scope = _ref.scope,
        _ref$rules = _ref.rules,
        rules = _ref$rules === undefined ? {} : _ref$rules,
        _ref$media = _ref.media,
        media = _ref$media === undefined ? {} : _ref$media;

    var CSSObj = new Proxy({
      name: name,
      scope: scope,
      rules: rules,
      media: media,
      class: scope ? scope + "__" + name : name
    }, handler);
    Container.pushClass(CSSObj);
    return CSSObj;
  };

  var Stylish = {
    class: createClass$1
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

  var demo__el = Stylish.class({ name: name, scope: scope, rules: rules, media: media });

  var name$1 = "row";
  var scope$1 = "demo";
  var rules$1 = "\n    background: " + colors("green", 700) + ";\n    " + row + "\n";

  var media$1 = {
    "screen and (max-width:700px)": "background: " + colors("green", 500) + ";",
    "screen and (max-width:400px)": "background: " + colors("green", 300) + ";"
  };

  Stylish.class({ name: name$1, scope: scope$1, rules: rules$1, media: media$1 });

  var name$2 = "container";
  var scope$2 = "demo";

  var rules$2 = "\n    background-color: " + colors("yellow", 700) + ";\n    " + grid + "\n";

  var media$2 = {
    "screen and (max-width:700px)": "\n    background: " + colors("yellow", 500) + ";\n  ",
    "screen and (max-width:400px)": "\n    background: " + colors("yellow", 300) + ";\n  "
  };

  var demo__container = Stylish.class({ name: name$2, scope: scope$2, rules: rules$2, media: media$2 });

  var updateOpacity = function updateOpacity() {
    var baseRules = demo__el.rules;
    var opacity = 10;
    var increment = true;

    function step() {
      increment ? ++opacity : --opacity;
      if (opacity >= 99) increment = false;
      if (opacity <= 10) increment = true;
      demo__el.rules = "\n    " + baseRules + "\n    opacity: ." + opacity + ";\n    ";
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  };

  var updateColors = function updateColors() {
    var baseRules = demo__container.rules;
    var rgb = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];

    var increment = [true, true, true];

    function step() {
      rgb = rgb.map(function (color, i) {
        increment[i] ? ++color : --color;
        if (color >= 255) increment[i] = false;
        if (color <= 0) increment[i] = true;
        console.log(color);
        return color;
      });

      demo__container.rules = "\n    " + baseRules + "\n    background: rgb(" + rgb.toString() + ");\n    ";
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  };

  updateOpacity();
  updateColors();

}());
