import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ListView,
  Image,
  StatusBar,
  FlatList,
  Clipboard
} from 'react-native';
import ScrollableTabView, {
  DefaultTabBar,
  ScrollableTabBar
} from 'react-native-scrollable-tab-view';
import TabBarView from './TabBarView';
import { Heading2, Heading3, Paragraph } from '../../widget/Text';
import { color, Button, NavigationItem, SpacingView } from '../../widget';
import { screen, system, Http } from '../../common';
import GroupPurchaseCell from '../GroupPurchase/GroupPurchaseCell';
import ITENLApi from '../../config/api';

type Props = {
  navigation: any
};

// type State = {
//   typeIndex: number,
//   refreshState: number,
//   data_first_index: Object,
//   data_first_moredata: Object
// };

type State = {
  refreshState: number,
  discounts: Array<Object>,
  dataList: Array<Object>,
  categoryList: Array<Object>,
  onTabBarChangeObj: Object
  // onTabBarChange: Function
  // refreshing: boolean,
  // data_index: Object,
  // data_moredata: {
  //   pageIndex: 1,
  //   pageSize: 20,
  //   pvId: 'd9d4ec32-1d53-4daf-85a7-d2601d36e81c1',
  //   recommendType: 1
  // }
};

class HomeScene extends PureComponent<Props, State> {
  static navigationOptions = ({ navigation }: any) => ({
    headerTitle: (
      <TouchableOpacity activeOpacity={0.8} style={styles.searchBar}>
        <Image
          source={require('../../assets/images/home/search_icon.png')}
          style={styles.searchIcon}
        />
        <Paragraph>请输入您想要的商品</Paragraph>
      </TouchableOpacity>
    ),
    // headerRight: (
    //   <NavigationItem
    //     style={styles.msgbox}
    //     icon={require('')}
    //     onPress={() => {}}
    //   />
    // ),
    // headerLeft: (
    //   <NavigationItem
    //     icon={require('')}
    //     titleStyle={{ color: 'white' }}
    //     onPress={() => {}}
    //   />
    // ),
    // headerStyle: { backgroundColor: color.primary }
    headerStyle: styles.header
  });

  constructor(props: Props) {
    super(props);
    // let categoryList = mock.categoryList.categoryList;
    // categoryList.splice(0, 0, {
    //   categoryID: '0',
    //   categoryName: '推荐',
    //   categoryType: 0,
    //   jumpType: '0',
    //   subCategoryList: []
    // });
    this.state = {
      discounts: [],
      dataList: [],
      refreshing: false,
      categoryList: [], // categoryList,
      onTabBarChangeObj: null
      // onTabBarChange: obj => {}
    };
  }

  componentDidMount() {
    this.getData_CategoryList();
  }

  process_CategoryList = categoryList => {
    categoryList.splice(0, 0, {
      categoryID: '0',
      categoryName: '推荐',
      categoryType: 0,
      jumpType: '0',
      subCategoryList: []
    });
    // categoryList.push({
    //   categoryID: '0',
    //   categoryName: '',
    //   categoryType: 0,
    //   jumpType: '0',
    //   subCategoryList: []
    // });
    return categoryList;
  };

  getData_CategoryList = () => {
    Http.POST(ITENLApi.apiplus.category.tree, {}).done(data => {
      if (data) {
        let categoryList = this.process_CategoryList(data);
        this.setState({
          categoryList: categoryList
        });
      }
    });
  };

  render() {
    let scrollableTabBarHeight = 42;
    return (
      <View style={styles.scrollableTabViewContainer}>
        <ScrollableTabView
          tabBarPosition="top"
          tabBarBackgroundColor="white"
          tabBarActiveTextColor="#7e4395"
          tabBarInactiveTextColor="#737373"
          tabBarTextStyle={{
            // letterSpacing: 1,
            fontSize: 14,
            marginRight: -5,
            marginLeft: -5
            // paddingLeft:-10
          }}
          // prerenderingSiblingsNumber={10}
          tabBarUnderlineStyle={{
            backgroundColor: '#7e4395',
            height: 2
            // marginBottom: 5
          }}
          // initialPage={0}
          // onChangeTab={obj => {
          //   let sd = obj;
          //   debugger;
          // }}
          onChangeTab={obj => {
            this.setState({
              onTabBarChangeObj: obj
            });
          }}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{
                height: scrollableTabBarHeight,
                borderWidth: 0
                // height:'100%',
                // backgroundColor: 'red'
              }}
              tabsContainerStyle={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // height: '100%',
                // backgroundColor:'red',
                paddingLeft: 10,
                paddingRight: 50,
                width: '100%'
              }}
            />
          )}
        >
          {this.state.categoryList.map((item, i) => {
            return (
              <TabBarView
                ref={'TabBarView_' + i}
                // onTabBarChange={this.state.onTabBarChange}
                onTabBarChangeObj={this.state.onTabBarChangeObj}
                categoryID={item.categoryID}
                tabLabel={item.categoryName} //ScrollableTabView 控件所需参数
                key={i}
                subCategoryList={item.subCategoryList}
                navigation={this.props.navigation}
              />
            );
          })}
        </ScrollableTabView>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            alert(123);
          }}
          style={{
            right: 0,
            height: scrollableTabBarHeight,
            width: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            backgroundColor: '#fff',
            // backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center'
            // opacity: 0.1
          }}
        >
          <Image
            style={{
              width: 20,
              height: 12,
              resizeMode: 'stretch'
            }}
            source={require('../../assets/images/public/icon_arrow_down.png')}
          />
        </TouchableOpacity>
        <View
          style={{
            right: 40,
            position: 'absolute',
            opacity: 0.8,
            backgroundColor: '#fff',
            // backgroundColor: 'red',
            height: scrollableTabBarHeight,
            width: 10
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollableTabViewContainer: {
    flex: 1
    // backgroundColor:'#ececec',
    // backgroundColor: color.paper
  },
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
  msgbox: {
    // flex: 1
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

export default HomeScene;
