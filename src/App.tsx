import React, { Component } from 'react';
import {VideoPlayer} from './components/VideoPlayer';
import './App.css';
import { VideoPicker } from './components/VideoPicker';

class App extends Component {

  render() {

    return (
      <div className="App">
			  <VideoPicker> </VideoPicker>
      </div>
    );
  }
}

export default App;
