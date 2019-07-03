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
      <Container style={{backgroundColor: "#ffffff"}}>
        <Header style={{backgroundColor: "#ffffff", borderBottomWidth: 0}}>
          <Left />
          <Body style={{flex: 3}}>
            <Title>InsurAssistant</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          {
            /*
            <CardSelect
              title='Mes informations'
              backgroundColor='#F1F3C2'
              textColor='#000000'
              uri='https://luckyfurnitureuae.com/wp-content/uploads/2018/01/Me..png'
              onPress={() => {this.props.navigation.navigate('Perso')}}/>

            */
          }
          <CardSelect
            title='Suivi de dossier'
            backgroundColor='#00293C'
            textColor='#ffffff'
            uri='http://www.pngmart.com/files/1/Folders-PNG.png'
            onPress={() => {this.props.navigation.navigate('Historic')}}/>
          <CardSelect
            title='Assistant'
            backgroundColor='#F62A00'
            textColor='#ffffff'
            uri='https://i.dlpng.com/static/png/3839163_preview.png'
            onPress={() => {this.props.navigation.navigate('Chat')}}/>
        </Content>
      </Container>
    );
  }

}
