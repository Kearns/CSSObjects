const invariant = (key, action) => {
  if (key[0] === "_") {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
};

export default invariant;
