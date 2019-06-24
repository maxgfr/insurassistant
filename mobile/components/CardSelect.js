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
        <Card style={{marginBottom: 15, backgroundColor: this.props.backgroundColor, elevation: 5, borderRadius: 10, shadowOffset: { width: 0, height: 0 }, shadowOpacity: .3, shadowRadius: 3, borderWidth: 3, paddingVertical: 6}}>
          <CardItem style={{ backgroundColor: "transparent" }}>
            <Body style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{ flexWrap: 'wrap', padding: 20, fontFamily:'Roboto', color: this.props.textColor}}>{this.props.title}</Text>
              <Image
                style={{width: 50, height: 50, resizeMode: 'contain'}}
                source={{uri: this.props.uri}}
              />
            </Body>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }

}
