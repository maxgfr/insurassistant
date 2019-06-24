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


export default class PersonnalInfoScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container style={{backgroundColor: "#FFF"}}>
        <Header style={{backgroundColor: "#FFF"}}>
          <Left />
          <Body>
            <Title>Mes informations</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>

        </Content>
      </Container>
    );
  }

}
