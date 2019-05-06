import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  DeviceEventEmitter,
  ScrollView
} from 'react-native';
var { width, height } = Dimensions.get('window');

export default class LeftFlatList extends Component {
  // 构造
  constructor(props) {
    super(props);
    this.state = {
      cell: '0' //默认选中第一行
    };
  }
  render() {
    return (
      <FlatList
        ref="FlatList"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          width: 90,
          borderRightWidth: 1,
          borderRightColor: '#eee',
          backgroundColor: '#fff'
        }}
        data={this.props.data} //数据源
        renderItem={item => this.renderRow(item)} //每一行render
        // ItemSeparatorComponent={() => {
        //   return <View style={{ height: 1, backgroundColor: 'cyan' }} />;
        // }} //分隔线
        keyExtractor={(item: Object, index: number) => item.classifyTreeIndex} //使用json中的title动态绑定key
      />
    );
  }

  //每一行render
  renderRow = rowData => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.cellAction(rowData)}
      >
        <View
          style={{
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              height: '100%',
              width: 2,
              backgroundColor:
                rowData.item.classifyTreeIndex == this.state.cell
                  ? '#7f4395'
                  : 'rgba(0,0,0,0)'
            }}
          />
          <Text
            style={[
              { fontSize: 14 },
              {
                color:
                  rowData.item.classifyTreeIndex == this.state.cell
                    ? '#7f4395'
                    : '#333'
              }
            ]}
          >
            {/* {rowData.item.categoryName + rowData.item.classifyTreeIndex} */}
            {rowData.item.categoryName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //点击某行
  cellAction = item => {
    //if (item.item.classifyTreeIndex < this.props.data.length - 1) {
    this.setState({
      cell: item.item.classifyTreeIndex
    });
    // console.log('Left-LeftFlatList:' + item.item.classifyTreeIndex);
    DeviceEventEmitter.emit('left', {
      fromFlat: true,
      index: parseInt(item.item.classifyTreeIndex)
    }); //发监听
    // }
  };

  componentWillUnmount() {
    // 移除监听
    this.listener.remove();
  }

  componentWillMount() {
    this.listener = DeviceEventEmitter.addListener('right', e => {
      // console.log('Left-componentWillMount:' + e);
      this.refs.FlatList.scrollToIndex({
        viewPosition: 1,
        animated: true,
        index: e
      });
      this.setState({
        cell: e
      });
    });
  }
}

var styles = StyleSheet.create({});
