import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ListView,
  RefreshControl,
  PixelRatio
} from 'react-native';

import { Heading2, Heading3, Paragraph } from '../../widget/Text';
import EditView from '../../widget/EditView';
import { screen, system } from '../../common';
// import { setSpText, scaleSize, setSpText2 } from '../../common/ScreenUtil';
import { color, DetailCell, NavigationItem, SpacingView } from '../../widget';

type Props = {};

type State = {
  isRefreshing: boolean
};

class MineScene extends PureComponent<Props, State> {
  static navigationOptions = ({ navigation }: any) => ({
    // headerRight: (
    //   <View style={{ flexDirection: 'row' }}>
    //     <NavigationItem
    //       icon={require('')}
    //       onPress={() => {}}
    //     />
    //     <NavigationItem
    //       icon={require('')}
    //       onPress={() => {}}
    //     />
    //   </View>
    // ),
    headerStyle: {
      display: 'none'
      // backgroundColor: color.base,
      // elevation: 0,
      // borderBottomWidth: 0
    }
  });

  state: {
    isRefreshing: boolean
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      isRefreshing: false,
      editViewText: ''
    };
  }

  onHeaderRefresh() {
    this.setState({ isRefreshing: true });

    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 2000);
  }

  renderCells() {
    let cells = [];
    let dataList = this.getDataList();
    for (let i = 0; i < dataList.length; i++) {
      let sublist = dataList[i];
      for (let j = 0; j < sublist.length; j++) {
        let data = sublist[j];
        let cell = (
          <DetailCell
            image={data.image}
            title={data.title}
            subtitle={data.subtitle}
            key={data.title}
            attrTouchable={data.attrTouchable}
          />
        );
        cells.push(cell);
      }
      cells.push(<SpacingView key={i} />);
    }

    return (
      <ScrollView
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.state.isRefreshing}
        //     onRefresh={() => this.onHeaderRefresh()}
        //     tintColor="gray"
        //   />
        // }
        style={{ flex: 1 }}
      >
        {cells}
      </ScrollView>
    );
  }

  renderHeader() {
    return (
      <ImageBackground
        resizeMode="stretch"
        source={require('../../assets/images/mine/bg_user_info.png')}
        style={styles.headerContainer}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            bottom: 25,
            left: 25
          }}
        >
          <Image
            style={styles.avatar}
            source={require('../../assets/images/mine/icon_user_image.png')}
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  // alert('登录');
                  this.props.navigation.navigate('Login');
                }}
              >
                <Heading2 style={{ color: 'white', marginLeft: 5 }}>
                  登录
                </Heading2>
              </TouchableOpacity>
              <Heading2 style={{ color: 'white', marginLeft: 5 }}>|</Heading2>
              <TouchableOpacity
                onPress={() => {
                  alert('注册');
                }}
              >
                <Heading2 style={{ color: 'white', marginLeft: 5 }}>
                  注册
                </Heading2>
              </TouchableOpacity>
              {/* <Image
              style={{ marginLeft: 4 }}
              source={require('')}
            /> */}
            </View>
            {/* <Paragraph style={{ color: 'white', marginTop: 4 }}>
            个人信息 >
          </Paragraph> */}
          </View>
        </View>
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                alert('setting');
              }}
              style={{
                marginTop: 35,
                marginRight: 15,
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                style={{
                  width: 25,
                  height: 25
                }}
                resizeMode="stretch"
                source={require('../../assets/images/mine/icon_navigation_item_set_white.png')}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                alert(123);
              }}
              style={{
                width: 35,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                style={{
                  width: 25,
                  height: 25
                }}
                resizeMode="stretch"
                source={require('')}
              />
            </TouchableOpacity> */}
          </View>
        </View>
      </ImageBackground>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: color.paper }}>
        {/* <View
          style={{
            position: 'absolute',
            width: screen.width,
            height: screen.height / 2,
            backgroundColor: color.base
          }}
        /> */}
        {this.renderHeader()}
        <SpacingView />
        {this.renderCells()}
        <EditView
          // 在组件中使用this.editView即可访拿到EditView组件
          ref={editView => (this.editView = editView)}
          inputText={this.state.editViewText}
          titleTxt={'跳转至WebView'}
          ensureCallback={editViewText => {
            this.props.navigation.navigate('Web', {
              url: editViewText
            });
            //this.setState({ editViewText });
          }}
        />
        {/* <View>
          <Text style={{ fontSize: 14 }}>
            没适配,本机像素：{PixelRatio.get()}
          </Text>
          <Text style={{ fontSize: setSpText(14) }}>已适配</Text>
          <Text style={{ fontSize: setSpText2(14) }}>已适配</Text>
          <View
            style={{
              height: 50,
              width: 363,
              backgroundColor: 'green'
            }}
          />
          <View
            style={{
              height: scaleSize(50),
              width: scaleSize(373),
              backgroundColor: 'red'
            }}
          />
        </View> */}
      </View>
    );
  }

  getDataList() {
    return [
      [
        {
          title: '我的订单'
          // subtitle: '办信用卡',
          //image: require('')
        },
        {
          title: '我的余额'
          // subtitle: '￥95872385',
          //image: require('')
        },
        {
          title: '我的红包'
          // subtitle: '63',
        }
      ],
      [
        {
          title: '商家入驻',
          subtitle: '我要合作'
        },
        {
          title: '我要开店'
        },
        {
          title: '我的地址'
        },
        {
          title: '我的密码'
          // subtitle: 'v15',
        },
        {
          title: '设置支付密码'
          // subtitle: '好礼已上线',
        }
      ],
      [
        {
          title: '检查更新',
          attrTouchable: {
            activeOpacity: 0.8,
            onPress: () => {
              this.props.navigation.navigate('Update');
              // this.editView.show();
            }
          }
        },
        {
          title: '客服中心'
        },
        {
          title: '关于我们',
          attrTouchable: {
            activeOpacity: 0.8,
            onPress: () => {
              this.editView.show();
            }
          }
        }
      ]
    ];
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 27,
    height: 27
  },
  headerContainer: {
    // backgroundColor: color.base,
    height: 170,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff'
  }
});

export default MineScene;
