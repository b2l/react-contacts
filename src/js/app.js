import React from 'react'

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to this Awesome learning lunch</h1>
      </div>
    );
  }
}

let mountNode = document.getElementById('app-container');
React.render(<App />, mountNode);
