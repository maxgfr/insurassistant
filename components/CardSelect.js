import React from 'react';
import {
  Card,
  CardItem,
  Text,
  Body
} from "native-base";
import {
  TouchableOpacity,
  Image,
  View
} from 'react-native';

export class CardSelect extends React.PureComponent {

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Card style={{marginBottom: 15}}>
          <CardItem>
            <Body style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Image
                style={{width: 50, height: 50, resizeMode: 'contain'}}
                source={{uri: this.props.uri}}
              />
              <Text style={{ flexWrap: 'wrap', padding: 20}}>{this.props.title}</Text>
            </Body>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }

}
