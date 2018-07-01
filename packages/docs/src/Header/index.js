import React from "react";
import oocss from "cssobjects";
import { textColor, container } from "../StyleGlobals";

const HeaderContainer = props => {
  const css = oocss.instance(container);
  css.rules = `
    ${css.rules} 
    justify-content: center;
    align-items: center;
  `;
  return <header className={css.class}>{props.children}</header>;
};

const HeaderTitle = props => {
  const css = oocss.class({
    name: "title",
    scope: "header",
    rules: `
        font-family: 'Comfortaa', sans-serif;
        margin: 0;
        padding: 10px;
        color: white;
    `
  });
  return <h1 className={css.class}>{props.children}</h1>;
};

const ColoredText = ({ color, children }) => {
  const letter = oocss.instance(textColor);
  letter.rules = `color: ${color};`;
  return <span className={letter.class}>{children}</span>;
};

const Header = props => (
  <HeaderContainer>
    <HeaderTitle>
      <ColoredText color="lightseagreen">{"{"}</ColoredText>
      <ColoredText color="lightblue">css</ColoredText>
      <ColoredText color="chartreuse">objects</ColoredText>
      <ColoredText color="lightseagreen">{"}"}</ColoredText>
    </HeaderTitle>
  </HeaderContainer>
);

export default Header;
