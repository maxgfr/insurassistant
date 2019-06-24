import { AppLoading, Asset, Linking } from 'expo'
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
  ActivityIndicator,
  View,
  StyleSheet,
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
    id_message: 0,
    is_waiting: false,
    watson_id: 'watson_id',
    watson_name: 'Watson',
    watson_pp: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/IBM_Watson_Logo_2017.png/220px-IBM_Watson_Logo_2017.png',
    user_id: 'user_id',
    user_pp: 'https://cdn-images-1.medium.com/max/1200/1*paQ7E6f2VyTKXHpR-aViFg.png',
    user_name: 'Maxime'
  }

  async componentWillMount() {
    this.setState(previousState => ({
      is_waiting: true
    }));
    const response_serv_init = await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/create-session', {
        method: 'GET'
    });
    var result_serv_init = await response_serv_init.json();
    //console.log(result_serv_init);
    this.state.session_id = result_serv_init.data.session_id;
    this.sendToWatson('Bonjour');
  }

  onSend = async (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
      is_waiting: true
    }))
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
      text = "Here is the image";
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
    const response_serv = await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    var result_serv = await response_serv.json();
    //console.log(result_serv)
    var id_msg = this.state.id_message + 1;
    var txt = result_serv.data.output.generic[0].text;
    var new_message = [];
    var msg = {
      _id: id_msg,
      text: txt,
      createdAt: new Date(),
      user: {
        _id: this.state.watson_id,
        name: this.state.watson_name,
        avatar: this.state.watson_pp
      }
    }
    new_message.push(msg);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, new_message),
      context: result_serv.data.context,
      id_message: id_msg,
      is_waiting: false
    }))
    this.saveDb();
  }

  saveDb = async () => {
    var data = {
      messages: this.state.messages,
      session_id: this.state.session_id,
      context: this.state.context,
      id_message: this.state.id_message
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

  onQuickReply = replies => {
    const createdAt = new Date()
    if (replies.length === 1) {
      this.onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user,
        },
      ])
    } else if (replies.length > 1) {
      this.onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map(reply => reply.title).join(', '),
          user,
        },
      ])
    } else {
      console.warn('replies param is not set correctly')
    }
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
        <Header style={{backgroundColor: "#ffffff"}}>
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
