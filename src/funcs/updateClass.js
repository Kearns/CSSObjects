import { MAIN_SHEET_ID } from "../constants";

/**
 * adds class to container
 * @param {Object} container
 * @param {Object} cssObj
 *
 */
const updateClass = container => cssObj => {
  container.classes[cssObj.scope] = [
    ...container.classes[cssObj.scope],
    cssObj.className
  ];
  container.sheets
    .find(sheet => sheet.id === MAIN_SHEET_ID)
    .sheet.insertRule(`.${cssObj.class} { ${cssObj.rules.join(";")} }`, 0);
  return cssObj;
};

export default addClassToContainer;
