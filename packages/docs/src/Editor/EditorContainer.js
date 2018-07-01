import React from "react";
import oocss from "cssobjects";
import { container } from "../StyleGlobals";

const { Provider, Consumer } = React.createContext();
const css = oocss.instance(container);
css.rules = `${css.rules} justify-content: space-between;`;

export { Consumer as EditorConsumer };
export default class EditorContainer extends React.Component {
  state = {
    rules: `font-family: 'Comfortaa', sans-serif; 
margin: 0; 
padding: 10px; 
color:white;`
  };
  render() {
    return (
      <div className={css.class}>
        <Provider
          value={{
            ...this.state,
            onStyleChange: e => this.setState({ rules: e.target.value })
          }}
        >
          {this.props.children}
        </Provider>
      </div>
    );
  }
}
