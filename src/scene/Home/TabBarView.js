import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ListView, Image, StatusBar, Dimensions } from 'react-native';
import _ from 'lodash';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { color, Button, NavigationItem } from '../../widget';
import { Heading2, Heading3, Paragraph } from '../../widget/Text';
import { screen, system, Http } from '../../common';
import ITENLApi from '../../config/api';
import Swiper from 'react-native-swiper';
import TabBarSubView from './TabBarSubView';
import GroupPurchaseCell from '../GroupPurchase/GroupPurchaseCell';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

type Props = {
  categoryID: number,
  subCategoryList: Array<string>,
  navigation: any,
  onTabBarChange: Function,
  onTabBarChangeObj: Object
};

type State = {
  typeIndex: number,
  data: Array<Object>,
  refreshState: number,
  article_container_height: number,
  article_container_width: number,
  article_container_top_left: WINDOW_WIDTH,
  data_first_index: Object,
  data_first_moredata: Object,
  data_other_moredata: Object
  // onTabBarChangeObj: Object
};

class TabBarView extends PureComponent<Props, State> {
  constructor(props: Object) {
    super(props);
    this.state = {
      typeIndex: 0,
      data: [],
      refreshState: RefreshState.Idle,
      article_container_height: 36,
      article_container_width: WINDOW_WIDTH,
      data_first_index: null, //mock.index.data,
      data_first_moredata: {
        isNext: true, //是否还有下一页
        pageIndex: 1,
        pageSize: 20,
        lovelyList: [], //mock.likeData.data.lovelyList,
        pvId: 'd9d4ec32-1d53-4daf-85a7-d2601d36e81c'
      },
      data_other_moredata: {}
      // onTabBarChangeObj: null
    };
    this.state.article_container_top_left = WINDOW_WIDTH / 2 - this.state.article_container_height / 2;
    if (this.props.categoryID !== '0') {
      this.state[this.props.categoryID] = {
        isload: false,
        crtSubCategoryName: this.props.subCategoryList.length > 0 ? this.props.subCategoryList[0]['categoryName'] : '',
        crtSubCategoryId: this.props.subCategoryList.length > 0 ? this.props.subCategoryList[0]['categoryID'] : '',
        categoryID: this.props.categoryID,
        items: []
      };
    }
    // this.state.onTabBarChangeObj = this.props.onTabBarChangeObj;
  }

  componentDidMount() {
    this.getData_FirstRefresh();
  }

  // componentWillReceiveProps(nextProps) {
  //   let currentTabBarObj = this.state.onTabBarChangeObj;
  //   let nextTabBarObj = nextProps.onTabBarChangeObj;
  //   // this.setState({ someThings: nextProps.someThings });
  // }

  getData_FirstRefresh = () => {
    if (this.props.categoryID === '0') {
      this.getData_ByIndex();
      this.getData_ByLike();
    } else {
      this.getData_ByOther();
    }
  };

  getData_ByOther = () => {
    if (!this.state[this.props.categoryID].isload) {
      Http.POST(ITENLApi.apiplus.home.recommend, {
        data: {
          pageIndex: 1, //this.state.data_first_moredata.pageIndex,
          pageSize: this.state.data_first_moredata.pageSize,
          pvId: this.state.data_first_moredata.pvId
        }
      }).done(res => {
        if (res) {
          let result = res;
          if (result.lovelyList && result.lovelyList.length > 0) {
            let crtCategory = this.state[this.props.categoryID];
            let obj = {
              isload: crtCategory.isload,
              categoryID: crtCategory.categoryID,
              items: crtCategory.items.concat(result.lovelyList),
              crtSubCategoryName: crtCategory.crtSubCategoryName,
              crtSubCategoryId: crtCategory.crtSubCategoryId
            };
            this.setState({
              [this.props.categoryID]: obj //_.cloneDeep(this.state[this.props.categoryID])
            });
          }
          // this.setState({ refreshState: RefreshState.Idle });
        }
      });
    }
  };

  // 获取首页数据
  getData_ByIndex = src => {
    this.setState({ refreshState: RefreshState.HeaderRefreshing });
    Http.POST(ITENLApi.apiplus.home.showV1, {
      data: {
        topicTopN: 3
      }
    }).done(res => {
      if (res) {
        let obj = {
          data_first_index: res,
          refreshState: RefreshState.Idle
        };
        if (obj.data_first_index.article && Object.keys(obj.data_first_index.article).length === 0) {
          obj.data_first_index.article = {
            iconUrl: 'https://raw.githubusercontent.com/itenl/RN_XENL/master/src/assets/images/home/icon_article_bg.png',
            ext: {
              title: '千万别试这几款音乐耳机，耳朵真的会怀孕！'
            }
          };
        }
        if (src === 1) {
          setTimeout(() => {
            this.setState(obj);
          }, 1000);
        } else {
          this.setState(obj);
        }
      }
    });
  };

  // 获取托底数据猜你喜欢
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
            if (result.lovelyList.length < this.state.data_first_moredata.pageSize) {
              result.isNext = false;
            } else {
              result.isNext = true;
            }
            // result.lovelyList = result.lovelyList.concat(
            //   this.state.data_first_moredata.lovelyList
            // );
            // this.setState({
            //   data_first_moredata: result
            // });
            this.setState(preState => {
              // result.lovelyList = preState.data_first_moredata.lovelyList.concat(
              //   result.lovelyList
              // );
              result.lovelyList = [...preState.data_first_moredata.lovelyList, ...result.lovelyList]; // spread syntax method
              return {
                data_first_moredata: result
              };
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

  renderOtherHeader = () => {
    return (
      <View>
        <Text
          onPress={obj => {
            // console.log(obj);
          }}
        >
          sdf for NearbyHeaderView
        </Text>
      </View>
    );
  };

  // 渲染除tabbar首页外的tabbar
  renderOtherCell = (model: any) => {
    let borderColor = model.index % 2 == 0 ? '#efeff4' : '#fff';
    return (
      <View
        style={{
          width: '50%',
          height: 270,
          borderRightColor: borderColor,
          borderRightWidth: 1,
          borderTopColor: '#efeff4',
          borderTopWidth: 1,
          backgroundColor: '#fff'
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            alert(JSON.stringify(model));
          }}
        >
          <Image
            style={{
              height: 187,
              width: '100%',
              resizeMode: 'stretch'
            }}
            source={{
              uri: model.item.img
            }}
          />
          <View style={{ marginLeft: 5, marginRight: 5 }}>
            <Text
              style={{
                backgroundColor: 'rgba(214, 185, 140, .2)',
                // backgroundColor: '#d6b98c',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
                borderBottomRightRadius: 2,
                borderBottomLeftRadius: 2,
                paddingTop: 0,
                paddingLeft: 2,
                paddingRight: 2,
                paddingBottom: 0,
                color: '#BF9E6B',
                fontSize: 12,
                marginTop: 5
              }}
              numberOfLines={1}
            >
              {model.item.point}
            </Text>
            <Text
              style={{
                color: '#666',
                fontSize: 12,
                marginTop: 5
              }}
              numberOfLines={1}
            >
              {model.item.title}
            </Text>
            <Text
              style={{
                color: '#F7A701',
                fontSize: 12,
                marginTop: 5
              }}
            >
              ￥{model.item.price}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderSwiper = () => {
    var imageViews = [],
      imagesSrc = this.state.data_first_index.banners.map((item, index) => {
        return {
          data: item,
          index: index,
          title: item.ext && item.ext.title ? item.ext.title : '',
          uri: item.newImageUrl //.replace(/^http:/, 'https:')
        };
      });
    // imagesSrc.push({
    //   title: '789',
    //   uri: require('../../res/img/ic_rn.jpg')
    // });
    for (var i = 0; i < imagesSrc.length; i++) {
      let item = imagesSrc[i],
        index = i;
      imageViews.push(
        <View key={i} title={<Text numberOfLines={1}>{item.title}</Text>}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (item && item.data && item.data.ext && item.data.ext.suId) {
                this.props.navigation.navigate('Production', {
                  // suId: '1300825002020100001' //model.item.ext.suId
                  suId: item.data.ext.suId
                });
              } else {
                // let s1=global;
                // let s2=s1.showLoading;
                alert(JSON.stringify(item));
                // alert(123)
              }
            }}
          >
            {/* <Text style={styles.text}>{item.title}</Text> */}
            <Image
              resizeMode="stretch"
              style={{ width: '100%', height: 160 }}
              // source={(item.uri.indexOf('http') === 0 || item.uri.indexOf('https') === 0) ? { uri: item.uri} : item.uri}
              source={typeof item.uri === 'number' ? item.uri : { uri: item.uri }}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return imageViews;
  };

  renderFirstHeader = () => {
    return (
      <View>
        {this.state.data_first_index && this.state.data_first_index.banners.length > 0 ? (
          <View style={{ height: 160 }}>
            <Swiper
              loop={true}
              style={
                {
                  // height: 150
                  // flex: 1,
                  // justifyContent: 'flex-end',
                  // flexDirection: 'row'
                }
              }
              paginationStyle={{
                right: 10,
                bottom: 10,
                justifyContent: 'flex-end'
              }}
              dot={
                <View
                  style={{
                    // backgroundColor: 'rgba(0,0,0,.2)',
                    borderWidth: 1.5,
                    borderColor: color.base,
                    borderStyle: 'solid',
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
                    backgroundColor: '#f7b200',
                    width: 8,
                    height: 8,
                    borderRadius: 10,
                    marginLeft: 10
                  }}
                />
              }
              showsButtons={false}
              index={0}
              autoplay={true}
              horizontal={true}
            >
              {this.renderSwiper()}
            </Swiper>
          </View>
        ) : null}
        <View style={styles.guarantee}>
          {this.state.data_first_index && this.state.data_first_index.platformAssurance.length > 0
            ? this.state.data_first_index.platformAssurance.map((item, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Image style={styles.guarantee_img} source={require('../../assets/images/home/icon_design_sale_success.png')} />
                    <Text style={{ color: color.base, fontSize: 14 }}>{item}</Text>
                  </View>
                );
              })
            : null}
        </View>
        {this.state.data_first_index && this.state.data_first_index.article ? (
          <View
            style={{
              position: 'relative',
              width: '100%',
              height: this.state.article_container_height
              // backgroundColor:'pink',
            }}
          >
            <View
              style={{
                position: 'absolute',
                //旋转90度123
                transform: [{ rotate: '90deg' }],
                height: this.state.article_container_width,
                width: this.state.article_container_height,
                marginTop: -this.state.article_container_top_left,
                marginLeft: this.state.article_container_top_left
                // backgroundColor:'#000',
              }}
            >
              <Swiper style={{}} loop={true} showsPagination={false} autoplay>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        {
                          // backgroundColor:"red",
                          height: this.state.article_container_height,
                          width: this.state.article_container_width,
                          marginLeft: -this.state.article_container_top_left,
                          marginTop: this.state.article_container_top_left,
                          transform: [{ rotate: '-90deg' }]
                        },
                        styles.pageStyle
                      ]}
                    >
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          alert(JSON.stringify(this.state.data_first_index.article));
                        }}
                      >
                        <View style={styles.article}>
                          <Image
                            style={{
                              width: 85,
                              height: 20,
                              resizeMode: 'stretch',
                              marginLeft: 5,
                              marginRight: 5
                              // marginTop:5,
                              // marginBottom:5
                            }}
                            // source={require('../../assets/images/home/icon_article_bg.png')}
                            source={{
                              uri: this.state.data_first_index.article.iconUrl
                            }}
                          />
                          <Text numberOfLines={1}>
                            {this.state.data_first_index.article.ext.title}
                            {index}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </Swiper>
            </View>
          </View>
        ) : null}
        {this.state.data_first_index && this.state.data_first_index.operationNavigation.length > 0 ? (
          <View style={styles.operationNavigation}>
            {this.state.data_first_index.operationNavigation.map((item, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={1}
                  onPress={() => {
                    alert(JSON.stringify(item));
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Image
                      style={{
                        width: 24,
                        height: 24,
                        resizeMode: 'stretch'
                      }}
                      source={{
                        uri: item.imageUrl
                      }}
                    />
                    <Text style={{ marginTop: 10 }}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
        <View style={styles.specialList}>
          <Text
            style={{
              textAlign: 'center',
              color: '#4A4A4A',
              marginTop: 10,
              marginBottom: 10
            }}
          >
            精选专题
          </Text>
          {this.state.data_first_index && this.state.data_first_index.specialList && this.state.data_first_index.specialList.length > 0
            ? this.state.data_first_index.specialList.map((item, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={1}
                    onPress={() => {
                      alert(JSON.stringify(item));
                    }}
                  >
                    <View style={{ marginBottom: 15 }}>
                      <Image
                        style={{
                          height: 210,
                          resizeMode: 'stretch'
                        }}
                        source={{
                          uri: item.img
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                          marginBottom: 10
                        }}
                      >
                        <Text style={{ marginLeft: 10 }}>{item.title}</Text>
                        <Text style={{ marginRight: 10, color: '#F7A701' }}>
                          {item.price}
                          元起
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 10,
                          marginLeft: 10,
                          marginTop: -5
                        }}
                      >
                        {item.subTitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            : null}
        </View>
        <View style={styles.like}>
          <Text
            style={{
              textAlign: 'center',
              color: '#4A4A4A',
              marginTop: 10,
              marginBottom: 10
            }}
          >
            猜你喜欢
          </Text>
        </View>
      </View>
    );
  };

  renderLikeDataCell = (model: Object) => {
    let borderColor = model.index % 2 == 0 ? '#efeff4' : '#fff';
    return (
      <View
        style={{
          width: '50%',
          height: 270,
          borderRightColor: borderColor,
          borderRightWidth: 1,
          borderTopColor: '#efeff4',
          borderTopWidth: 1,
          backgroundColor: '#fff'
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.props.navigation.navigate('Production', {
              // suId: '1300825002020100001' //model.item.ext.suId
              suId: model.item.suId
            });
            // alert(JSON.stringify(model.item.ext.suId));
          }}
        >
          <Image
            style={{
              height: 187,
              width: '100%',
              resizeMode: 'stretch'
            }}
            source={{
              uri: model.item.img
            }}
          />
          <View style={{ marginLeft: 5, marginRight: 5 }}>
            <Text
              style={{
                backgroundColor: 'rgba(214, 185, 140, .2)',
                // backgroundColor: '#d6b98c',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
                borderBottomRightRadius: 2,
                borderBottomLeftRadius: 2,
                paddingTop: 0,
                paddingLeft: 2,
                paddingRight: 2,
                paddingBottom: 0,
                color: '#BF9E6B',
                fontSize: 12,
                marginTop: 5
              }}
              numberOfLines={1}
            >
              {model.item.point}
            </Text>
            <Text
              style={{
                color: '#666',
                fontSize: 12,
                marginTop: 5
              }}
              numberOfLines={1}
            >
              {model.item.title}
            </Text>
            <Text
              style={{
                color: '#F7A701',
                fontSize: 12,
                marginTop: 5
              }}
            >
              ￥{model.item.price}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    if (this.props.categoryID === '0') {
      return (
        <RefreshListView
          // style={{ backgroundColor: '#fff' }}
          data={this.state.data_first_moredata.lovelyList}
          ListHeaderComponent={this.renderFirstHeader}
          numColumns={2}
          renderItem={this.renderLikeDataCell}
          keyExtractor={(item, index) => index.toString()}
          refreshState={this.state.refreshState}
          onHeaderRefresh={() => {
            this.getData_ByIndex(1);
          }}
          onFooterRefresh={() => {
            this.getData_ByLike();
          }}
          footerRefreshingText={'加载中...'}
        />
      );
    } else {
      return (
        <RefreshListView
          data={this.state[this.props.categoryID].items}
          ListHeaderComponent={
            <TabBarSubView
              items={this.props.subCategoryList}
              itemKey={'categoryName'}
              itemValue={'categoryID'}
              selectedIndex={this.state.typeIndex}
              onSelected={(item, index) => {
                if (index != this.state.typeIndex) {
                  this.setState({ typeIndex: index });
                }
              }}
              extView={
                <View
                  style={{
                    // borderTopWidth: 1,
                    // borderTopColor: '#ccc',
                    height: 43,
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ textAlign: 'center', color: '#808080' }}>{this.state[this.props.categoryID].crtSubCategoryName}</Text>
                </View>
              }
            />
          }
          numColumns={2}
          renderItem={this.renderOtherCell}
          // keyExtractor={(item, index) => index}
          keyExtractor={(item, index) => index.toString()}
          // refreshState={this.state.refreshState}
          // onHeaderRefresh={this.requestFirstPage}
          // onFooterRefresh={this.requestNextPage}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  guarantee: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: '#cccccc',
    // borderBottomStyle: 'solid',
    borderBottomWidth: 0.8,
    // paddingLeft: 5,
    // paddingTop: 5,
    height: 36
  },
  guarantee_img: {
    width: 15,
    height: 15,
    // marginTop: 2.5,
    marginRight: 2.5
  },
  article: {
    flexDirection: 'row',
    // justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 0.8,
    // padding:2,
    // borderBottom: 1px solid #F4F4F4,
    height: 36
  },
  operationNavigation: {
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  },
  specialList: {
    marginTop: 10,
    backgroundColor: '#fff',
    flexDirection: 'column'
    // textAlign:'center'
    // alignItems:'center',
  },
  like: {
    marginTop: 10,
    backgroundColor: '#fff',
    flexDirection: 'column'
  },
  pageStyle: {
    // height:100,
    // width:100,
    //旋转-90度
    // transform:[{rotate: "-90deg"}]
    // transform:[{rotate: "0deg"}]
  }
});

export default TabBarView;
