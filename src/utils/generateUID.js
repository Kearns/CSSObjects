const generateUID = () => {
  let d = new Date().getTime();
  const uid = "xxxx-xx-xxxx".replace(/[x]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uid;
};

export default generateUID;
