import React, { PureComponent } from 'react';
import {
  Text,
  View,
  Image,
  Button,
  Alert,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import CodePush from 'react-native-code-push';

let codePushOptions = {
  //设置检查更新的频率
  //ON_APP_RESUME APP恢复到前台的时候
  //ON_APP_START APP开启的时候
  //MANUAL 手动检查
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME
};

class UpdateScene extends PureComponent<Props, State> {
  // static navigationOptions = {
  //   tabBarLabel: '我的',
  //   headerStyle: {
  //     height: 0 //去掉标题
  //   },
  //   tabBarIcon: (
  //     <Image
  //       style={{ height: 30, width: 30 }}
  //       source={require('../../res/img/ic_rn.jpg')}
  //     />
  //   )
  // };
  constructor() {
    super(...arguments);

    this.state = {
      deployKey:
        'DAfCc_m1RZUw-31L8UTPynPJx7Auae7d8412-76d8-410b-98bc-4864a423409f',
      hasCheckUpdate: false,
      remotePackage: null,
      hasGetLocalPackage: false,
      localPackage: null,
      hasDownloadedPackage: false,
      downloadPackage: null,
      timeOut: 10,
      timer: null
    };
  }

  componentWillMount() {
    CodePush.sync({
      //安装模式
      //ON_NEXT_RESUME 下次恢复到前台时
      //ON_NEXT_RESTART 下一次重启时
      //IMMEDIATE 马上更新
      installMode: CodePush.InstallMode.IMMEDIATE
    });
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Text>进入此页面会进行静默更新</Text>
      </View>
    );
  }
}

export default UpdateScene;
// export default CodePush(codePushOptions)(UpdateScene);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
