export const insertRule = (sheet, styleObj, { mediaQuery, index = 0 }) => {
  const rules = mediaQuery ? styleObj.media[mediaQuery] : styleObj.rules;
  return sheet.insertRule(
    `.${styleObj.class}{${rules}}`.replace(/\s*/g, ""),
    index
  );
};

export const deleteRule = (sheet, { index }) => {
  return sheet.deleteRule(index);
};
