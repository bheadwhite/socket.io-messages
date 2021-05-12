import { Component } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import axios from 'axios';

const URL = 'http://localhost:3001';
const socket = io(URL, { autoConnect: false });

class App extends Component {
  state = {
    username: '',
    userSet: false,
    messages: [],
    myMessage: '',
  };

  componentDidMount() {
    socket.on('connect', () => {
      this.setState({ userSet: true });
    });

    socket.on('message', (res) => {
      this.setState({ messages: res });
    });

    axios.get(`${URL}/api/getmessages`).then((res) => {
      this.setState({ messages: res.data });
    });
  }

  handleUserName = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  handleSubmitUser = () => {
    socket.auth = { username: this.state.username };
    socket.connect();
  };

  handleMyMessage = (e) => {
    this.setState({ myMessage: e.target.value });
  };

  handleSubmitMessage = () => {
    axios
      .post(`${URL}/api/message`, {
        user: this.state.username,
        message: this.state.myMessage,
      })
      .then(() => {
        this.setState({ myMessage: '' });
      });
  };

  handleUserKeyDown = (e) => {
    if (e.key.toUpperCase() === 'ENTER') {
      this.handleSubmitUser();
    }
  };

  handleMessageKeyDown = (e) => {
    if (e.key.toUpperCase() === 'ENTER') {
      this.handleSubmitMessage();
    }
  };

  render() {
    return (
      <div className='App'>
        messages:
        {this.state.messages.map((message, i) => (
          <div key={i}>
            <span>{message.user}:</span>
            {message.message}
          </div>
        ))}
        {this.state.userSet ? (
          <div>
            <input
              type='text'
              value={this.state.myMessage}
              onChange={this.handleMyMessage}
              ref={(e) => {
                if (e) {
                  e.focus();
                }
              }}
              onKeyDown={this.handleMessageKeyDown}
            />
            <button onClick={this.handleSubmitMessage}>submit message</button>
          </div>
        ) : (
          <div>
            <pre>hello to join chat.. please enter a username</pre>
            <input
              type='text'
              onChange={this.handleUserName}
              onKeyDown={this.handleUserKeyDown}
            />
            <button onClick={this.handleSubmitUser}>submit</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
