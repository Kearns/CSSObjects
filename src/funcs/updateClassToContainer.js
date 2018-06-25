import { MAIN_SHEET_ID } from "../constants";

/**
 * adds class to container
 * @param {Object} container
 * @param {Object} cssObj
 *
 */
const updateClassToContainer = container => cssObj => {
  const mainSheet = container.sheets.find(sheet => sheet.id === MAIN_SHEET_ID)
    .sheet;
  let index = -1;
  index = Object.values(mainSheet.rules).findIndex(
    rule => rule.selectorText === "." + cssObj.class
  );

  mainSheet.deleteRule(index);
  mainSheet.insertRule(
    `.${cssObj.class} { ${cssObj.rules} }`,
    mainSheet.rules.length
  );
  return cssObj;
};

export default updateClassToContainer;
