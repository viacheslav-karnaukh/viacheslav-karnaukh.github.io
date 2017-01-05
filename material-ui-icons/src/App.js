import React, { Component } from 'react';
import { MuiThemeProvider, Toggle } from 'material-ui';
import logo from './logo.svg';
import './App.css';
import * as icons from 'material-ui/svg-icons';


const SVG = (props) => <props.icon className={props.className} style={props.styles}/>

class App extends Component {
  state = {
    darkTheme: true
  }

  toggleTheme() {
    this.setState({darkTheme: !this.state.darkTheme});
  }

  render() {
    const styles = {
      color: {
        color: this.state.darkTheme ? '#ccc' : '#777'
      },
      backgroundColor: {
        backgroundColor: this.state.darkTheme ? '#222' : '#fff'
      },
      fill: {
        fill: this.state.darkTheme ? '#61dafb' : '#000'
      }
    };

    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Material-UI Icons</h2>
          </div>
          <div className="content" style={{...styles.color, ...styles.backgroundColor}}>
            <Toggle
              label={`Dark theme ${this.state.darkTheme ? 'ON' : 'OFF'}`}
              labelStyle={{...styles.color}}
              defaultToggled={true}
              onToggle={this.toggleTheme.bind(this)}
            />
            <ul className="icons">
              {Object.keys(icons).map(iconName => (
                  <li className="icon-block" key={iconName}>
                    <SVG className="svg-icon" icon={icons[iconName]} styles={{...styles.fill}}/>
                    <span>{iconName}</span>
                  </li>
                ))}
            </ul>
          </div>
          
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
