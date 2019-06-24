import React from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Body,
  Left,
  Right
} from "native-base";
import {
  CardSelect
} from '../components/CardSelect'

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container style={{backgroundColor: "#FFF"}}>
        <Header>
          <Left />
          <Body>
            <Title>Home</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <CardSelect
            title='Suivi de dossier'
            backgroundColor='#63ccff'
            textColor='#ffffff'
            uri='http://www.pngmart.com/files/1/Folders-PNG.png'
            onPress={() => {this.props.navigation.navigate('Historic')}}/>
          <CardSelect
            title='Accident'
            backgroundColor='#d84315'
            textColor='#ffffff'
            uri='https://i.dlpng.com/static/png/3839163_preview.png'
            onPress={() => {this.props.navigation.navigate('Chat')}}/>
        </Content>
      </Container>
    );
  }

}
