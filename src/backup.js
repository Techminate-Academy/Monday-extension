import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
//Explore more Monday React Components here: https://style.monday.com/
import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js"


const monday = mondaySdk();

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

    // let query = 'query ($boardIds: [Int]) { boards (ids:$boardIds) { name items(limit:10) {id name column_values { title text } } } }';
    // fetch ("https://api.monday.com/v2", {
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE2NTA1MDEyNCwidWlkIjozMDY3MDYxNiwiaWFkIjoiMjAyMi0wNi0xMFQyMDoyMDoyOC45NjRaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTIyMzIzMTIsInJnbiI6InVzZTEifQ.CCucZ5od4FS8_JpkbROF7ssUCc3dVxU3cK0I5kwp-cY'
    //   },
    //   body: JSON.stringify({
    //     'query' : query
    //   })
    //   })
    //   .then(res => res.json())
    //   .then(res => console.log(JSON.stringify(res, null, 2)));
  }

  render() {
    return <div className="App" style={{background: (this.state.settings.background)}}>
     <AttentionBox 
        title = {this.state.settings.attentionBoxTitle || "Hello !"}
        text={this.state.settings.attentionBoxMessage || "Welcome to our app "}
        type={this.state.settings.attentionBoxType || "success"}
      />
      <p>
      <AttentionBox 
        text = {JSON.stringify(this.state.boardData, null, 2)}
      />
      </p>
    </div>;
  }
}

export default App;