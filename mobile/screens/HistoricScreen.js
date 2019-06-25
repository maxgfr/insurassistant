import React from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  ListItem,
  Text,
  Button,
  Icon
} from 'native-base';
import {
  FlatList
} from 'react-native';

export default class HistoricScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    itemsById: [],
    itemsByHash: {}
  };

  async componentDidMount() {
    try {
      const response_serv_init = await fetch('https://insurassistant-anxious-hyena.eu-gb.mybluemix.net/get-data', {
          method: 'GET'
      });
      var result_serv_init = await response_serv_init.json();
      var data = result_serv_init.data;
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
      this.setState({itemsById: byId, itemsByHash: byHash});
    } catch(e) {
      console.log(e)
    }
  }

  _onRenderItem = ({ index, item }) => (
    <ListItem onPress={() => {this.props.navigation.navigate('Chat', {data: this.state.itemsByHash[item], historic: true, session_id: item})}}>
      <Left>
         <Text>Dossier : {item}</Text>
       </Left>
       <Right>
         <Icon name="arrow-forward" />
       </Right>
    </ListItem>
  );

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
            <Title>Suivi</Title>
          </Body>
          <Right />
        </Header>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.itemsById}
          renderItem={this._onRenderItem}
          />
      </Container>
    );
  }
}
