import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Easing,
  Animated,
  ScrollView
} from 'react-native';
import { Heading2, Heading3, Paragraph } from '../../widget/Text';
import { screen, system } from '../../common';
import Utils from '../../common/Utils';
import { color } from '../../widget';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

type Props = {
  defaultSlt: String,
  suMap: Array<Object>,
  specList: Array<Object>,
  onChanged: Function
};

type State = {
  goPayAreaBottomAnimated: number,
  goPayAreaMaskOpacityAnimated: number,
  countSlt: number,
  specSltData: String,
  durationSlt: number,
  priceSlt: number,
  imageSlt: String,
  textSlt: String
};

class ProductionSltPanel extends PureComponent<Props, State> {
  constructor(props: Object) {
    super(props);
    this.state = {
      goPayAreaBottomAnimated: new Animated.Value(-WINDOW_HEIGHT),
      goPayAreaMaskOpacityAnimated: new Animated.Value(0),
      countSlt: 1,
      specSltData: this.props.defaultSlt
    };
    this.show = () => {
      Animated.sequence([
        Animated.timing(this.state.goPayAreaBottomAnimated, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad)
        })
      ]).start(() => {
        Animated.timing(this.state.goPayAreaMaskOpacityAnimated, {
          toValue: 0.4,
          duration: 300,
          easing: Easing.out(Easing.quad)
        }).start();
        // this.state.goPayAreaMaskOpacityAnimated.setValue(0.4);
      });
    };
    this.hide = () => {
      Animated.timing(this.state.goPayAreaMaskOpacityAnimated, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.quad)
      }).start(() => {
        Animated.timing(this.state.goPayAreaBottomAnimated, {
          toValue: -WINDOW_HEIGHT,
          duration: 300,
          easing: Easing.out(Easing.quad)
        }).start();
      });
    };

    if (!this.props.specList) {
      console.warn('ProductionSltPanel 缺少 specList');
      return;
    }
  }

  // static defaultProps = {
  //   onChanged: () => {}
  // };

  componentDidMount() {
    this.onChangeSlt(this.state.specSltData);
  }

  onChangeSlt(specSltData) {
    if (specSltData && this.props.suMap) {
      let allPermute = Utils.getArrayPermuteByAll(specSltData.split(','));
      let sltData = null;
      for (let i = 0; i < allPermute.length; i++) {
        let item = allPermute[i];
        if (item) {
          let suKey = item.join(',');
          sltData = this.props.suMap[suKey];
          if (sltData) {
            this.setState({
              durationSlt: sltData.duration,
              priceSlt: sltData.price,
              textSlt: sltData.suDescription,
              imageSlt: sltData.imageUrl,
              specSltData: specSltData
            });
            this.props.onChanged(sltData, this.state.countSlt, specSltData);
            return;
          }
        }
      }
    }
  }

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          // backgroundColor: 'rgba(0,0,0,.4)',
          bottom: this.state.goPayAreaBottomAnimated
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            backgroundColor: '#000',
            opacity: this.state.goPayAreaMaskOpacityAnimated,
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
              this.hide();
            }}
            activeOpacity={1}
          />
        </Animated.View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            height: 450,
            width: '100%',
            backgroundColor: '#fff',
            paddingLeft: 10,
            paddingRight: 10
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: '#eee',
              borderBottomWidth: 1,
              paddingBottom: 10
              // paddingLeft: 107
            }}
          >
            <View
              style={{
                height: 107,
                width: 107,
                borderColor: '#ccc',
                backgroundColor: '#fff',
                borderWidth: 1,
                marginTop: -12
              }}
              // resizeMode={'stretch'}
              // source={{
              //   uri: this.state.imageSlt
              // }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 10,
                paddingLeft: 10,
                flex: 1
              }}
            >
              <View>
                <Text style={{ color: '#f33', fontSize: 16 }}>
                  ￥{this.state.priceSlt}
                </Text>
                <Text style={{ color: 'gray', fontSize: 12, marginTop: 10 }}>
                  生产周期：{this.state.durationSlt}天
                </Text>
                {/* numberOfLines={1} */} 
                <Text style={{ color: 'gray', fontSize: 12, marginTop: 10 }}>
                  已选择：<Text style={{ color: '#333' }}>
                    {this.state.textSlt}， {this.state.countSlt}件
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.hide();
                }}
                activeOpacity={1}
                style={{
                  height: 30,
                  position: 'absolute',
                  right: 0,
                  top: 5,
                  width: 30,                  
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image
                  style={{ height: 15, width: 15 }}
                  source={require('../../assets/images/production/icon_goods_detail_close.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{}}>
            <View
              style={{
                borderBottomColor: '#eee',
                borderBottomWidth: 1,
                paddingBottom: 20
              }}
            >
              {this.props.specList &&
                this.props.specList.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{ marginTop: 15, flexDirection: 'column' }}
                    >
                      <Text>{item.specTypeName}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          flex: 1,
                          flexWrap: 'wrap'
                        }}
                      >
                        {item.detailList &&
                          item.detailList.map((childItem, childIndex) => {
                            return (
                              <TouchableOpacity
                                key={childIndex}
                                activeOpacity={1}
                                onPress={() => {
                                  let preSltData = this.state.specSltData,
                                    crtSltSpecID = childItem.specID,
                                    preSltDataArr = preSltData.split(','),
                                    preSltDataIndex = preSltDataArr.indexOf(
                                      crtSltSpecID
                                    );
                                  if (preSltDataIndex < 0) {
                                    let specSltData = preSltData.replace(
                                      preSltDataArr[index],
                                      crtSltSpecID
                                    );
                                    this.onChangeSlt(specSltData);
                                    // alert(
                                    //   JSON.stringify(this.state.specSltData)
                                    // );
                                  }
                                }}
                                style={[
                                  styles.specBtn_view,
                                  this.state.specSltData
                                    .split(',')
                                    .indexOf(childItem.specID) > -1
                                    ? styles.specBtn_view_slt
                                    : null
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.specBtn_text,
                                    this.state.specSltData
                                      .split(',')
                                      .indexOf(childItem.specID) > -1
                                      ? styles.specBtn_text_slt
                                      : null
                                  ]}
                                >
                                  {childItem.specName}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </View>
                  );
                })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 15,
                paddingBottom: 100
              }}
            >
              <Text>购买数量</Text>
              <View style={styles.count_container}>
                <TouchableOpacity
                  style={[
                    styles.count_left,
                    this.state.countSlt <= 1 ? styles.countMaxOrMin_Left : null
                  ]}
                  activeOpacity={1}
                  onPress={() => {
                    if (this.state.countSlt <= 1) {
                      return;
                    } else {
                      this.setState({
                        countSlt: this.state.countSlt - 1
                      });
                    }
                  }}
                >
                  <View
                    style={[
                      styles.count_left_inner,
                      this.state.countSlt <= 1
                        ? styles.countMaxOrMin_inner
                        : null
                    ]}
                  />
                </TouchableOpacity>
                <View style={styles.count_center}>
                  <Text>{this.state.countSlt}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.count_right,
                    this.state.countSlt >= 99
                      ? styles.countMaxOrMin_Right
                      : null
                  ]}
                  activeOpacity={1}
                  onPress={() => {
                    if (this.state.countSlt >= 99) {
                      alert('貌似最多只能选99吧~~~');
                    } else {
                      this.setState({
                        countSlt: this.state.countSlt + 1
                      });
                    }
                  }}
                >
                  <View
                    style={[
                      styles.count_right_inner_heng,
                      this.state.countSlt >= 99
                        ? styles.countMaxOrMin_inner
                        : null
                    ]}
                  />
                  <View
                    style={[
                      styles.count_right_inner_shu,
                      this.state.countSlt >= 99
                        ? styles.countMaxOrMin_inner
                        : null
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        <Image
          style={{
            position: 'absolute',
            bottom: 450 - 107 + 12,
            left: 10,
            height: 107,
            width: 107,
            borderColor: '#ccc',
            backgroundColor: '#fff',
            borderWidth: 1
            // marginTop: -12
          }}
          resizeMode={'stretch'}
          source={{
            uri: this.state.imageSlt
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 50,
            // backgroundColor: 'pink',
            width: '100%'
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              borderTopColor: '#eee',
              borderTopWidth: 1,
              backgroundColor: '#fff',
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'gray' }}>加入购物车</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: '#7e4395',
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff' }}>立即购买</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  count_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  count_left_inner: {
    height: 1,
    width: '70%',
    backgroundColor: '#353535'
    // backgroundColor: '#F4F4F4'
  },
  count_left: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    height: 36,
    width: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#505050',
    borderTopWidth: 1,
    borderTopColor: '#505050',
    borderLeftWidth: 1,
    borderLeftColor: '#505050',
    // backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  count_center: {
    height: 36,
    width: 46,
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#505050',
    // borderTopWidth: 1,
    // borderTopColor: '#505050',
    borderWidth: 1,
    borderColor: '#505050',
    justifyContent: 'center',
    alignItems: 'center'
  },
  count_right: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    height: 36,
    width: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#505050',
    borderTopWidth: 1,
    borderTopColor: '#505050',
    borderRightWidth: 1,
    borderRightColor: '#505050',
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  count_right_inner_heng: {
    height: 1,
    width: '70%',
    backgroundColor: '#353535',
    position: 'absolute',
    left: '15%'
  },
  count_right_inner_shu: {
    height: '70%',
    width: 1,
    backgroundColor: '#353535'
  },
  countMaxOrMin_Left: {
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
    borderTopWidth: 1,
    borderTopColor: '#dadada',
    borderLeftWidth: 1,
    borderLeftColor: '#dadada'
  },
  countMaxOrMin_Right: {
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
    borderTopWidth: 1,
    borderTopColor: '#dadada',
    borderRightWidth: 1,
    borderRightColor: '#dadada'
  },
  countMaxOrMin_inner: {
    backgroundColor: '#dadada'
  },
  specBtn_view: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    height: 36,
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 15,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  specBtn_text: {
    color: '#333',
    fontSize: 13
  },
  specBtn_view_slt: {
    backgroundColor: '#7f4395'
  },
  specBtn_text_slt: {
    color: '#fff'
  }
});

export default ProductionSltPanel;
