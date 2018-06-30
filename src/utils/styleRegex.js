const styleRegex = style => new RegExp(`${style}:[\\w\\s]*;`, 'g');
export default styleRegex;

// const styleRegex = style => `/[\w\s]*:[\w\s]*;/g`;
