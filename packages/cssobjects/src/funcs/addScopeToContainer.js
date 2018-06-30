/**
 * adds scope to container
 * @param {Object} container
 * @param {Object} cssObj
 *
 */

const addScopeToContainer = container => cssObj => {
  if (!container.scopes.includes(cssObj.scope)) {
    container.scopes.push(cssObj.scope);
    container.classes[cssObj.scope] = [];
  }
  return cssObj;
};

export default addScopeToContainer;
