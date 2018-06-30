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
  var KEYFRAME_SHEET_ID = "STYLISH_KEYFRAME_" + Math.floor(Math.random() * 16) + ";";

  var insertRule = function insertRule(sheet, styleObj, _ref) {
    var mediaQuery = _ref.mediaQuery,
        _ref$index = _ref.index,
        index = _ref$index === undefined ? 0 : _ref$index;

    var rules = mediaQuery ? styleObj.media[mediaQuery] : styleObj.rules;
    return sheet.insertRule(("." + styleObj.class + "{" + rules + "}").replace(/\s*/g, ""), index);
  };

  var deleteRule = function deleteRule(sheet, _ref2) {
    var index = _ref2.index;

    return sheet.deleteRule(index);
  };

  var defineProperty = function defineProperty(obj, key, value) {
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

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

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

      insertRule(mainSheet.sheet, cssObj);

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

        insertRule(mediaSheet.sheet, cssObj, { mediaQuery: mediaQuery });
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
      });
      var index = -1;

      index = Object.values(mainSheet.rules).findIndex(function (rule) {
        return rule.selectorText === "." + cssObj.class;
      });

      deleteRule(mainSheet.sheet, { index: index });
      insertRule(mainSheet.sheet, cssObj, {
        index: mainSheet.rules.length
      });

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

  var generateUID = function generateUID() {
    var d = new Date().getTime();
    var uid = "xxxx-xxxx-xxxx".replace(/[x]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : r & 0x3 | 0x8).toString(16);
    });
    return uid;
  };

  // const styleRegex = style => `/[\w\s]*:[\w\s]*;/g`;

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
      if (key === "rules") {
        // Container.updateClass(Object.assign(target, { [key]: value }));

        var existingRules = target.rules.replace(/\s*/g, "").split(";");
        var trimmedValues = value.replace(/\s*/g, "");
        existingRules.forEach(function (style) {
          // const regex = styleRegex(rule[0]);
          console.group(style + ";");
          trimmedValues.replace(style + ";", '');
          console.groupEnd();
        });
        Container.updateClass(Object.assign(target, defineProperty({}, key, trimmedValues)));
      } else {
        Container.updateClass(Object.assign(target, defineProperty({}, key, value)));
      }
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

  var createInstance = function createInstance(styleObject) {
    return createClass$1(_extends({}, styleObject, {
      name: styleObject.name + "--" + generateUID()
    }));
  };

  var Stylish = {
    class: createClass$1,
    instance: createInstance
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

  var grid = "\n    display: flex;\n    flex-direction: column;\n   \n";

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

  var rules$2 = "\n    height: 100vh;\n    width: 100vw;\n    justify-content: center;\n    padding: 0;\n    margin: 0;\n    overflow: hidden;\n    background-color: " + colors("yellow", 700) + ";\n    " + grid + "\n";

  var media$2 = {
    "screen and (max-width:700px)": "\n    background: " + colors("yellow", 500) + ";\n  ",
    "screen and (max-width:400px)": "\n    background: " + colors("yellow", 300) + ";\n  "
  };

  Stylish.class({ name: name$2, scope: scope$2, rules: rules$2, media: media$2 });

  // const demoEls = [].slice.call(document.querySelectorAll(`.${demo__el.class}`));

  // const elStyleInstances = demoEls.map(el => {
  //   const elInstance = Stylish.instance(demo__el);
  //   el.classList.add(elInstance.class);
  //   return elInstance;
  // });

  // let baseRotate = 0

  // console.log(elStyleInstances)

  demo__el.rules = "\n" + demo__el.rules + "\ntransform: rotateY(1deg)translateZ(124px);\nborder-radius: 100%;\nposition: absolute;\nbackground: none;\n";

  // elStyleInstances.forEach( el => {
  //     // console.log(el)
  //     el.rules = `
  //     transform: rotateY(${baseRotate += 15}deg)translateZ(124px);
  //     border-radius: 100%;
  //     position: absolute;
  //     `
  //     // rotate(el, el.rules);
  // })


  // const elements = [demo__container, demo__row, demo__el];
  // const baseRules = [demo__container.rules, demo__row.rules, demo__el.rules];

  // elements.forEach((el, i) => updateColors(el, baseRules[i]));

}());
