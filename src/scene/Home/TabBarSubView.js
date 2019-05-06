import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heading2, Heading3, Paragraph } from '../../widget/Text';
import { screen, system } from '../../common';
import { color } from '../../widget';

type Props = {
  items: Array<string>,
  itemKey: String,
  itemValue: String,
  selectedIndex: number,
  onSelected: Function,
  extView: Component
};

type State = {
  containerStyle: Object
};

class TabBarSubView extends PureComponent<Props, State> {
  constructor(props: Object) {
    super(props);
    this.state = {};
    // if (this.props.items && this.props.items.length > 0) {
    //   this.state.containerStyle.borderBottomColor = '#fff';
    //   this.state.containerStyle.borderBottomWidth = 1;
    // }
  }
  static defaultProps = {
    onSelected: () => {}
  };
  render() {
    return (
      <View>
        <View style={styles.container}>
          {this.props.items.map((item, i) => (
            <TouchableOpacity
              key={i}
              ref={'TabBar_' + item[this.props.itemValue]}
              style={[
                {
                  backgroundColor:
                    this.props.selectedIndex == i ? color.base : 'white'
                },
                styles.item
              ]}
              onPress={() => this.props.onSelected(item, i)}
            >
              <Paragraph
                style={{
                  color: this.props.selectedIndex == i ? 'white' : color.base
                }}
              >
                <Text style={{ textAlign: 'center' }} numberOfLines={1}>
                  {item[this.props.itemKey]}
                </Text>
              </Paragraph>
            </TouchableOpacity>
          ))}
        </View>
        {this.props.extView ? this.props.extView : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:'#fbfbfb'
  },
  item: {
    width: screen.width / 4 - 10,
    marginLeft: 8,
    marginTop: 5,
    marginBottom: 5,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: screen.onePixel,
    borderColor: color.base
  }
});

export default TabBarSubView;
