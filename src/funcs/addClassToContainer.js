import { MAIN_SHEET_ID } from "../constants";

const addClassToContainer = container => cssObj => {
  container.classes[cssObj.scope].push(cssObj.className);
  container.sheets
    .find(sheet => sheet.id === MAIN_SHEET_ID)
    .sheet.insertRule(`.${cssObj.class} { ${cssObj.rules.join(";")} }`, 0);
  return cssObj;
};

export default addClassToContainer;
