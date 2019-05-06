import React, { Component, PureComponent } from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
const { ScreenWidth, ScreenHeight } = Dimensions.get('window');

// type Props = {};
class LoginScene extends PureComponent {
  static navigationOptions = {
    // title: 'Login',
    headerStyle: {
      backgroundColor: '#fff',
      borderBottomWidth: 0,
      height: 45
      // display:
      //     navigation.state.params && !navigation.state.params.isShowHeader
      //         ? 'none'
      //         : 'flex'
    },
    headerTintColor: '#727272',
    headerBackTitleStyle: {},
    headerTitleStyle: {}
    // gesturesEnabled: true // 是否允许右滑返回，在iOS上默认为true，在Android上默认为false
    // cardStack: {
    //   gesturesEnabled: true // 是否允许右滑返回，在iOS上默认为true，在Android上默认为false
    // }
  };

  constructor(props) {
    super(props);
    console.log('constructor');
    this.state = {
      username: '',
      password: ''
    };
  }

  /**
   * 登陆按钮点击:
   * 1.先进行本地校验
   * 2.本地校验后进行访问后台校验
   * @private
   */
  _onPressLogin = () => {
    // if (this.state.username == null || this.state.username.length <= 0) {
    //     console.log("请输入用户名");
    //     return;
    // }
    // if (this.state.password == null || this.state.password.length <= 0) {
    //     console.log("请输入密码");
    //     return;
    // }
    if (this.state.username === 'timmy' && this.state.password === '123') {
      console.log('恭喜登陆成功');
    }
    this.props.navigation.navigate('Main', {
      UserName: this.state.username,
      Password: this.state.password
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.loginIconStyle}
          source={require('../../assets/images/public/icon_logo.png')}
        />

        <TextInput
          style={styles.inputStyle}
          maxLength={11}
          //autoFocus={true}
          placeholder="请输入手机号"
          placeholderTextColor="#cccccc"
          clearButtonMode="always"
          onChangeText={text =>
            this.setState({
              username: text
            })
          }
          selectionColor="#00f"
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.inputStyle}
          secureTextEntry={true}
          keyboardType="numeric"
          maxLength={18}
          placeholder="请输入密码"
          placeholderTextColor="#cccccc"
          clearButtonMode="always"
          onChangeText={text =>
            this.setState({
              password: text
            })
          }
          selectionColor="#00f"
          underlineColorAndroid="transparent"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <Image
            style={{ height: 10, width: 10, marginRight: 5 }}
            source={require('../../assets/images/production/icon_notice_red.png')}
          />
          <Text style={{ color: '#f33', fontSize: 12 }}>
            必要不会以任何理由要求您转账汇款，谨防诈骗
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.loginConStyle,
            {
              shadowColor: '#7f4395',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.7,
              shadowRadius: 3
            }
          ]}
          activeOpacity={0.8}
          onPress={() => this._onPressLogin()}
        >
          <Text style={styles.loginTextStyle}>登录</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.loginConStyle, styles.otherConStyle]}
          activeOpacity={0.8}
          onPress={() => this._onPressLogin()}
        >
          <Text style={[styles.loginTextStyle, styles.otherTextStyle]}>
            验证码登录
          </Text>
        </TouchableOpacity>*/}
        <TouchableOpacity
          style={[styles.loginConStyle, styles.otherConStyle]}
          activeOpacity={0.8}
          onPress={() => this._onPressLogin()}
        >
          <Text style={[styles.loginTextStyle, styles.otherTextStyle]}>
            密码登录
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#7f4395', fontSize: 12 }}>
            还没有账号？快速注册
          </Text>
          <Text style={{ color: '#7f4395', fontSize: 12 }}>忘记密码！</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            // height: 30,
            width: '100%'
          }}
        >
          <View
            style={{
              width: '100%',
              height: 40,
              position: 'relative',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{ height: 0.5, backgroundColor: '#cccccc', flex: 1 }}
            />
            <Text
              style={{
                color: '#818181',
                marginLeft: 10,
                marginRight: 10,
                fontSize: 12
              }}
            >
              第三方账号登录
            </Text>
            <View
              style={{ height: 0.5, backgroundColor: '#cccccc', flex: 1 }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 25
            }}
          >
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../assets/images/public/icon_qq_login.png')}
            />
            <Image
              style={{ height: 30, width: 30, marginLeft: 50 }}
              source={require('../../assets/images/public/icon_wechat_login.png')}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: '8%',
    paddingRight: '8%'
  },
  loginIconStyle: {
    width: 70,
    height: 70,
    marginTop: 30,
    marginBottom: 50
    // borderRadius: 40,
    // borderWidth: 3,
    // borderColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    height: 40,
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    marginTop: 10,
    // borderRadius: 3,
    // paddingLeft: 10,
    color: '#2d2d2d'
  },
  loginConStyle: {
    width: '100%',
    backgroundColor: '#7f4395',
    padding: 14,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  loginTextStyle: {
    color: '#fff',
    fontSize: 16
    // fontWeight: 'bold'
  },
  otherConStyle: {
    backgroundColor: '#ffffff',
    borderWidth: 0.5,
    borderColor: '#7f4395'
  },
  otherTextStyle: {
    color: '#7f4395'
  }
});

export default LoginScene;
