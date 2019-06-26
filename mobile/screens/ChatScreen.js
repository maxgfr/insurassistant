import React, { Component } from 'react'
import {
  Container,
  Header,
  Title,
  Body,
  Left,
  Right,
  Button,
  Icon,
  Text
} from "native-base"
import {
  View
} from "react-native"
import {
  Bubble,
  GiftedChat,
  SystemMessage
} from 'react-native-gifted-chat'
import AccessoryBar from '../components/AccessoryBar'
import CustomActions from '../components/CustomActions'
import CustomView from '../components/CustomView'

export default class ChatScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    step: 0,
    typingText: null,
    isLoadingEarlier: false,
    messages: [],
    session_id: '',
    context: {},
    watson_id: 'watson_id',
    watson_name: 'Watson',
    watson_pp: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/IBM_Watson_Logo_2017.png/220px-IBM_Watson_Logo_2017.png',
    user_id: 'user_id',
    user_pp: 'https://cdn-images-1.medium.com/max/1200/1*paQ7E6f2VyTKXHpR-aViFg.png',
    user_name: 'Maxime',
    list_message_unread: [],
    historic: false
  }

  async componentWillMount() {
    var nav_historic = this.props.navigation.getParam('historic', false);
    if(nav_historic) {
      var nav_data = this.props.navigation.getParam('data', {});
      var nav_session_id = this.props.navigation.getParam('session_id', '');
      var all_messages = [];
      for(var i = 0; i<nav_data.historic.length; i++) {
        all_messages.push(nav_data.historic[i].message);
      }
      //console.log(all_messages);
      all_messages.sort((a, b) => (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()) ? 1 : -1)
      console.log(all_messages);
      this.setState({messages: all_messages, historic: true, session_id: nav_session_id});
    } else {
      const response_serv_init = await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/create-session', {
          method: 'GET'
      });
      var result_serv_init = await response_serv_init.json();
      //console.log(result_serv_init);
      this.state.session_id = result_serv_init.data.session_id;
      this.sendToWatson('Bonjour');
    }

  }

  onSend = async (messages = []) => {
    //console.log(messages)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }))
    this.saveDb(messages[0]);
    this.sendToWatson(messages[0].text);
  }

  onSendSpecial = (data = []) => {
    const createdAt = new Date();
    const user = {
      _id: this.state.user_id,
      name: this.state.user_name,
      avatar: this.state.user_pp
    }
    var text = "";
    if(data[0].location) {
      text = "Here is my latitude";
    } else if(data[0].image) {
      text = "---IMAGE SENT---";
    }
    const messageToUpload = data.map(message => ({
      ...message,
      user,
      createdAt,
      text,
      _id: Math.round(Math.random() * 1000000)
    }))
    this.onSend(messageToUpload)
  }

  sendToWatson = async (msg_send) => {
    var data = {
      message: msg_send,
      context: this.state.context,
      session_id: this.state.session_id
    }
    //console.log(data)
    var process_message = null;
    if(this.state.list_message_unread.length == 0) {
      const response_serv = await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/send-message', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
      });
      var result_serv = await response_serv.json();
      //console.log(result_serv)
      this.state.context = result_serv.data.context;
      process_message = this.processWatsonMessage(result_serv)
    } else {
      process_message = this.state.list_message_unread[this.state.list_message_unread.length - 1];
      this.state.list_message_unread.pop();
    }
    process_message['createdAt'] = new Date();
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, process_message)
    }))
    this.saveDb(process_message);
  }

  saveDb = async (last_message) => {
    var data = {
      message: last_message,
      session_id: this.state.session_id,
      context: this.state.context,
    }
    const response_serv = await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    var result_serv = await response_serv.json();
    //console.log(result_serv)
  }

  processWatsonMessage = (result_serv) => {
    var new_message = {};
    for(var i = 0; i<result_serv.data.output.generic.length; i++) {
      var msg = {
        _id: Math.round(Math.random() * 1000000),
        text: result_serv.data.output.generic[i].text,
        //createdAt: new Date(),
        user: {
          _id: this.state.watson_id,
          name: this.state.watson_name,
          avatar: this.state.watson_pp
        }
      }
      if(result_serv.data.output.generic[i].options) {
        var values = [];
        for(var j=0; j<result_serv.data.output.generic[i].options.length; j++) {
          values.push({title: result_serv.data.output.generic[i].options[j].label, value: result_serv.data.output.generic[i].options[j].value.input.text});
        }
        var quickReplies = {
          type: 'radio',
          keepIt: false,
          values: values
        }
        msg['quickReplies'] = quickReplies;
        msg['text'] = result_serv.data.output.generic[i].title;
      }
      if(i == 0) {
        new_message = msg;
      } else {
        this.state.list_message_unread.push(msg);
      }
    }
    this.state.list_message_unread.reverse();
    return new_message;
  }

  onQuickReply = replies => {
    //console.log(replies);
    var real_message = [{
      _id: Math.round(Math.random() * 1000000),
      createdAt: new Date(),
      text: replies[0].title,
      user: {
        _id: this.state.user_id,
        name: this.state.user_name,
        avatar: this.state.user_pp
      }
    }];
    this.onSend(real_message);
  }

  renderCustomView(props) {
    return <CustomView {...props} />
  }

  renderAccessory = () => <AccessoryBar onSend={this.onSendSpecial} />

  renderCustomActions = props => {
    return <CustomActions {...props} onSend={this.onSendSpecial} />
  }

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    )
  }

  renderSystemMessage = props => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    )
  }

  renderFooter = props => {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: "#ffffff", borderBottomWidth: 0}}>
          <Left>
            <Button transparent onPress={() => {this.props.navigation.goBack()}}>
              <Icon name='arrow-back' style={{color: '#000'}}/>
            </Button>
          </Left>
          <Body>
            <Title>Assistant</Title>
          </Body>
          <Right />
        </Header>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          renderUsernameOnMessage={true}
          showUserAvatar={true}
          isLoadingEarlier={this.state.isLoadingEarlier}
          user={{
            _id: this.state.user_id,
            avatar: this.state.user_pp,
            name: this.state.user_name
          }}
          onQuickReply={this.onQuickReply}
          renderAccessory={this.renderAccessory}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          renderFooter={this.renderFooter}
        />
      </Container>
    )
  }
}
