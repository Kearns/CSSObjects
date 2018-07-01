const invariant = (key, action) => {
  try {
    if (key[0] === "_") {
      throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
  } catch (err) {
    console.error(err);
  }
};

export default invariant;
