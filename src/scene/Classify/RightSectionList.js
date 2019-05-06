import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, SectionList, Dimensions, DeviceEventEmitter, TouchableOpacity, ScrollView } from 'react-native';
import { screen, system, Http } from '../../common';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
const { width, height } = Dimensions.get('window');
const SEPARATOR_HEIGHT = 0; //分割线的高度
const HEADER_HEIGHT = 180; //分组头部的高度
const FOOTER_HEIGHT = 50; //分组头部的高度
const ITEM_HEIGHT = 100; //item的高度
const SINGLE_ITEM_HEIGHT = 100; //item的高度
const SINGLE_SUBCATEGORY_TITLE = 40; //单类目类型title

//var sectionData = []
export default class RightSectionList extends Component {
  // 构造
  constructor(props) {
    super(props);
    //sectionData = this.props.data
    this.fromFlat = false;
    this.classifyTreeIndex = 0;
    this.getItemLayout = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex, rowIndex) => {
        if (rowData && rowData.subCategoryList && rowData.subCategoryList.length > 0) {
          return SINGLE_ITEM_HEIGHT * Math.ceil(rowData.subCategoryList.length / 3) + SINGLE_SUBCATEGORY_TITLE;
          // 单个item高度 * 当前分类子类目数量/3（每行数量）+ 每个子类目标题高度
        } else {
          return 50;
        }
      },

      // These four properties are optional
      getSeparatorHeight: () => SEPARATOR_HEIGHT, //1 / PixelRatio.get(), // The height of your separators
      getSectionHeaderHeight: () => HEADER_HEIGHT, // The height of your section headers
      getSectionFooterHeight: () => FOOTER_HEIGHT, // The height of your section footers
      listHeaderHeight: 0 // The height of your list header
    });

    this.state = {
      //sectionData:sectionData
    };
  }
  //行
  renderItem = rowData => {
    return (
      <View
        style={{
          // height: 100,
          // backgroundColor: 'pink',
          // flex:1,
          flexDirection: 'column',
          //   justifyContent: 'center',
          //   alignItems: 'center',
          paddingLeft: 25,
          paddingRight: 25
        }}
      >
        <View
          style={{
            height: SINGLE_SUBCATEGORY_TITLE,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: '25%',
            paddingRight: '25%',
            // backgroundColor: 'red',
            paddingBottom: 20,
            paddingTop: 20
          }}
        >
          <View style={{ height: 1, flex: 1, backgroundColor: '#eee' }} />
          <Text
            style={{
              marginLeft: 10,
              marginRight: 10,
              fontSize: 12,
              lineHeight: SINGLE_SUBCATEGORY_TITLE,
              height: SINGLE_SUBCATEGORY_TITLE,
              color: '#333'
            }}
          >
            {rowData.item.categoryName}
          </Text>
          <View style={{ height: 1, flex: 1, backgroundColor: '#eee' }} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap'
            // backgroundColor: 'pink'
          }}
        >
          {rowData.item.subCategoryList
            ? rowData.item.subCategoryList.map((subItem, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      // backgroundColor: 'red',
                      height: SINGLE_ITEM_HEIGHT,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '33.3%'
                      // marginTop: 20,
                      // marginBottom: 20
                    }}
                    activeOpacity={1}
                    onPress={() => {
                      // this.refs.sectionList.scrollToLocation({
                      //     sectionIndex: 9,
                      //     itemIndex: 9,
                      //     viewOffset: -50
                      //     //viewOffset: 30,
                      //   });
                      alert(JSON.stringify(subItem));
                    }}
                  >
                    <Image
                      style={{
                        height: 64,
                        width: 64,
                        resizeMode: 'stretch',
                        borderRadius: 10
                      }}
                      source={{ uri: subItem.imageUrl }}
                      // source={require('../../assets/images/public/icon_logo.png')}
                    />
                    <Text style={{ marginTop: 10, fontSize: 12 }}>{subItem.categoryName}</Text>
                  </TouchableOpacity>
                );
              })
            : null}
        </View>
      </View>
    );
  };
  //头
  renderHeaderComp = rowData => {
    // if (
    //   !rowData.section ||
    //   !rowData.section.categoryImage ||
    //   !rowData.section.categoryImage.imageUrl
    // )
    //   return null;
    return (
      <View
        style={[
          {
            // borderColor: 'red',
            // borderWidth: 3,
            height: HEADER_HEIGHT
          },
          !system.isIOS && rowData.section.classifyTreeIndex != '0'
            ? {
                // marginTop: 50
              }
            : {}
        ]}
      >
        <View
          style={{
            // height: 30,
            backgroundColor: '#f7f7f7',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#7f4395',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius: 3
            // borderTopLeftRadius: 8,
            // borderTopRightRadius: 8
          }}
        >
          {/* {rowData.section.categoryImage &&
          rowData.section.categoryImage.imageUrl ? ( */}
          <Image
            style={{
              // paddingLeft: 50,
              // paddingRight: 50,
              marginTop: 5,
              height: 150,
              width: '95%',
              resizeMode: 'stretch'
            }}
            source={{
              uri: rowData.section.categoryImage.imageUrl
            }}
          />
          {/* ) : null} */}
          <Text style={{ fontSize: 15 }}>
            {/* {rowData.section.categoryName + rowData.section.classifyTreeIndex}{' '} */}【 {rowData.section.categoryName} 】
          </Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <SectionList
        ref="sectionList"
        style={{
          width: '100%',
          backgroundColor: '#fff',
          // padding: 5,
          paddingLeft: 5,
          paddingRight: 5
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={this.keyExtractor}
        // keyExtractor={()=>{alert(JSON.stringify(arguments))}}
        renderSectionHeader={section => this.renderHeaderComp(section)} //头
        renderSectionFooter={() => {
          return (
            <View
              style={{
                height: FOOTER_HEIGHT,
                // backgroundColor: 'yellow',
                width: '100%'
              }}
            >
              {/* <Text>Footer</Text> */}
            </View>
          );
        }} //脚
        renderItem={item => this.renderItem(item)} //行
        // ItemSeparatorComponent={(a,b,c) => {
        //   return <View style={{ height: 1, backgroundColor: 'black' }} />;
        // }} //分隔线
        sections={this.props.data} //数据
        onViewableItemsChanged={info => this.itemChange(info)} //滑动时调用
        viewabilityconfig={{
          viewAreaCoveragePercentThreshold: 50,
          minimumViewTime: 0
        }}
        getItemLayout={this.getItemLayout}
        // getItemLayout={(data, index) => {
        //   let [length, separator, header] = [
        //     ITEM_HEIGHT,
        //     SEPARATOR_HEIGHT,
        //     HEADER_HEIGHT
        //   ];
        //   let result= {
        //     length,
        //     offset: (length + separator) * index + header,
        //     index
        //   };
        //   console.log(result)
        //   return result;
        // }}
      />
    );
  }
  //使用json中的title动态绑定key
  keyExtractor(item: Object, index: number) {
    return item.categoryId;
  }

  componentDidMount() {
    //收到监听
    this.listener = DeviceEventEmitter.addListener('left', args => {
      this.fromFlat = args.fromFlat;
      this.classifyTreeIndex = args.index;
      // console.log(e + 1) // 左边点击了第几行
      // console.log(sectionData) // 数据源
      // console.log(sectionData[e])
      // console.log(sectionData[e].data.length)
      // SectionList实现scrollToIndex需要修改VirtualizedSectionList和SectionList源码
      if (args && args.index >= 0) {
        //计算出前面有几行
        //var count = 0
        // for(var i = 0; i < e; i++){
        //     count += this.props.data[i].data.length +1
        // }
        // let sd=this.refs.sectionList;
        // this.sectionList.scrollToLocation({
        //     sectionIndex: 2,
        //     itemIndex: 2,
        //   viewOffset: 30,
        //   })
        // console.log('Right-componentDidMount:' + args.index);
        try {
          this.refs.sectionList.scrollToLocation({
            // animated: true,
            sectionIndex: args.index,
            itemIndex: 0,
            viewPosition: 0,
            viewOffset: HEADER_HEIGHT
            // viewOffset: 180
          });
        } catch (err) {
          console.error(err);
        }
        // this.refs.sectionList.scrollToLocation({animated: true, sectionIndex: count})
        // this.refs.sectionList.scrollToLocation({animated: true, index: count})
      } else {
        // console.log('Right-componentDidMount-else:' + args.index);
        this.refs.sectionList.scrollToLocation({ animated: true, index: 0 }); //如果左边点击第一行,右边则回到第一行
      }
    });
  }

  componentWillUnmount() {
    // 移除监听
    this.listener.remove();
  }

  itemChange = info => {
    if (
      info &&
      info.viewableItems &&
      info.viewableItems[0]
      // &&      info.viewableItems[0].index
    ) {
      // console.log(info);
      let classifyTreeIndex = info.viewableItems[0].item.classifyTreeIndex;
      var reg = new RegExp('^[0-9]*$');
      if (reg.test(classifyTreeIndex)) {
        classifyTreeIndex = parseInt(classifyTreeIndex);
        // console.log('Right-itemChange-Prev-fromFlat:' + this.fromFlat);
        if (this.fromFlat) {
          // 等于左侧点击
          if (this.classifyTreeIndex === classifyTreeIndex) {
            // 等于左侧点击并且 左侧序号等于当前传入序号 等于非点击
            this.fromFlat = false;
          } else {
            return;
          }
        } else {
          // console.log('Right-itemChange:' + classifyTreeIndex + this.fromFlat);
          DeviceEventEmitter.emit('right', classifyTreeIndex); //发监听
        }
      }
    }
  };
}
