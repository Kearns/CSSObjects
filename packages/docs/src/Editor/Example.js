const Example = rules => `
const css = oocss.class({
    name: "editor",
    scope: "demo",
    rules: \`\n${rules}\`
});

const Editor = props => <div className={css.class}>Editor</div>

// Returns
// <div class="demo__editor">Editor</div>

// We can update and rewrite styles by simply updating the rules on our new cssobject:

css.rules = \`\n${rules}
\`;

// If we try to make another 'demo__editor' class it will throw an error
// However, we can create a new instance that can be expanded upon with:

const cssInstance = oocss.instance(css);

// returns a class of 'demo__editor--xxxx-xx-xxxx' with the inherited base rules

// We can also add media query specific styles to a class utilizing:

const mqExampleCSS = oocss.class({
    name: "mqExample",
    scope: "demo",
    rules: // rules go here
    media: {
        'screen and (max-width: 700px)': \`
            background: white;
        \`,
        // etc. etc. etc.
    }
});

`;

export default Example;
