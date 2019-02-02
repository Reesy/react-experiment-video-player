import React, { Component } from 'react';
import {VideoPlayer} from './components/VideoPlayer';
import './App.css';

class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header">
			<VideoPlayer> </VideoPlayer>
        </header>
      </div>
    );
  }
}

export default App;
