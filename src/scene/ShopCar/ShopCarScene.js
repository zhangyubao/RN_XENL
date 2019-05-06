import React, { Component, PureComponent } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  Image,
  ListView,
  TouchableOpacity,
  TouchableHighlight,
  PanResponder,
  ScrollView,
  FlatList,
  RefreshControl
} from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';

import { Heading2, Heading3, Paragraph } from '../../widget/Text';
import { screen, system, Http } from '../../common';
import { color, DetailCell, SpacingView } from '../../widget';
import ITENLApi from '../../config/api';
import ShopCarMenuItem from './ShopCarMenuItem';
import GroupPurchaseCell from '../GroupPurchase/GroupPurchaseCell';
import Toast from '../../widget/ToastUtils';

type Props = {
  navigation: any
};

type State = {
  data: Array<Object>,
  isShowHeader: boolean,
  refreshState: number,
  prevTop: number,
  isFirst: boolean,
  data_first_moredata: Object
};

class ShopCarScene extends Component<Props, State> {
  static navigationOptions = ({ navigation }: any) => ({
    title: '购物车',
    // headerLeft: (
    //   <View>
    //     <Button
    //       title={'haha'}
    //       onPress={(a, b, c) => {
    //         let sd = navigation;
    //         let s1 = 32;
    //       }}
    //     />
    //   </View>
    // ),
    headerStyle: {
      backgroundColor: 'white',
      borderBottomWidth: 0,
      height: 45,
      // display:
      //   navigation.state.params && !navigation.state.params.isShowHeader
      //     ? 'none'
      //     : 'flex'
      display: 'flex'
    }
  });

  constructor(props: Props) {
    super(props);

    this.state = {
      data: [],
      refreshState: RefreshState.Idle,
      isShowHeader: true,
      prevTop: 0,
      isFirst: true,
      data_first_moredata: {
        isNext: true, //是否还有下一页
        pageIndex: 1,
        pageSize: 20,
        lovelyList: [], //mock.likeData.data.lovelyList,
        pvId: 'd9d4ec32-1d53-4daf-85a7-d2601d36e81c'
      }
    };
    // this.onStartShouldSetPanResponder = this.onStartShouldSetPanResponder.bind(
    //   this
    // );
    // this.onMoveShouldSetPanResponder = this.onMoveShouldSetPanResponder.bind(
    //   this
    // );
    // this.onPanResponderGrant = this.onPanResponderGrant.bind(this);
    // this.onPanResponderMove = this.onPanResponderMove.bind(this);
    // this.onPanResponderRelease = this.onPanResponderRelease.bind(this);
  }

  // 获取托底数据猜你喜欢
  //getData_ByLike = async () => {
  getData_ByLike = () => {
    this.setState({ refreshState: RefreshState.FooterRefreshing });
    if (this.state.data_first_moredata.isNext) {
      Http.POST(ITENLApi.apiplus.home.recommend, {
        data: {
          pageIndex: this.state.data_first_moredata.pageIndex,
          pageSize: this.state.data_first_moredata.pageSize,
          pvId: this.state.data_first_moredata.pvId
        }
      }).done(res => {
        if (res) {
          let result = res;
          result.pageIndex++;
          result.pvId = this.state.data_first_moredata.pvId;
          if (result.lovelyList && result.lovelyList.length > 0) {
            // Toast.Long('购物车已请求:' + result.lovelyList.length + '条数据', {
            //   position: Toast.positions.TOP
            // });
            if (
              result.lovelyList.length < this.state.data_first_moredata.pageSize
            ) {
              result.isNext = false;
            } else {
              result.isNext = true;
            }
            if (
              this.state.data_first_moredata.lovelyList &&
              this.state.data_first_moredata.lovelyList.length < 1000 &&
              result.lovelyList
            ) {
              let obj = JSON.parse(JSON.stringify(result.lovelyList));
              for (let i = 0; i < 1000; i++) {
                result.lovelyList.push(...obj);
                // result.lovelyList = result.lovelyList.concat(result.lovelyList);
              }
              // Toast.Long(
              //   '购物车已进行重复合并数据:' +
              //     result.lovelyList.length +
              //     '条数据'
              // );
            }
            result.lovelyList = result.lovelyList.concat(
              this.state.data_first_moredata.lovelyList
            );
            this.setState({
              data_first_moredata: result
            });
          } else {
            let data_first_moredata = this.state.data_first_moredata;
            data_first_moredata.isNext = false;
            this.setState({
              data_first_moredata: data_first_moredata
            });
          }
          this.setState({ refreshState: RefreshState.Idle });
        }
      });
    } else {
      this.setState({ refreshState: RefreshState.Idle });
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({
      isShowHeader: true
    });
    this.getData_ByLike();
    //this.requestData();
  }

  componentWillMount(evt, gestureState) {
    // this._panResponder = PanResponder.create({
    //   //用户开始触摸屏幕的时候，是否愿意成为响应者；默认返回false，无法响应，
    //   // 当返回true的时候则可以进行之后的事件传递。
    //   onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
    //   //在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互；
    //   onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
    //   //开始手势操作，也可以说按下去。给用户一些视觉反馈，让他们知道发生了什么事情！（如：可以修改颜色）
    //   onPanResponderGrant: this.onPanResponderGrant,
    //   //最近一次的移动距离.如:(获取x轴y轴方向的移动距离 gestureState.dx,gestureState.dy)
    //   onPanResponderMove: this.onPanResponderMove,
    //   //用户放开了所有的触摸点，且此时视图已经成为了响应者。
    //   onPanResponderRelease: this.onPanResponderRelease,
    //   //另一个组件已经成为了新的响应者，所以当前手势将被取消。
    //   onPanResponderTerminate: this.onPanResponderEnd
    // });
  }

  requestData = async () => {
    try {
      this.setState({ refreshState: RefreshState.HeaderRefreshing });

      let response = await fetch(api.recommend);
      let json = await response.json();

      console.log(JSON.stringify(json));

      let dataList = json.data.map(info => {
        return {
          id: info.id,
          imageUrl: info.squareimgurl,
          title: info.mname,
          subtitle: `[${info.range}]${info.title}`,
          price: info.price
        };
      });

      // 偷懒，用同一个测试接口获取数据，然后打乱数组，造成数据来自不同接口的假象 >.<
      dataList.sort(() => {
        return 0.5 - Math.random();
      });

      this.setState({
        data: dataList,
        refreshState: RefreshState.NoMoreData
      });
    } catch (error) {
      this.setState({
        refreshState: RefreshState.Failure
      });
    }
  };

  keyExtractor = (item: Object, index: number) => {
    return item.id.toString();
  };

  renderHeader = () => {
    return (
      <View style={styles.container}>
        {/* <Button
          title="Test"
          onPress={() => {
            // this.props.navigation.navigate('Web', {
            //   url: 'http://m.itenl.com'
            // });
            // this.props.navigation.setParams({
            //   isShowHeader: !this.props.navigation.state.params.isShowHeader
            // });
          }}
        /> */}
        {/* <DetailCell
          title="我的订单"
          subtitle="全部订单"
          style={{ height: 38 }}
        />

        <View style={styles.itemContainer}>
          <ShopCarMenuItem
            title="待付款"
            icon={require('../../assets/images/tabbar/icon_tabbar_home_sel.png')}
          />
          <ShopCarMenuItem
            title="待使用"
            icon={require('../../assets/images/tabbar/icon_tabbar_home_sel.png')}
          />
          <ShopCarMenuItem
            title="待评价"
            icon={require('../../assets/images/tabbar/icon_tabbar_home_sel.png')}
          />
          <ShopCarMenuItem
            title="退款/售后"
            icon={require('../../assets/images/tabbar/icon_tabbar_home_sel.png')}
          />
        </View>

        <SpacingView />

        <DetailCell
          title="我的收藏"
          subtitle="查看全部"
          style={{ height: 38 }}
        /> */}
      </View>
    );
  };

  renderCell = (rowData: any) => {
    return (
      <GroupPurchaseCell
        info={rowData.item}
        index={rowData.index}
        onPress={() => {
          if (rowData.item.suId) {
            this.props.navigation.navigate('Production', {
              suId: rowData.item.suId
            });
          }
        }}
      />
    );
  };

  //用户开始触摸屏幕的时候，是否愿意成为响应者；
  onStartShouldSetPanResponder(evt, gestureState) {
    // console.log(gestureState);
    // _previousTop = gestureState.dy;
    // console.log(_previousTop);
    return true;
  }

  //在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互；
  onMoveShouldSetPanResponder(evt, gestureState) {
    return true;
  }

  // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
  onPanResponderGrant(evt, gestureState) {
    // console.log(_previousLeft, _previousTop);
    // console.log('onPanResponderGrant...');
    // this.setState({
    //   style: {
    //     backgroundColor: 'red',
    //     left: _previousLeft, //_previousLeft和_previousTop是两个变量，用来记录小球移动坐标
    //     top: _previousTop
    //   }
    // });
  }

  // 最近一次的移动距离为gestureState.move{X,Y}
  onPanResponderMove(evt, gestureState) {
    // if (_previousTop === 0) {
    //   _previousTop = gestureState.dy;
    //   console.log('_previousTop: ' + _previousTop);
    // }
  }

  // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
  // 一般来说这意味着一个手势操作已经成功完成。
  onPanResponderRelease(evt, gestureState) {
    // lastLeft = _previousLeft;
    // lastTop = _previousTop;
    //console.log(evt);
    //console.log(gestureState);
    console.log(gestureState.dy);
    //this.changePosition();
  }

  render() {
    return (
      // <View style={styles.container} {...this._panResponder.panHandlers}>
      <View style={styles.container}>
        <RefreshListView
          // onScroll={event => {
          //   if (this.state.isFirst) {
          //     this.setState({
          //       isFirst: false
          //     });
          //     return;
          //   }
          //   let currentTop = event.nativeEvent.contentOffset.y,
          //     prevTop = this.state.prevTop,
          //     absTop = 50;
          //   if (currentTop < 0) {
          //     return;
          //   }
          //   if (prevTop < currentTop && currentTop !== 0) {
          //     this.props.navigation.setParams({
          //       isShowHeader: false
          //     });
          //   } else {
          //     this.props.navigation.setParams({
          //       isShowHeader: true
          //     });
          //   }
          //   console.log(prevTop, currentTop);
          //   //if (Math.abs(currentTop - prevTop) > absTop) {
          //   this.setState({
          //     prevTop: currentTop
          //   });
          //   //return;
          //   //}
          // }}
          // legacyImplementation={true}
          keyExtractor={(item, index) => index.toString()}
          scrollEventThrottle={20}
          data={this.state.data_first_moredata.lovelyList}
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderCell}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.getData_ByLike}
          onFooterRefresh={() => {
            this.getData_ByLike();
          }}
          footerRefreshingText={'加载中...'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  itemContainer: {
    flexDirection: 'row'
  }
});

export default ShopCarScene;
