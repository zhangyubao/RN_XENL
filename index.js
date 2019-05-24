import React, { PureComponent } from 'react';
import { AppRegistry, YellowBox, View ,Alert} from 'react-native';
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Task orphaned for request',
  'Class RCTCxxModule was not exported. Did you forget to use RCT_EXPORT_MODULE',
  'Remote debugger is in a background tab which may cause apps to perform slowly'
  // 'Debugger and device times had drifted by more than 60s. Please correct this by running adb shell'
]);

import RootScene from './src/RootScene';
import Loading from './src/widget/Loading';

let self; //将App组件中的this赋给全局的self
global.showLoading = false; //所有子页面均可直接调用global.showLoading()来展示Loading
global.closeLoading = false; //所有子页面均可直接调用global.closeLoading()来关闭Loading

export default class App extends PureComponent<{}> {
  componentDidMount() {
    self = this;
    global.showLoading = function() {
      self.Loading.show();
    };
    global.closeLoading = function() {
      self.Loading.close();
    };
  }

  render() {
    return (
      <RootScene>
        <Loading ref={r => (this.Loading = r)} hide={true} />
      </RootScene>
    );
  }
}

require('ErrorUtils').setGlobalHandler(function (err) {
  Alert.alert("页面走丢了！！！，即将返回上一页")
});

AppRegistry.registerComponent('RN_XENL', () => App);
