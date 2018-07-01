const Example = rules => `
const css = oocss.class({
    name: "editor"
});

css.rules = \`\n${rules}\`;

const Editor = props => <div className={css.class}>Editor</div>
`;

export default Example;
