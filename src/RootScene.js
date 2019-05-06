import React, { PureComponent } from 'react';
import { StatusBar } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';

import color from './widget/Color';
import { screen, system } from './common';
import TabBarItem from './widget/TabBarItem';

import HomeScene from './scene/Home/HomeScene';
import TestScene from './scene/Home/TestScene';
import ShopCarScene from './scene/ShopCar/ShopCarScene';
import MineScene from './scene/Mine/MineScene';
import UpdateScene from './scene/Mine/UpdateScene';
import UpdateSilentScene from './scene/Mine/UpdateSilentScene';
import LoginScene from './scene/Login/LoginScene';
import ClassifyScene from './scene/Classify/ClassifyScene';
import WebScene from './widget/WebScene';
import GroupPurchaseScene from './scene/GroupPurchase/GroupPurchaseScene';
import ProductionScene from './scene/Production/ProductionScene';

const lightContentScenes = ['Mine'];

function getCurrentRouteName(navigationState: any) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

class RootScene extends PureComponent<{}> {
  constructor() {
    super();

    StatusBar.setBarStyle('dark-content');
  }

  render() {
    return (
      <RootStack
        onNavigationStateChange={(prevState, currentState) => {
          const currentScene = getCurrentRouteName(currentState);
          const previousScene = getCurrentRouteName(prevState);
          if (previousScene !== currentScene) {
            if (lightContentScenes.indexOf(currentScene) >= 0) {
              StatusBar.setBarStyle('light-content');
            } else {
              StatusBar.setBarStyle('dark-content');
            }
          }
        }}
      />
    );
  }
}

const TabScene = TabNavigator(
  {
    Home: {
      screen: HomeScene,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: '首页',
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            // tintColor={tintColor}
            focused={focused}
            normalImage={require('./assets/images/tabbar/icon_tabbar_home.png')}
            selectedImage={require('./assets/images/tabbar/icon_tabbar_home_sel.png')}
          />
        )
      })
    },
    Classify: {
      screen: ClassifyScene,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: '分类',
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            // tintColor={tintColor}
            focused={focused}
            normalImage={require('./assets/images/tabbar/icon_tabbar_class.png')}
            selectedImage={require('./assets/images/tabbar/icon_tabbar_class_sel.png')}
          />
        )
      })
    },
    ShopCar: {
      screen: ShopCarScene,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: '购物车',
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            // tintColor={tintColor}
            focused={focused}
            normalImage={require('./assets/images/tabbar/icon_tabbar_shopping.png')}
            selectedImage={require('./assets/images/tabbar/icon_tabbar_shopping_sel.png')}
          />
        )
      })
    },
    Mine: {
      screen: MineScene,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: '我的',
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            // tintColor={tintColor}
            focused={focused}
            normalImage={require('./assets/images/tabbar/icon_tabbar_mine.png')}
            selectedImage={require('./assets/images/tabbar/icon_tabbar_mine_sel.png')}
          />
        )
      })
    }
    // Update: {
    //   screen: UpdateScene,
    //   navigationOptions: ({ navigation }) => ({
    //     tabBarLabel: '更新',
    //     tabBarIcon: ({ focused, tintColor }) => (
    //       <TabBarItem
    //         // tintColor={tintColor}
    //         focused={focused}
    //         normalImage={require('./assets/images/tabbar/icon_tabbar_mine.png')}
    //         selectedImage={require('./assets/images/tabbar/icon_tabbar_mine_sel.png')}
    //       />
    //     )
    //   })
    // }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    lazy: false,
    animationEnabled: false, //切换动画， 建议关闭
    swipeEnabled: false,
    tabBarOptions: {
      // tabStyle: { backgroundColor: 'red', width: 80, height: 80 },
      activeTintColor: color.base,
      inactiveTintColor: '#808080',
      style: {
        backgroundColor: '#ffffff'
      }
    }
  }
);

const MainNavigator = StackNavigator(
  {
    Tab: { screen: TabScene },
    Web: { screen: WebScene },
    Production: { screen: ProductionScene },
    GroupPurchase: { screen: GroupPurchaseScene },
    Test: { screen: TestScene }
  },
  {
    // initialRouteName:'Production',
    navigationOptions: {
      // headerStyle: { backgroundColor: color.base },
      headerBackTitle: null,
      headerTintColor: '#333333',
      showIcon: true
    },
    // mode: 'card', // 普通app常用的左右切换
    headerMode: 'none' // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    // onTransitionStart: () => {
    //   console.log('导航栏切换开始');
    // }, // 回调
    // onTransitionEnd: () => {
    //   console.log('导航栏切换结束');
    // } // 回调
  }
);

const RootStack = StackNavigator(
  {
    Main: { screen: MainNavigator },
    Login: { screen: LoginScene },
    Update: { screen: UpdateScene },
    UpdateSilent: { screen: UpdateSilentScene }
  },
  {
    // initialRouteName:'Update',
    mode: 'modal',
    headerMode: 'screen'
  }
);

export default RootScene;
