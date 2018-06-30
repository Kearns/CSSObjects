import { MAIN_SHEET_ID } from "../constants";
import { insertRule, deleteRule } from "../utils/sheetFns";

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

  deleteRule({ sheet: mainSheet.sheet, index });

  insertRule({
    cssObj,
    sheet: mainSheet.sheet,
    index: mainSheet.rules.length
  });

  return cssObj;
};

export default updateClassToContainer;
