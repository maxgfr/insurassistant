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
  Icon
} from "native-base";

export default class ChatScreen extends React.Component {

  state = {
    messages: [],
  }

  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: '1',
          text: 'Salut',
          createdAt: new Date(),
          user: {
            _id: '2',
            name: 'Watson',
            avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/00/IBM_Watson_Logo_2017.png/220px-IBM_Watson_Logo_2017.png',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
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
            _id: 'Maxime',
            avatar: 'https://cdn-images-1.medium.com/max/1200/1*paQ7E6f2VyTKXHpR-aViFg.png',
            name: 'Maxime'
          }}
        />
      </Container>
    )
  }
}
