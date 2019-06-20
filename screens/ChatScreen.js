import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
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
} from "native-base";
import {
  ActivityIndicator,
  View
} from "react-native";

export default class ChatScreen extends React.Component {

  state = {
    messages: [],
    session_id: '',
    context: {},
    id_message: 1,
    is_waiting: true
  }

  static navigationOptions = {
    header: null,
  };

  async componentWillMount() {
    const response_serv = await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/create-session', {
        method: 'GET'
    });
    var result_serv = await response_serv.json();
    console.log(result_serv);
    this.setState({
      messages: [
        {
          _id: this.state.id_message,
          text: 'Hi ! How can I help you ?',
          createdAt: new Date(),
          user: {
            _id: 'watson_id',
            name: 'Watson',
            avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/IBM_Watson_Logo_2017.png/220px-IBM_Watson_Logo_2017.png',
          },
        },
      ],
      session_id: result_serv.data.session_id,
      is_waiting: false
    })
  }

  async onSend(messages = []) {
    var message = messages[0].text;
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
      is_waiting: true
    }))
    var data = {
    	message: message,
    	context: this.state.context,
    	session_id: this.state.session_id
    }
    console.log(data)
    const response_serv = await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    var result_serv = await response_serv.json();
    console.log(result_serv)
    var id_msg = this.state.id_message + 1;
    var new_message = [];
    var msg = {
      _id: id_msg,
      text: result_serv.data.output.generic[0].text,
      createdAt: new Date(),
      user: {
        _id: 'watson_id',
        name: 'Watson',
        avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/IBM_Watson_Logo_2017.png/220px-IBM_Watson_Logo_2017.png',
      }
    }
    new_message.push(msg);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, new_message),
      context: result_serv.data.context,
      id_message: id_msg,
      is_waiting: false
    }))
  }

  render() {
    return (
      <Container>
        <Header>
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
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 'maxime_id',
            avatar: 'https://cdn-images-1.medium.com/max/1200/1*paQ7E6f2VyTKXHpR-aViFg.png',
            name: 'Maxime'
          }}
          renderFooter={() => (
            <View>
              {
                this.state.is_waiting ?
                  <ActivityIndicator/>
                : null
              }
            </View>
          )}
        />
      </Container>
    )
  }
}
