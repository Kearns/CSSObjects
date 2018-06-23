/**
 * adds media queries to container
 * @param {Object} container
 * @param {Object} cssObj
 *
 */
const addMediaQueriesToContainer = container => cssObj => {
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

    if (Array.isArray(cssObj.media[mediaQuery])) {
      mediaSheet.sheet.insertRule(
        `.${cssObj.class} { ${cssObj.media[mediaQuery].join(";")}`,
        0
      );
    } else if (typeof cssObj.media[mediaQuery] === "string") {
      mediaSheet.sheet.insertRule(
        `.${cssObj.class} {
            ${cssObj.media[mediaQuery]}
        }`,
        0
      );
    }
  });
};

export default addMediaQueriesToContainer;
