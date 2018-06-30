export const insertRule = ({
  sheet,
  cssObj,
  mediaQuery = undefined,
  index = 0
}) =>
  sheet.insertRule(
    `.${cssObj.class}{${
      mediaQuery ? cssObj.media[mediaQuery] : cssObj.rules
    }}`.replace(/\s*/g, ""),
    index
  );

export const deleteRule = ({ sheet, index }) => sheet.deleteRule(index);

export const findSheet = ({ container, id, mediaQuery }) =>
  id
    ? container.sheets.find(sheet => sheet.id === id)
    : container.sheets.find(
        sheet =>
          sheet.sheet.media["mediaText"].toLowerCase().replace(/\s/g, "") ===
          mediaQuery.toLowerCase().replace(/\s/g, "")
      );
