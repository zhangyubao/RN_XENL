import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ListView, Image, SectionList, Platform } from 'react-native';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';

import { Heading2, Heading3, Paragraph } from '../../widget/Text';
import { color, Button, NavigationItem, SpacingView } from '../../widget';
import { screen, system, Http } from '../../common';
import ITENLApi from '../../config/api';
import LeftFlatList from './LeftFlatList';
import RightSectionList from './RightSectionList';
const ITEM_HEIGHT = 50; //item的高度
const HEADER_HEIGHT = 24; //分组头部的高度
const SEPARATOR_HEIGHT = 0; //分割线的高度

type Props = {
  navigation: any
};

class ClassifyScene extends PureComponent<Props> {
  static navigationOptions = ({ navigation }: any) => ({
    headerTitle: (
      <TouchableOpacity activeOpacity={0.8} style={styles.searchBar}>
        <Image source={require('../../assets/images/home/search_icon.png')} style={styles.searchIcon} />
        <Paragraph>请输入您想要的商品</Paragraph>
      </TouchableOpacity>
    ),
    // headerStyle: { backgroundColor: 'white', display: 'none' },
    headerStyle: styles.header
  });

  constructor(props) {
    super(props);
    this.state = {
      classifyTree: []
    };
  }

  componentDidMount() {
    this.getData_ClassifyTree();
  }

  procData_ClassifyTree(data) {
    if (data && data.length) {
      return data.filter((item, index) => {
        if (item && !item.data && item.subCategoryList) {
          item.classifyTreeIndex = index.toString();
          item.data = item.subCategoryList;
        }
        return item.categoryID != '0';
      });
    } else {
      [];
    }
  }

  getData_ClassifyTree(src) {
    Http.POST(ITENLApi.apiplus.category.tree, {}).done(data => {
      if (data) {
        let tree = this.procData_ClassifyTree(data);
        this.setState({
          classifyTree: tree
        });
      }
    });
  }

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <LeftFlatList data={this.state.classifyTree} />
        <RightSectionList data={this.state.classifyTree} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 0,
    backgroundColor: color.background,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 0,
    shadowOpacity: 0
  },
  searchBar: {
    // width: screen.width * 0.69,
    width: '100%',
    height: 30,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    alignSelf: 'center'
  },
  searchIcon: {
    width: 15,
    height: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5
  }
});

export default ClassifyScene;
