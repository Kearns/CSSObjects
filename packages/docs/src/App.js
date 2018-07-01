import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import Editor from "./Editor";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Editor />
      </div>
    );
  }
}

export default App;
