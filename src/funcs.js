import { MAIN_SHEET_ID } from "./constants";

export const addScopeToContainer = container => cssObj => {
  // ensure that if the scope already exists, that there is no existing class within that scope to collide with
  if (!container.scopes.includes(cssObj.scope)) {
    container.scopes.push(cssObj.scope);
    container.classes[cssObj.scope] = [];
  } else if (container.classes[cssObj.scope].includes(cssObj.class)) {
    throw Error(
      `ERROR: class "${cssObj.name}" already exists in scope "${cssObj.scope}"`
    );
  }
  return cssObj;
};

export const addClassToContainer = container => cssObj => {
  container.classes[cssObj.scope].push(cssObj.className);

  container.sheets
    .find(sheet => sheet.id === MAIN_SHEET_ID)
    .sheet.insertRule(`.${cssObj.class} { ${cssObj.rules.join(";")} }`);
  return cssObj;
};

export const addMediaQueriesToContainer = container => cssObj => {
  if (Object.keys(cssObj.media).length === 0 || cssObj.media.length === 0) {
    return null;
  }
  Object.keys(cssObj.media).forEach(mediaQuery => {
    let mediaSheet;

    mediaSheet = container.sheets.find(
      sheet =>
        sheet.sheet.media["mediaText"].toLowerCase().replace(/\s/g, "") ===
        mediaQuery.toLowerCase().replace(/\s/g, "")
    );

    if (mediaSheet === undefined) {
      mediaSheet = document.createElement("style");
      mediaSheet.media = mediaQuery;
      container.sheets = [mediaSheet, ...container.sheets];
      document.head.appendChild(mediaSheet);
    }

    mediaSheet.sheet.insertRule(
      `.${cssObj.class} { ${cssObj.media[mediaQuery].join(";")} }`
    );
  });
};
