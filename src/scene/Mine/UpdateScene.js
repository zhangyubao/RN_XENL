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
import { color, DetailCell, NavigationItem, SpacingView } from '../../widget';

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
    // CodePush.disallowRestart(); //页面加载的禁止重启,在加载完了可以允许重启
    //this.syncImmediate(); //开始检查更新
  }

  componentDidMount() {
    CodePush.getCurrentPackage()
      .then(localPackage => {
        if (localPackage) {
          this.setState({
            localPackage: localPackage
          });
        } else {
          this.setState({
            localPackage: {
              text: '暂无相关本地包信息'
            }
          });
        }
      })
      .catch(error => {
        console.log('get current package error');
      });
    // CodePush.allowRestart(); //在加载完了，允许重启
    // Alert.alert('开始检查更新了哈', '嘻嘻嘻~~~~~~');
    // let timer = setInterval(() => {
    //   if (this.state.timeOut <= 0) {
    //     CodePush.sync();
    //     clearInterval(this.state.timer);
    //   }
    //   this.setState({
    //     timeOut: this.state.timeOut - 1
    //   });
    // }, 1000);
    // this.setState({
    //   timer: timer
    // });
    // CodePush.notifyAppReady();
  }

  //如果有更新的提示
  syncImmediate() {
    CodePush.sync({
      //安装模式
      //ON_NEXT_RESUME 下次恢复到前台时
      //ON_NEXT_RESTART 下一次重启时
      //IMMEDIATE 马上更新
      installMode: CodePush.InstallMode.IMMEDIATE,
      //对话框
      updateDialog: {
        //是否显示更新描述
        appendReleaseDescription: true,
        //更新描述的前缀。 默认为"Description"
        descriptionPrefix: '更新内容：\n',
        //强制更新按钮文字，默认为continue
        mandatoryContinueButtonLabel: '立即更新',
        //强制更新时的信息. 默认为"An update is available that must be installed."
        mandatoryUpdateMessage: '必须更新后才能使用',
        //非强制更新时，按钮文字,默认为"ignore"
        optionalIgnoreButtonLabel: '稍后',
        //非强制更新时，确认按钮文字. 默认为"Install"
        optionalInstallButtonLabel: '后台更新',
        //非强制更新时，检查到更新的消息文本
        optionalUpdateMessage: '有新版本了，是否更新？',
        //Alert窗口的标题
        title: '更新提示'
      }
    });
  }

  //onUpdataHandler() {
  //  this.syncImmediate();
  //CodePush.sync();
  // Alert.alert(
  //   '开始检查更新了哈',
  //   '嘻嘻嘻~~~~~~',
  //   [
  //     {
  //       text: '你干嘛？',
  //       onPress: () => ToastAndroid.show('wait', ToastAndroid.SHORT)
  //     },
  //     {
  //       text: '取消',
  //       onPress: () => ToastAndroid.show('Cancel', ToastAndroid.SHORT),
  //       style: 'cancel'
  //     },
  //     {
  //       text: '好的',
  //       onPress: () => ToastAndroid.show('OK', ToastAndroid.SHORT)
  //     }
  //   ],
  //   {
  //     cancelable: true,
  //     onDismiss: () => {
  //       ToastAndroid.show('点击了外面', ToastAndroid.SHORT);
  //     }
  //   }
  // );
  //}

  //存在版本差异
  // _handleBinaryVersionMismatchCallback = update => {
  //   CodePush.getCurrentPackage()
  //     .then(localPackage => {
  //       console.log('localPackage:');
  //       console.log(localPackage);
  //       console.log('update:');
  //       console.log(update);
  //       this.setState({
  //         localPackage,
  //         remotePackage: update,
  //         hasGetLocalPackage: true
  //       });
  //     })
  //     .catch(error => {
  //       console.log('get current package error');
  //     });
  // };

  _localPackageList = () => {
    if (this.state.localPackage) {
      let localPackage = this.state.localPackage;
      let views = [],
        i = 0;
      for (let itemKey in localPackage) {
        views.push(
          <Text key={i}>
            {itemKey}:{localPackage[itemKey]}
          </Text>
        );
        i++;
      }
      return <View>{views}</View>;
      // return <Text>调试中...</Text>;
    } else {
      return <Text>本地包查询中...</Text>;
    }
  };

  //确保checkUpdate在同一时间只执行一次
  _checkUpdate = (() => {
    let checking = false;
    const checkComplete = () => (checking = false);
    return () => {
      if (checking) return;

      checking = true;
      // CodePush.checkForUpdate(
      //   this.state.deployKey,
      //   this._handleBinaryVersionMismatchCallback
      // )
      CodePush.checkForUpdate()
        .then(remotePackage => {
          if (remotePackage) {
            console.log('remotePackage:');
            console.log(remotePackage);
            Alert.alert(
              '温馨提示',
              '检查到有可用的更新包：\n' + JSON.stringify(remotePackage)
            );
            this.setState({ remotePackage, hasCheckUpdate: true });
          } else {
            this.setState({ hasCheckUpdate: true });
            Alert.alert('温馨提示', '没有检查到可用的更新包');
          }
          checkComplete();
        })
        .catch(error => {
          console.log(`check update get error`);
          checkComplete();
        });
    };
  })();

  //监听下载进度
  _downloadProgressCallback = event => {
    console.log('download: ');
    console.log(event);
  };

  //确保download同一时间只执行一次
  _downLoadFromRemote = (() => {
    let downloading = false;
    const downloadComplete = () => (downloading = false);
    return () => {
      if (!this.state.remotePackage) {
        if (this.state.hasCheckUpdate) {
          Alert.alert('温馨提示', '服务器没有可用的更新包');
        } else {
          Alert.alert('温馨提示', '请先check update');
        }
        return;
      }

      if (downloading) return;

      downloading = true;
      this.state.remotePackage
        .download(this._downloadProgressCallback)
        .then(downloadPackage => {
          this.setState({ hasDownloadedPackage: true, downloadPackage });
          downloadComplete();
          Alert.alert('温馨提示', '成功下载更新包');
        })
        .catch(error => {
          Alert.alert('温馨提示', '下载更新包失败');
          downloadComplete();
        });
    };
  })();

  //安装成功回调
  _updatedInstalledCallback = () => {
    console.log('native installed success');
  };
  //确保install同一时间只执行一次
  _installPackage = (installMode, minimumBackgroundDuration = 0) => {
    let installing = false;
    const installComplete = () => (installing = false);
    return () => {
      if (!this.state.hasDownloadedPackage) {
        Alert.alert('温馨提示', '本地没有下载好的更新包');
        return;
      }

      installing = true;
      this.state.downloadPackage
        .install(
          installMode,
          minimumBackgroundDuration,
          this._updatedInstalledCallback
        )
        .then(() => {
          CodePush.notifyApplicationReady();
          Alert.alert('温馨提示', '安装更新包成功');
        })
        .catch(error => {
          console.log('installed error');
        });
    };
  };

  render() {
    // return (
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <Text>我的!123123</Text>
    //     <Button
    //       title={'检查更新' + this.state.timeOut}
    //       onPress={this.//}
    //     />
    //   </View>
    // );
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.TouchableOpacityStyle}
          onPress={this._checkUpdate}
        >
          <Text>检查更新</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.TouchableOpacityStyle}
          onPress={this._downLoadFromRemote}
        >
          <Text>下载更新</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.TouchableOpacityStyle}
          onPress={this._installPackage(CodePush.InstallMode.ON_NEXT_RESTART)}
        >
          <Text>安装并在下一次重启时应用</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.TouchableOpacityStyle}
          onPress={this._installPackage(CodePush.InstallMode.ON_NEXT_RESUME)}
        >
          <Text>安装并在下次恢复到前台时</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.TouchableOpacityStyle}
          onPress={this._installPackage(CodePush.InstallMode.IMMEDIATE)}
        >
          <Text>安装并立即应用</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.TouchableOpacityStyle}
          onPress={this.syncImmediate}
        >
          <Text>使用简单更新</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.TouchableOpacityStyle}
          onPress={() => {
            this.props.navigation.navigate('UpdateSilent');
          }}
        >
          <Text>尝试静默更新</Text>
        </TouchableOpacity>
        {this._localPackageList()}
        {/* <View>
          <Text>本地包查询中...</Text>
        </View> */}
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
  TouchableOpacityStyle: {
    borderWidth: 2,
    borderColor: color.base,
    marginTop: 10
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
