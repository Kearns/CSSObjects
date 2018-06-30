const padded = `
    width: 80%;
    padding: 10%;
`;

export const grid = `
    display: flex;
    flex-direction: column;
   
`;

export const row = `
    justify-content: space-around;
    display: flex;
    flex-direction: row;
    ${padded}
`;

export const col = width => `
    display: flex;
    flex-direction: column;
    padding: 10% 0;
    margin: 5%;
    width: ${10 * width}%;
`;
