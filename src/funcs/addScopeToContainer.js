const addScopeToContainer = container => cssObj => {
  // ensure that if the scope already exists, that there is no existing class within that scope to collide with
  if (!container.scopes.includes(cssObj.scope)) {
    container.scopes.push(cssObj.scope);
    container.classes[cssObj.scope] = [];
  } else if (container.classes[cssObj.scope].includes(cssObj.class)) {
    throw Error(
      `ERROR: class "${cssObj.name}" already exists in scope "${cssObj.scope}"`
    );
  }
  return cssObj;
};

export default addScopeToContainer;
