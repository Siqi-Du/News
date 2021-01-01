import React, { Component } from 'react';
// import './App.css';
import NavigationBar from './components/NavigationBar';
import Spinner from './components/Spinner';


class App extends Component {
  

  // componentDidMount() {

    //empty local Storage 
    // var storage = window.localStorage;
    
    // for (let i=0;i<storage.length;i++){
    //     let key = storage.key(i);
    //     localStorage.removeItem(key);
    // }
  // }
  render() {
    return (
        <div className="App">
          <NavigationBar />
          <Spinner />
        </div>
    );
  }
}

export default App;
