import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ListView,
  Image,
  Animated,
  Easing,
  InteractionManager,
  WebView,
  ToastAndroid,
  Dimensions
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import ScrollableTabView, {
  DefaultTabBar,
  ScrollableTabBar
} from 'react-native-scrollable-tab-view';
import {
  color,
  Button,
  NavigationItem,
  Separator,
  SpacingView
} from '../../widget';
import Lightbox from 'react-native-lightbox';
import Swiper from 'react-native-swiper';
import { Heading2, Heading3, Paragraph, Heading1 } from '../../widget/Text';
import { screen, system, Http } from '../../common';
import ProductionCell from './ProductionCell';
import ITENLApi from '../../config/api';
import ProductionSltPanel from './ProductionSltPanel';
import Carousel from 'react-native-looped-carousel';
import Toast from '../../widget/ToastUtils';
// import { Loading, EasyLoading } from 'react-native-easy-loading';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const BASE_PADDING = 10;
const PRODUCTION_HEIGHT = WINDOW_WIDTH; //system.isIOS ? 420 : 380;

type Props = {
  navigation: any
};

type State = {
  data: Array<Object>,
  isShowWeb: boolean,
  // isShowRightPay
  touchPositionCount: number,
  serviceAreaBottomAnimated: number,
  serviceAreaMaskOpacityAnimated: number,
  goPayText: String,
  goPayPrice: number,
  goPayDuration: number,
  productionData: any,
  ScrollableTabViewSelectPage: number
};

let singleHeaderWidth = 65,
  absLeft = new Animated.Value(0 * singleHeaderWidth);
class ProductionScene extends PureComponent<Props, State> {
  static navigationOptions = ({ navigation }: any) => {
    let customHeaders = [
      { title: '商品', index: 0 },
      { title: '详情', index: 0 },
      { title: '评价', index: 0 }
    ];
    let nav = {
      headerMode: 'screen',
      // headerTitle: '商品详情',
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: 'white'
        // display: 'none'
      },
      headerTitle: (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'pink',
            flex: 1
          }}
        >
          <View
            style={{
              // flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
              // backgroundColor:'#000'
            }}
          >
            {customHeaders.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  style={{
                    // backgroundColor: 'red',
                    width: singleHeaderWidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // paddingLeft: 18,
                    // paddingRight: 18,
                    paddingTop: 10,
                    paddingBottom: 10,
                    position: 'relative'
                  }}
                  onPress={() => {
                    navigation.state.params &&
                      navigation.state.params.onHeaderChanged(index);
                  }}
                >
                  <Text
                    style={[
                      {
                        color: '#737373'
                      },
                      !navigation.state.params ||
                      (navigation.state.params &&
                        navigation.state.params.selectedIndex === index)
                        ? { color: '#7e4395' }
                        : { color: '#737373' }
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <Animated.View
              style={{
                left: absLeft,
                backgroundColor: '#7e4395',
                width: 65,
                height: 2,
                bottom: 0,
                position: 'absolute'
              }}
            />
          </View>
        </View>
      ),
      headerLeft: (
        <NavigationItem
          iconStyle={{
            width: 20,
            height: 20
            // marginTop: 0
          }}
          icon={require('../../assets/images/production/icon_goods_arrow_back.png')}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: (
        <NavigationItem
          iconStyle={{
            width: 20,
            height: 20
            // marginTop: 0
          }}
          icon={require('../../assets/images/production/icon_productedit_more.png')}
          onPress={() => {}}
        />
      ),
      headerStyle: {
        // display: 'none'
      }
    };
    return nav;
  };

  constructor(props: Props) {
    super(props);
    let scrollableTabBarHeight = 65;
    this.state = {
      data: [],
      scrollableTabBarHeight: scrollableTabBarHeight,
      // 顶部 图文详情 动画遮罩
      fadeOutCenterViewTop: new Animated.Value(scrollableTabBarHeight),
      isShowWeb: false,
      touchPositionCount: 0,
      // 服务说明弹层
      serviceAreaBottomAnimated: new Animated.Value(-WINDOW_HEIGHT),
      // 服务说明遮罩
      serviceAreaMaskOpacityAnimated: new Animated.Value(0),
      // 接口返回的编辑器页数据
      productionData: null,
      goPayPrice: 0,
      goPayDuration: 0,
      ScrollableTabViewSelectPage: 0,
      productionSwiperIndex: 0,
      productionCarouselIndex: 0
    };
  }

  componentDidMount() {
    absLeft.setValue(0);
    this.props.navigation.setParams({
      selectedIndex: 0,
      onHeaderChanged: index => {
        this.changHeaderStatus(index);
      }
    });
    //InteractionManager.runAfterInteractions(() => {
    this.getData_ProductionInfo();
    //});
  }

  changHeaderStatus = index => {
    this.props.navigation.setParams({
      selectedIndex: index
    });
    Animated.timing(absLeft, {
      toValue: index * singleHeaderWidth,
      duration: 300,
      easing: Easing.out(Easing.quad)
    }).start();
    this.setState({
      ScrollableTabViewSelectPage: index
    });
  };

  getData_ProductionInfo = () => {
    // this.setState({
    //   productionData: data
    // });
    let params = this.props.navigation.state.params,
      suId = params && params.suId; //|| '1301085006000100001';
    if (!suId) {
      alert('无效的参数：suId');
      this.props.navigation.goBack();
    }
    Http.POST(ITENLApi.appapi.production.productAndRasterEditorData, {
      data: {
        suId: suId
      }
    }).done(data => {
      if (data) {
        this.setState({
          productionData: data
        });
      } else {
        Toast.Long(
          `${suId}：内网访问模式 数据获取异常\n正在切换外网访问模式`
        );
        this.getData_ProductionInfoByXbr(suId);
      }
    });
  };

  getData_ProductionInfoByXbr = suId => {
    Http.POST(ITENLApi.xbrapi.production.productAndRasterEditorData, {
      data: {
        suId: suId
      }
    }).done(data => {
      if (data) {
        this.setState({
          productionData: data
        });
      } else {
        Toast.Long(`${suId}：外网访问模式 数据获取异常}`);
      }
    });
  };

  renderCarouselByLightbox = index => (
    <Swiper
      style={{
        height: PRODUCTION_HEIGHT
      }}
      // index={this.state.productionCarouselIndex}
      onIndexChanged={index => {
        // this.setState({
        //   productionCarouselIndex: 0
        // });
      }}
      loop={false}
      showsPagination={true}
      autoplay={false}
      dot={
        <View
          style={{
            // backgroundColor: 'rgba(0,0,0,.2)',
            // borderWidth: 1.5,
            // borderColor: color.base,
            // borderStyle: 'solid',
            backgroundColor: '#383838',
            width: 8,
            height: 8,
            borderRadius: 10,
            marginLeft: 10
          }}
        />
      }
      activeDot={
        <View
          style={{
            backgroundColor: '#ffffff',
            width: 8,
            height: 8,
            borderRadius: 10,
            marginLeft: 10
          }}
        />
      }
    >
      {this.state.productionData &&
      this.state.productionData.imgList &&
      this.state.productionData.imgList.length ? (
        this.state.productionData.imgList.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              style={{ width: WINDOW_WIDTH, height: WINDOW_WIDTH, flex: 1 }}
              key={index}
              onPress={() => {
                this.closeLightboxCallback && this.closeLightboxCallback();
              }}
            >
              <Image
                style={{ width: '100%', height: '100%', flex: 1 }}
                resizeMode="contain"
                source={{
                  uri: item
                }}
              />
            </TouchableOpacity>
          );
        })
      ) : (
        <View />
      )}
    </Swiper>
  );

  toggleHeaderAnimated = (showTuWen: boolean) => {
    let ftop = this.state.fadeOutCenterViewTop.__getValue();
    //if (ftop === 0) {
    if (!showTuWen) {
      Animated.timing(this.state.fadeOutCenterViewTop, {
        toValue: this.state.scrollableTabBarHeight,
        duration: 300,
        easing: Easing.out(Easing.quad)
      }).start();
    } else {
      Animated.timing(this.state.fadeOutCenterViewTop, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.quad)
      }).start();
    }
  };

  contentViewScroll = (e: Object) => {
    var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
    console.log(offsetY, contentSizeHeight, oriageScrollHeight, e.nativeEvent);
    if (offsetY + oriageScrollHeight >= contentSizeHeight - 10) {
      if (this.state.touchPositionCount >= 1) {
        this.toggleHeaderAnimated(true);
        this.setState({
          isShowWeb: true,
          touchPositionCount: this.state.touchPositionCount - 1
        });
      } else {
        this.setState({
          touchPositionCount: this.state.touchPositionCount + 1
        });
      }
    }
  };

  closeLightboxCallback = () => {};

  renderInfoCarousel = () => {
    return (
      <Carousel
        pageInfoBottomContainerStyle={{
          marginLeft: WINDOW_WIDTH - 100,
          bottom: 10,
          position: 'absolute'
          // backgroundColor: 'red'
        }}
        delay={2000} //自动切换的延迟 （毫秒）
        isLooped={true}
        style={{ height: PRODUCTION_HEIGHT }} //轮播组件的样式
        autoplay={false} //自动轮播
        pageInfo={true} //在底部显示当前页面下标 / 页面个数
        swiper={true} //允许手势滑动
        pageInfoBackgroundColor={'rgba(0,0,0,.3)'} //分页标示的背景色
        onAnimateNextPage={p => console.log(p)} //切换页面时的回调
        pageInfoTextStyle={{ color: '#fff' }} //下面字体样式
        pageInfoTextSeparator={'/'} //中间的分隔符
      >
        {this.state.productionData && this.state.productionData.imgList ? (
          React.Children.map(
            this.state.productionData.imgList,
            (item, index) => {
              return (
                <Lightbox
                  ref={'Lightbox'}
                  renderHeader={close => {
                    this.closeLightboxCallback = close;
                  }}
                  // activeProps={resizeMode: 'contain', flex: 1, height: WINDOW_WIDTH }
                  //springConfig={{ tension: 15, friction: 7 }}
                  style={{
                    // width: '100%',
                    flex: 1,
                    // width:WINDOW_WIDTH
                    height: WINDOW_WIDTH
                  }}
                  swipeToDismiss={false}
                  renderContent={this.renderCarouselByLightbox}
                  // onOpen={(a, b, c) => {
                  //   console.log('onOpen');
                  // }}
                  // onClose={(a, b, c) => {
                  //   console.log('onClose');
                  // }}
                >
                  <Image
                    resizeMode="stretch"
                    style={{ width: '100%', height: '100%' }}
                    // source={(item.uri.indexOf('http') === 0 || item.uri.indexOf('https') === 0) ? { uri: item.uri} : item.uri}
                    source={typeof item === 'number' ? item : { uri: item }}
                  />
                </Lightbox>
              );
            }
          )
        ) : (
          <View style={styles.container} />
        )}
      </Carousel>
    );
  };

  renderInfo = () => {
    return (
      <View>
        {!this.state.isShowWeb || true ? (
          <ScrollView
            horizontal={false}
            onMomentumScrollEnd={this.contentViewScroll}
          >
            {this.renderInfoCarousel()}
            <View style={styles.titles}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#353535', fontSize: 16 }}>
                    {this.state.productionData &&
                      this.state.productionData.goodsName}
                  </Text>
                  <Text
                    style={{ color: '#6F6F6F', fontSize: 12, marginTop: 10 }}
                  >
                    {this.state.productionData &&
                      this.state.productionData.salePoint}
                  </Text>
                </View>
                <View
                  style={{
                    // backgroundColor: 'red',
                    marginTop: 10,
                    marginRight: -15,
                    flexDirection: 'column',
                    // height: '100%',
                    width: 65,
                    alignItems: 'center',
                    // justifyContent: 'space-around',
                    justifyContent: 'center',
                    borderLeftColor: '#d7d7d7',
                    borderLeftWidth: 1
                  }}
                >
                  <Image
                    style={{ height: 20, width: 20 }}
                    source={require('../../assets/images/production/icon_new_share.png')}
                  />
                  <Text
                    style={{ marginTop: 10, fontSize: 12, color: '#b2b2b2' }}
                  >
                    分享
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 15,
                  marginBottom: 10
                }}
              >
                <Text>
                  <Text style={{ color: '#f33', fontSize: 15 }}>￥</Text>
                  <Text style={{ color: '#f33', fontSize: 23 }}>
                    {this.state.goPayPrice}
                  </Text>
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#6F6F6F', fontSize: 12 }}>
                    生产周期：
                    {this.state.goPayDuration}天
                  </Text>
                  <Image
                    style={{ height: 12, width: 12, marginLeft: 5 }}
                    resizeMode={'stretch'}
                    source={require('../../assets/images/production/icon_notice_red.png')}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Animated.timing(this.state.serviceAreaBottomAnimated, {
                  toValue: 0,
                  duration: 300,
                  easing: Easing.out(Easing.quad)
                }).start(() => {
                  Animated.timing(this.state.serviceAreaMaskOpacityAnimated, {
                    toValue: 0.4,
                    duration: 300,
                    easing: Easing.out(Easing.quad)
                  }).start();
                });
              }}
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                // backgroundColor: '#f3f3f3',
                backgroundColor: '#f5f5f5',
                height: 45
              }}
            >
              <View
                style={{
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                {this.state.productionData && this.state.productionData.policy
                  ? this.state.productionData.policy.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <Image
                            style={{ height: 12, width: 12, marginLeft: 5 }}
                            resizeMode={'stretch'}
                            source={require('../../assets/images/home/icon_design_sale_success.png')}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#858585',
                              marginLeft: 5
                            }}
                          >
                            {item.policyName}
                          </Text>
                        </View>
                      );
                    })
                  : null}
              </View>
              <Image
                style={{ height: 12, width: 12, marginLeft: 5 }}
                resizeMode={'stretch'}
                source={require('../../assets/images/public/icon_index_arrow_right.png')}
              />
            </TouchableOpacity>
            <View style={{ height: 20, backgroundColor: '#f2f2f2' }} />
            <View
              style={{
                backgroundColor: '#fff',
                // paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 10
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.refs.ProductionSltPanel_ref.show();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 45,
                  justifyContent: 'space-between'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text>已选择：</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: 5,
                        color: '#353535'
                      }}
                    >
                      {this.state.goPayText}
                    </Text>
                  </View>
                </View>
                <Image
                  style={{ height: 12, width: 12, marginLeft: 5 }}
                  resizeMode={'stretch'}
                  source={require('../../assets/images/public/icon_index_arrow_right.png')}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 40,
                  justifyContent: 'space-between',
                  borderTopColor: '#d7d7d7',
                  borderTopWidth: 1
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text>配送至：</Text>
                  <Image
                    style={{ height: 18, width: 12, marginLeft: 5 }}
                    resizeMode={'stretch'}
                    source={require('../../assets/images/production/icon_location_unsel.png')}
                  />
                  <Text style={{ marginLeft: 10, color: '#353535' }}>
                    无法获取位置
                  </Text>
                </View>
                <Image
                  style={{ height: 12, width: 12, marginLeft: 5 }}
                  resizeMode={'stretch'}
                  source={require('../../assets/images/public/icon_index_arrow_right.png')}
                />
              </View>
            </View>
            {this.renderSimpleComment()}
            {this.renderOnSellGoods()}
          </ScrollView>
        ) : (
          this.renderWeb()
        )}
      </View>
    );
  };

  renderOnSellGoods = () => {
    return this.state.productionData &&
      this.state.productionData.onSellGoodsInfo ? (
      <View>
        <View style={{ height: 20, backgroundColor: '#f2f2f2' }} />
        <View
          style={{
            backgroundColor: '#fff',
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10
          }}
        >
          <View
            style={{
              paddingBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
              // borderBottomColor: '#d7d7d7',
              // borderBottomWidth: 1
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1
              }}
            >
              <Image
                resizeMode={'stretch'}
                style={{
                  height: 55,
                  width: 55
                }}
                source={{
                  uri: this.state.productionData.onSellGoodsInfo.supplierImg
                }}
              />
              <Text style={{ marginLeft: 10, flex: 1 }}>
                {this.state.productionData.onSellGoodsInfo.supplierName}
              </Text>
            </View>
            <View
              style={{
                // backgroundColor: 'red',
                marginTop: 10,
                flexDirection: 'column',
                // height: '100%',
                width: 65,
                alignItems: 'center',
                // justifyContent: 'space-around',
                justifyContent: 'center',
                borderLeftColor: '#d7d7d7',
                borderLeftWidth: 1
              }}
            >
              <Text style={{ fontSize: 16, color: '#e7b32b' }}>
                {this.state.productionData.onSellGoodsInfo.onsellCount}
              </Text>
              <Text style={{ marginTop: 5, fontSize: 12, color: '#828282' }}>
                在售商品
              </Text>
            </View>
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ paddingLeft: 20, paddingTop: 20, paddingRight: 20 }}
            // contentContainerStyle={{
            //   paddingLeft: 100,
            //   paddingTop: 100,
            //   marginLeft: 500,
            //   marginTop: 500
            // }}
            style={{ marginLeft: -10, marginTop: 10, paddingBottom: 20 }}
            horizontal={true}
          >
            {this.state.productionData.onSellGoodsInfo.recommendProducts.map(
              (item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      this.props.navigation.navigate('Production', {
                        suId: item.suId
                      });
                    }}
                    key={index}
                    style={{
                      flexDirection: 'column',
                      marginLeft: 10,
                      width: 100
                    }}
                  >
                    <Image
                      resizeMode={'stretch'}
                      style={{ height: 100, width: 100 }}
                      source={{ uri: item.imageUrl }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        marginTop: 5,
                        color: '#353535',
                        fontSize: 13,
                        width: 100
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ marginTop: 5, fontSize: 12, color: '#f33' }}>
                      ￥{item.price}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </ScrollView>
        </View>
      </View>
    ) : null;
  };

  renderSimpleComment = () => {
    return this.state.productionData &&
      this.state.productionData.commentInfo &&
      this.state.productionData.commentInfo.bestComment &&
      Object.keys(this.state.productionData.commentInfo.bestComment).lenght >
        0 ? (
      <View>
        <View
          style={{
            height: 40,
            backgroundColor: '#f2f2f2',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: '20%',
              height: 1,
              backgroundColor: '#d7d7d7',
              marginRight: 10
            }}
          />
          <Text>评论</Text>
          <View
            style={{
              width: '20%',
              height: 1,
              backgroundColor: '#d7d7d7',
              marginLeft: 10
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flexDirection: 'column',
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              height: 30,
              alignItems: 'center'
            }}
          >
            <Text>商品评价</Text>
            <Text style={{ marginLeft: 10 }}>
              （{this.state.productionData.commentInfo.allCommentCount}）
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 30,
              alignItems: 'center'
            }}
          >
            <Image
              style={{ height: 24, width: 24, borderRadius: 12 }}
              resizeMode={'contain'}
              source={{
                uri:
                  this.state.productionData.commentInfo.bestComment &&
                  this.state.productionData.commentInfo.bestComment.avatarUrl
              }}
            />
            <Text style={{ marginLeft: 10 }}>
              {this.state.productionData.commentInfo.bestComment &&
                this.state.productionData.commentInfo.bestComment.nickname}
            </Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ marginTop: 10, color: '#353535', lineHeight: 20 }}>
              {this.state.productionData.commentInfo.bestComment &&
                this.state.productionData.commentInfo.bestComment.content}
            </Text>
            <View
              style={{
                marginTop: 20,
                marginBottom: 30,
                height: 24,
                width: 100,
                borderRadius: 20,
                borderColor: '#7E4395',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#7E4395' }}>查看全部评价</Text>
            </View>
          </View>
        </View>
      </View>
    ) : null;
  };

  toggleServiceArea = () => {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          bottom: this.state.serviceAreaBottomAnimated
          // display: 'none'
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            backgroundColor: '#000',
            opacity: this.state.serviceAreaMaskOpacityAnimated,
            width: '100%',
            height: '100%'
          }}
        >
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%'
            }}
            onPress={() => {
              Animated.timing(this.state.serviceAreaMaskOpacityAnimated, {
                toValue: 0,
                duration: 100,
                easing: Easing.out(Easing.quad)
              }).start(() => {
                Animated.timing(this.state.serviceAreaBottomAnimated, {
                  toValue: -WINDOW_HEIGHT,
                  duration: 300,
                  easing: Easing.out(Easing.quad)
                }).start();
              });
            }}
            activeOpacity={1}
          />
        </Animated.View>
        <View
          style={{
            opacity: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            // transform:[{translateY:'100%'}],
            width: '100%',
            borderTopColor: '#eee',
            borderTopWidth: 1,
            flexDirection: 'column',
            // justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff'
          }}
        >
          <View
            style={{
              height: 48,
              width: '100%',
              borderBottomColor: '#eee',
              borderBottomWidth: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: '#353535'
              }}
            >
              服务说明
            </Text>
          </View>
          <ScrollView
            style={{
              maxHeight: WINDOW_HEIGHT / 2,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            {this.state.productionData && this.state.productionData.policy
              ? this.state.productionData.policy.map((item, index) => {
                  return (
                    <View key={index} style={{ marginBottom: 15 }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Image
                          resizeMode={'stretch'}
                          style={{ height: 12, width: 12 }}
                          source={require('../../assets/images/home/icon_design_sale_success.png')}
                        />
                        <Text
                          style={{
                            marginLeft: 5,
                            color: '#7E4395',
                            fontSize: 16
                          }}
                        >
                          {item.policyName}
                        </Text>
                      </View>
                      <Text
                        style={{
                          marginLeft: 17,
                          marginTop: 10,
                          fontSize: 14,
                          lineHeight: 20
                        }}
                      >
                        {item.policyDescription}
                      </Text>
                    </View>
                  );
                })
              : null}
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              bottom: 0,
              marginTop: 10,
              // position: 'absolute',
              backgroundColor: '#7E4395',
              height: 48,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => {
              Animated.timing(this.state.serviceAreaMaskOpacityAnimated, {
                toValue: 0,
                duration: 100,
                easing: Easing.out(Easing.quad)
              }).start(() => {
                Animated.timing(this.state.serviceAreaBottomAnimated, {
                  toValue: -WINDOW_HEIGHT,
                  duration: 300,
                  easing: Easing.out(Easing.quad)
                }).start();
              });
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: '#fff'
              }}
            >
              完成
            </Text>
          </TouchableOpacity>
          <View />
        </View>
      </Animated.View>
    );
  };

  renderWeb = () => {
    // let suid = '1300475999010100001';
    // let uri = 'https://m.itenl.com/nativeHtmls/Details?suid=' + suid;
    let uri =
      (this.state.productionData && this.state.productionData.goodsDetailUrl) ||
      '';
    // uri = 'https://m.itenl.com';
    // this.props.navigation.navigate('Web', {
    //   url: 'https://m.itenl.com/nativeHtmls/Details?suid=' + suid
    // });
    //<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    return this.state.productionData &&
      this.state.productionData.goodsDetailUrl ? (
      <View
        style={{
          height: '100%',
          width: '100%'
          // backgroundColor: 'pink'
        }}
      >
        {/* <ScrollView
          onMomentumScrollEnd={e => {
            var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
            var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
            var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
            //alert(JSON.stringify(e.nativeEvent));
            console.log(
              offsetY,
              contentSizeHeight,
              oriageScrollHeight,
              e.nativeEvent
            );
            if (offsetY <= 0) {
              this.toggleHeaderAnimated(false);
              this.setState({
                isShowWeb: false
              });
            }
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={
            {
              // flex: 1
              // height: 300
              // width:'100%',
              // overflow: 'hidden'
            }
          }
        > */}
        <WebView
          style={{
            height: WINDOW_HEIGHT,
            width: WINDOW_WIDTH
            // backgroundColor: 'red'
          }}
          injectedJavaScript={
            system.isIOS
              ? ''
              : `
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content =
              'width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no';
            document.getElementsByTagName('head')[0].appendChild(meta);
            `
          }
          // scalesPageToFit=true
          onScrollChanged={() => {
            alert(123);
          }}
          onScroll={() => {
            alert(123);
          }}
          javaScriptEnabled
          domStorageEnabled
          // automaticallyAdjustContentInsets={true}
          source={{
            uri: uri
          }}
          scalesPageToFit
        />
        {/* </ScrollView> */}
      </View>
    ) : null;
  };

  toggleLive800 = () => {
    if (this.state.productionData && this.state.productionData.live800Info) {
      this.props.navigation.navigate('Web', {
        url: this.state.productionData.live800Info.chatUrl
      });
    }
  };

  renderComment = () => {
    return (
      <View>
        <Text>嘿嘿嘿</Text>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View
        style={{
          // position: 'absolute',
          bottom: 0,
          left: 0,
          // flex: 1,
          flexDirection: 'row',
          // justifyContent: 'center',
          alignItems: 'center',
          height: 50,
          width: '100%',
          backgroundColor: '#fff'
          // justifyContent:'space-between'
        }}
      >
        <TouchableOpacity
          onPress={this.toggleLive800}
          activeOpacity={1}
          style={{
            width: 60,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#eee',
            borderWidth: 1
          }}
        >
          <Image
            resizeMode={'stretch'}
            style={{ height: 20, width: 20 }}
            source={require('../../assets/images/production/icon_service.png')}
          />
          <Text
            style={{
              fontSize: 10,
              marginTop: 5,
              color: '#353535'
            }}
          >
            客服
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            // const resetActionTab = NavigationActions.navigate({
            //   routeName: 'Tab',
            //   action: NavigationActions.navigate({ routeName: 'ShopCar' })
            // });
            // this.props.navigation.dispatch(resetActionTab);
            this.props.navigation.navigate({ routeName: 'ShopCar' });
            // alert('购物车');
          }}
          style={{
            width: 60,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopColor: '#eee',
            borderTopWidth: 1,
            position: 'relative'
          }}
        >
          <Image
            resizeMode={'stretch'}
            style={{ height: 20, width: 20, marginLeft: -5 }}
            source={require('../../assets/images/production/icon_shopping.png')}
          />
          <Text
            style={{
              fontSize: 10,
              marginTop: 5,
              color: '#353535'
            }}
          >
            购物车
          </Text>
          <View
            style={{
              borderRadius: 7.5,
              position: 'absolute',
              width: 15,
              height: 15,
              backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
              top: 2,
              right: 15
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 10
              }}
            >
              7
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: 'pink',
            flex: 1,
            height: '100%',
            flexDirection: 'row'
          }}
        >
          <TouchableOpacity
            style={{
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#e7b32b'
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: '#fff'
              }}
            >
              加入购物车
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#7e4395'
            }}
            activeOpacity={1}
            onPress={() => {
              this.refs.ProductionSltPanel_ref.show();
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: '#fff'
              }}
            >
              立即购买
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderHeaderByAbs = () => {
    return (
      <View
        pointerEvents="box-none"
        style={{
          top: 0,
          // right: 40,
          flexDirection: 'row',
          justifyContent: 'space-between',
          // alignItems:'stretch',
          // justifyContent: 'space-around',
          position: 'absolute',
          // opacity: 0.8,
          // backgroundColor: '#fff',
          // backgroundColor: 'red',
          height: this.state.scrollableTabBarHeight,
          width: '100%'
        }}
      >
        <View
          style={{
            left: 0,
            width: 30,
            justifyContent: 'center',
            alignItems: 'center'
            // backgroundColor: 'pink'
          }}
        >
          <TouchableOpacity
            style={{
              // backgroundColor: 'red',
              width: '100%',
              height: '60%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 18,
              marginLeft: 10
            }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Image
              source={require('../../assets/images/public/icon_goods_arrow_back.png')}
              style={{
                resizeMode: 'stretch',
                height: 20,
                width: 20
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          pointerEvents={'none'}
          style={{
            height: this.state.scrollableTabBarHeight,
            // backgroundColor: 'pink',
            // opacity: 0.5,
            // overflow: 'hidden',
            flex: 1
          }}
        >
          <Animated.View
            // pointerEvents={'none'}
            style={{
              marginTop: this.state.fadeOutCenterViewTop,
              // backgroundColor: 'red',
              backgroundColor: '#fff',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: '#7e4395',
                marginTop: 18
              }}
            >
              图文详情
            </Text>
          </Animated.View>
        </View>
        <View
          style={{
            right: 0,
            width: 30,
            justifyContent: 'center',
            alignItems: 'center'
            // backgroundColor: 'pink'
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              // backgroundColor: 'red',
              width: '100%',
              height: '60%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 18,
              marginRight: 10
            }}
          >
            <Image
              source={require('../../assets/images/production/icon_productedit_more.png')}
              style={{
                resizeMode: 'stretch',
                height: 20,
                width: 20
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          // style={{
          //   display:'none'
          //   // flexDirection: 'column'
          //   // justifyContent: 'center',
          //   // alignItems: 'center',
          //   // backgroundColor: 'red',
          //   // width:'60%'
          // }}
          // prerenderingSiblingsNumber={3}
          prerenderingSiblingsNumber={3}
          tabBarUnderlineStyle={{
            backgroundColor: '#7e4395',
            height: 2
          }}
          tabBarBackgroundColor="white"
          tabBarActiveTextColor="#7e4395"
          tabBarInactiveTextColor="#737373"
          tabBarTextStyle={{
            // letterSpacing: 1,
            fontSize: 14,
            // marginRight: -5,
            // marginLeft: -5,
            marginTop: 20
          }}
          page={this.state.ScrollableTabViewSelectPage}
          onChangeTab={res => {
            this.changHeaderStatus(res.i);
          }}
          renderTabBar={() => (
            <ScrollableTabBar
              style={{
                height: this.state.scrollableTabBarHeight,
                borderWidth: 0,
                display: 'none'
                // flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
                // backgroundColor: 'red'
                // width: '80%'
              }}
              tabsContainerStyle={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
                // backgroundColor: 'red'
              }}
            />
          )}
        >
          <View tabLabel="商品">{this.renderInfo()}</View>
          <View tabLabel="详情">{this.renderWeb()}</View>
          <View tabLabel="评价">{this.renderComment()}</View>
        </ScrollableTabView>
        {this.renderFooter()}
        {/* {this.renderHeaderByAbs()} */}
        {this.state.productionData ? (
          <ProductionSltPanel
            ref="ProductionSltPanel_ref"
            defaultSlt={this.state.productionData.suData.specKey}
            suMap={this.state.productionData.suMap}
            specList={this.state.productionData.specList}
            onChanged={(specSltData, countSlt, suMapKey) => {
              this.setState({
                goPayText: specSltData.suDescription + ' ，' + countSlt,
                goPayPrice: specSltData.price,
                goPayDuration: specSltData.duration
              });
            }}
          />
        ) : null}
        {this.toggleServiceArea()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titles: {
    backgroundColor: '#fff',
    // height: 75,
    // flex:1,
    // marginTop: 10,
    // marginLeft: 10,
    // marginRight: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'column'
    // justifyContent: 'space-between',
  },
  container: {
    flex: 1
    // backgroundColor: 'pink'
  },
  banner: {
    width: screen.width,
    height: screen.width * 0.5
  },
  topContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  buyButton: {
    backgroundColor: '#fc9e28',
    width: 94,
    height: 36,
    borderRadius: 7
  },
  tagContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
  tipHeader: {
    height: 35,
    justifyContent: 'center',
    borderWidth: screen.onePixel,
    borderColor: color.border,
    paddingVertical: 8,
    paddingLeft: 20,
    backgroundColor: 'white'
  }
});

export default ProductionScene;
