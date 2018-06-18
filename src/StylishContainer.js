const MAIN_SHEET_ID = "Stylish__AF__MAIN";
import flow from "lodash/flow";

const StylishContainer = {
  sheets: [],
  scopes: [],
  classes: {}
};

const mainSheet = document.createElement("style");
mainSheet.id = MAIN_SHEET_ID;
document.head.appendChild(mainSheet);

StylishContainer.sheets = [mainSheet];

const addToScope = cssObj => {
  // ensure that if the scope already exists, that there is no existing class within that scope to collide with
  if (!StylishContainer.scopes.includes(cssObj.scope)) {
    StylishContainer.scopes.push(cssObj.scope);
    StylishContainer.classes[cssObj.scope] = [];
  } else if (StylishContainer.classes[cssObj.scope].includes(cssObj.class)) {
    throw Error(
      `ERROR: class "${cssObj.class}" already exists in scope "${
        cssObj.scope
      }"`
    );
  }
  return cssObj;
};

const addToClasses = cssObj => {
  StylishContainer.classes[cssObj.scope].push(cssObj.class);

  StylishContainer.sheets
    .find(sheet => sheet.id === MAIN_SHEET_ID)
    .sheet.insertRule(`.${cssObj.scope}__${cssObj.class} { ${cssObj.rules.join(";")} }`);
  return cssObj;
};

const updateMediaQueries = cssObj => {
  if (Object.keys(cssObj.media).length === 0 || cssObj.media.length === 0) {
    return null;
  }
  Object.keys(cssObj.media).forEach(mediaQuery => {
    let mediaSheet;

    mediaSheet = StylishContainer.sheets.find(
      sheet =>
        sheet.sheet.media["mediaText"].toLowerCase().replace(/\s/g, "") ===
        mediaQuery.toLowerCase().replace(/\s/g, "")
    );

    if (mediaSheet === undefined) {
      mediaSheet = document.createElement("style");
      mediaSheet.media = mediaQuery;
      StylishContainer.sheets = [mediaSheet, ...StylishContainer.sheets];
      document.head.appendChild(mediaSheet);
    }

    mediaSheet.sheet.insertRule(
      `.${cssObj.scope}__${cssObj.class} { ${cssObj.media[mediaQuery].join(";")} }`
    );
  });
};

const pushCssObj = cssObj =>
  flow(
    addToScope,
    addToClasses,
    updateMediaQueries
  )(cssObj);

export {
  pushCssObj,
  StylishContainer,
  addToScope,
  addToClasses,
  updateMediaQueries
};
