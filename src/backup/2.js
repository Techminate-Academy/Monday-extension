import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"

import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"
import Button from "monday-ui-react-core/dist/Button.js"

const monday = mondaySdk();
var crewList = []

class App extends React.Component {
  constructor(props) {
    super(props);
    // Default state
    this.state = {
      settings: {},
      boardData: {},
      name: "",
    };
  }

  componentDidMount() {
    monday.listen("settings", res => {
      this.setState({ settings: res.data });
    });

    monday.listen("context", res => {
      this.setState({context: res.data});
      console.log(res.data);
      monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:10) {id name column_values { title text } } } }`,
        { variables: {boardIds: this.state.context.boardIds} }
      )
      .then(res => {
        this.setState({boardData: res.data});
      });
    })
  }

  getCrewList(){
    monday.listen("context", res => {
      console.log(res.data.boardIds[0]);
      monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:10) {id name column_values { title text } } } }`,
        { variables: {boardIds: res.data.boardIds} }
      )
      .then(res => {
        crewList.push(res.data)
        console.log(JSON.stringify(crewList, null, 2))
      });
    })
  }

  render() {
    return <div className="App" style={{background: (this.state.settings.background)}}>
      <AttentionBox text = {JSON.stringify(crewList, null, 2)} />
      
      <Button onClick={this.getCrewList}>
        Pull Crews
      </Button>
    </div>;
  }
}

export default App;