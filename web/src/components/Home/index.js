import React from "react";
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Home.css';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net');

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      byId: [],
      byHash: {},
      messages: [],
      conversations: [],
      input: '',
      username: 'watson_id',
      watson_id: 'watson_id',
      watson_name: 'Watson',
      watson_pp: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/IBM_Watson_Logo_2017.png/220px-IBM_Watson_Logo_2017.png',
    };
  }


  componentDidMount () {
    socket.on('new_tone', (data) => {
      //console.log(data);
      if(data.tone_name === 'Anger') {
        for(var i = 0; i<this.state.conversations.length; i++) {
          if(this.state.conversations[i].name === data.session_id) {
            alert('Pouvez-vous regarder de plus près la ' + this.state.conversations[i].name_simple);
          }
        }
      }
    });
    socket.on('new_irl', (data) => {
      //console.log(data);
      for(var i = 0; i<this.state.conversations.length; i++) {
        if(this.state.conversations[i].name === data.session_id) {
          alert('La ' + this.state.conversations[i].name_simple +' a besoin d\'un conseiller');
        }
      }
    });
    socket.on('new_message', (data) => {
      //console.log(data);
      var historicMessage = [];
      var byId = this.state.byId;
      var byHash = this.state.byHash;
      if(!byId.includes(data.session_id)) {
        byId.push(data.session_id);
        historicMessage = [];
      } else {
        historicMessage = byHash[data.session_id].historic;
      }
      historicMessage.push(data);
      byHash[data.session_id] = {historic: historicMessage};
      if(this.state.session_id === data.session_id) {
        var msg = {
          author: data.message.user._id,
          message: data.message.text,
          timestamp: new Date().getTime()
        }
        var arr = this.state.messages;
        arr.push(msg);
        this.setState({messages: arr, byId: byId, byHash: byHash});
      } else {
        var conv = [];
        var h = 1;
        for(var j=0; j<byId.length; j++) {
          conv.push({name: byId[j], name_simple: 'Conversation '+h});
          h++;
        }
        this.setState({conversations: conv, byId: byId, byHash: byHash});
      }
    })
    axios.get('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/get-data').then(response => {
      //console.log(response.data);
      if(response.data.success) {
        var data = response.data.data;
        var byId = [];
        var byHash = {};
        var historicMessage = [];
        for(var i=0; i<data.length; i++) {
          if(!byId.includes(data[i].session_id)) {
            byId.push(data[i].session_id);
            historicMessage = [];
          } else {
            historicMessage = byHash[data[i].session_id].historic;
          }
          historicMessage.push(data[i]);
          byHash[data[i].session_id] = {historic: historicMessage};
        }
        var conv = [];
        var h = 1;
        for(var j=0; j<byId.length; j++) {
          conv.push({name: byId[j], name_simple: 'Conversation '+h});
          h++;
        }
        this.setState({conversations: conv, byId: byId, byHash: byHash})
      }
    });
  }

  _onSend = () => {
    if(!this.state.session_id) {
      alert('Veuillez selectionner une conversation.');
    } else {
      if(this.state.input !== '') {
        this.saveDb(this.state.input);
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
  }

  saveDb = async (input) => {
    var data = {
      message: {
        _id: Math.round(Math.random() * 1000000),
        text: input,
        createdAt: new Date(),
        user: {
          _id: this.state.watson_id,
          name: this.state.watson_name,
          avatar: this.state.watson_pp
        }
      },
      session_id: this.state.session_id,
      context: {}
    }
    await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    socket.emit('send', data);
  }

  _onChangeText = (evt) => {
    this.setState({input: evt.target.value});
  }

  _onClickItem = (item) => {
    var sess_id = item.name;
    var arr = this.state.byHash[sess_id].historic;
    var msgs = [];
    //console.log(arr)
    for(var i=0; i<arr.length; i++) {
      msgs.push({
        author: arr[i].message.user._id,
        message: arr[i].message.text,
        timestamp: arr[i].message.createdAt
      })
    }
    msgs.sort((a, b) => (new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime()) ? 1 : -1);
    this.setState({messages: msgs, session_id: item.name})
  }

  render() {
    return (
      <div className="messenger">
        <div className="scrollable sidebar">
          <ConversationList
            conversations={this.state.conversations}
            onClickItem={this._onClickItem}
          />
        </div>
        <div className="scrollable content">
          <MessageList
            messages={this.state.messages}
            uid={'watson_id'}
            onSendMessage={this._onSend}
            input={this.state.input}
            onChangeMessage={this._onChangeText}
          />
        </div>
      </div>
    )
  }

}
