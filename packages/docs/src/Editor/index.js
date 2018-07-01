import React from "react";
import oocss from "cssobjects";
import { width_50vw } from "../StyleGlobals";
import EditorContainer, { EditorConsumer } from "./EditorContainer";
import Example from "./Example";
const css = oocss.class({
  name: "editor"
});

const textareaCss = oocss.class({
  name: "textarea",
  scope: "editor",
  rules: `
  width: 100%;
  height: 100%;
  background: none;
  color: chartreuse;
  border: none;
  `
});

const Editor = props => (
  <EditorContainer>
    <EditorConsumer>
      {({ rules, onStyleChange }) => {
        css.rules = rules;
        return (
          <React.Fragment>
            <div>
              <div className={css.class}>Editor</div>
              <pre>{Example(rules)}</pre>
            </div>
            <div className={width_50vw.class}>
              <textarea className={textareaCss.class} onChange={onStyleChange}>
                {rules}
              </textarea>
            </div>
          </React.Fragment>
        );
      }}
    </EditorConsumer>
  </EditorContainer>
);

export default Editor;
