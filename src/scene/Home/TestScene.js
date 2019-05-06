'use strict';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import Toast from '../../widget/ToastUtils';

class TestScene extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    let toast1 = Toast.Long('This is a message Long BOTTOM', {
      position: Toast.positions.BOTTOM
    });
    let toast2 = Toast.Short('This is a message Short CENTER');

    setTimeout(() => {
      this.setState(
        {
          visible: true
        },
        () => {
          setTimeout(() => {
            this.setState({ visible: false });
          }, 2000);
        }
      );
    }, 1000);
  }

  render() {
    return (
      <View>
        <Text>123</Text>
        <Toast
          visible={this.state.visible}
          position={50}
          shadow={false}
          animation={false}
          hideOnPress={true}
        >
          This is a ToastComp
        </Toast>
      </View>
    );
  }
}

export default TestScene;
