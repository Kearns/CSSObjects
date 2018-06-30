/**
 * adds media queries to container
 * @param {Object} container
 * @param {Object} cssObj
 *
 */

import { insertRule, findSheet } from "../utils/sheetFns";

const addMediaQueriesToContainer = container => cssObj => {
  if (Object.keys(cssObj.media).length === 0 || cssObj.media.length === 0) {
    return null;
  }
  Object.keys(cssObj.media).forEach(mediaQuery => {
    let mediaSheet;

    mediaSheet = findSheet({ container, mediaQuery });

    if (mediaSheet === undefined) {
      mediaSheet = document.createElement("style");
      mediaSheet.media = mediaQuery;
      container.sheets = [mediaSheet, ...container.sheets];
      document.head.appendChild(mediaSheet);
    }

    const sheet = mediaSheet.sheet;

    insertRule({ sheet, cssObj, mediaQuery });
  });
};

export default addMediaQueriesToContainer;
