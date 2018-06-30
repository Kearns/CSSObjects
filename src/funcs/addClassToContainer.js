import { MAIN_SHEET_ID } from "../constants";
import { insertRule } from "../utils/sheetFns";
/**
 * adds class to container
 * @param {Object} container
 * @param {Object} cssObj
 *
 */
const addClassToContainer = container => cssObj => {
  // ensure that if the scope already exists, that there is no existing class within that scope to collide with
  if (container.classes[cssObj.scope].includes(cssObj.class)) {
    throw Error(
      `ERROR: class "${cssObj.name}" already exists in scope "${cssObj.scope}"`
    );
  }

  container.classes[cssObj.scope] = [
    ...container.classes[cssObj.scope],
    cssObj.className
  ];

  const mainSheet = container.sheets.find(sheet => sheet.id === MAIN_SHEET_ID);

  insertRule(mainSheet.sheet, cssObj);

  return cssObj;
};

export default addClassToContainer;
