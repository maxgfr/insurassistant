import React from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  List,
  ListItem,
  Text,
  Button,
  Icon
} from 'native-base';

export default class HistoricScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

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
            <Title>Suivi</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <List>
            <ListItem onPress={() => {console.log('sisi')}}>
              <Left>
                 <Text>Dossier : XXXX</Text>
               </Left>
               <Right>
                 <Icon name="arrow-forward" />
               </Right>
            </ListItem>
            <ListItem onPress={() => {console.log('sisi')}}>
              <Left>
                 <Text>Dossier : YYYY</Text>
               </Left>
               <Right>
                 <Icon name="arrow-forward" />
               </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
