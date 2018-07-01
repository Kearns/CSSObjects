import { MAIN_SHEET_ID } from "../constants";
import { insertRule, findSheet } from "../utils/sheetFns";
/**
 * adds class to container
 * @param {Object} container
 * @param {Object} cssObj
 *
 */
const addClassToContainer = container => cssObj => {
  try {
    // ensure that if the scope already exists, that there is no existing class within that scope to collide with
    if (container.classes[cssObj.scope].includes(cssObj.class)) {
      throw Error(
        `ERROR: class "${cssObj.name}" already exists in scope "${
          cssObj.scope
        }"`
      );
    }

    container.classes[cssObj.scope] = [
      ...container.classes[cssObj.scope],
      cssObj.className
    ];

    const sheet = findSheet({ container, id: MAIN_SHEET_ID }).sheet;

    insertRule({ sheet, cssObj });

    return cssObj;
  } catch (err) {
    console.error(err);
  }
};

export default addClassToContainer;
