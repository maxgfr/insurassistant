import React from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Body,
  Left,
  Right,
  Button,
  Icon
} from "native-base";


export default class PersonnalInfoScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container style={{backgroundColor: "#ffffff"}}>
        <Header style={{backgroundColor: "#ffffff", borderBottomWidth: 0}}>
          <Left>
            <Button transparent onPress={() => {this.props.navigation.goBack()}}>
              <Icon name='arrow-back' style={{color: '#000'}}/>
            </Button>
          </Left>
          <Body style={{flex: 3}}>
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
