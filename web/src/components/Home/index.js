import React from "react";
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Home.css';
import axios from 'axios';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      conversations: [],
      input: '',
      username: 'watson_id'
    };
  }


  componentDidMount () {

  }

  _onSend = () => {
    if(this.state.input !== '') {
      var msg = {
        author: this.state.username,
        message: this.state.input,
        timestamp: new Date().getTime()
      }
      var arr = this.state.messages;
      arr.push(msg);
      this.setState({messages: arr, input: ''});
    }
  }

  _onChangeText = (evt) => {
    this.setState({input: evt.target.value});
  }

  render() {
    return (
      <div className="messenger">
        <div className="scrollable sidebar">
          <ConversationList
            conversations={this.state.conversations}
          />
        </div>
        <div className="scrollable content">
          <MessageList
            messages={this.state.messages}
            uid={this.state.username}
            onSendMessage={this._onSend}
            input={this.state.input}
            onChangeMessage={this._onChangeText}
          />
        </div>
      </div>
    )
  }

}
