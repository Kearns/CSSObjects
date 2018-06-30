var stylish = (function () {
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

  var mainSheet = document.createElement("style");
  var keyframeSheet = document.createElement("style");

  mainSheet.id = MAIN_SHEET_ID;
  keyframeSheet.id = KEYFRAME_SHEET_ID;

  document.head.appendChild(mainSheet);
  document.head.appendChild(keyframeSheet);

  var insertRule = function insertRule(_ref) {
    var sheet = _ref.sheet,
        cssObj = _ref.cssObj,
        _ref$mediaQuery = _ref.mediaQuery,
        mediaQuery = _ref$mediaQuery === undefined ? undefined : _ref$mediaQuery,
        _ref$index = _ref.index,
        index = _ref$index === undefined ? 0 : _ref$index;
    return sheet.insertRule(("." + cssObj.class + "{" + (mediaQuery ? cssObj.media[mediaQuery] : cssObj.rules) + "}").replace(/\s*/g, ""), index);
  };

  var deleteRule = function deleteRule(_ref2) {
    var sheet = _ref2.sheet,
        index = _ref2.index;
    return sheet.deleteRule(index);
  };

  var findSheet = function findSheet(_ref3) {
    var container = _ref3.container,
        id = _ref3.id,
        mediaQuery = _ref3.mediaQuery;
    return id ? container.sheets.find(function (sheet) {
      return sheet.id === id;
    }) : container.sheets.find(function (sheet) {
      return sheet.sheet.media["mediaText"].toLowerCase().replace(/\s/g, "") === mediaQuery.toLowerCase().replace(/\s/g, "");
    });
  };

  var defineProperty = function (obj, key, value) {
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

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
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

      var sheet = findSheet({ container: container, id: MAIN_SHEET_ID }).sheet;

      insertRule({ sheet: sheet, cssObj: cssObj });

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

        mediaSheet = findSheet({ container: container, mediaQuery: mediaQuery });

        if (mediaSheet === undefined) {
          mediaSheet = document.createElement("style");
          mediaSheet.media = mediaQuery;
          container.sheets = [mediaSheet].concat(toConsumableArray(container.sheets));
          document.head.appendChild(mediaSheet);
        }

        var sheet = mediaSheet.sheet;

        insertRule({ sheet: sheet, cssObj: cssObj, mediaQuery: mediaQuery });
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

      deleteRule({ sheet: mainSheet.sheet, index: index });

      insertRule({
        cssObj: cssObj,
        sheet: mainSheet.sheet,
        index: mainSheet.rules.length
      });

      return cssObj;
    };
  };

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
    var uid = "xxxx-xx-xxxx".replace(/[x]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : r & 0x3 | 0x8).toString(16);
    });
    return uid;
  };

  var invariant = function invariant(key, action) {
    if (key[0] === "_") {
      throw new Error("Invalid attempt to " + action + " private \"" + key + "\" property");
    }
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
          trimmedValues.replace(style + ";", "");
          console.groupEnd();
        });
        Container.updateClass(Object.assign(target, defineProperty({}, key, trimmedValues)));
      } else {
        Container.updateClass(Object.assign(target, defineProperty({}, key, value)));
      }
      return true;
    }
  };

  var createClass$1 = function createClass$$1(_ref) {
    var name = _ref.name,
        scope = _ref.scope,
        _ref$rules = _ref.rules,
        rules = _ref$rules === undefined ? {} : _ref$rules,
        _ref$media = _ref.media,
        media = _ref$media === undefined ? {} : _ref$media;
    return Container.pushClass(new Proxy({
      name: name,
      scope: scope,
      rules: rules,
      media: media,
      class: scope ? scope + "__" + name : name
    }, handler));
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

  return Stylish;

}());
