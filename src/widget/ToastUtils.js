import Toast from 'react-native-root-toast';

let toast,
  singleInstance = false,
  opts = JSON.stringify({
    duration: Toast.durations.SHORT, //持续时间
    position: Toast.positions.CENTER, //tost位置    TOP: 20, BOTTOM: -20, CENTER: 0
    // visible: true,
    shadow: true, //是否启用阴影
    backgroundColor: '#000', //背景颜色
    // shadowColor: '#7f4395',//阴影颜色
    textColor: '#fff', //文字颜色
    animation: true, //是否启用动画
    hideOnPress: true, //触摸点击关闭
    delay: 0, //延迟执行
    onShow: () => {
      console.log('onShow');
    },
    onShown: () => {
      console.log('onShown');
    },
    onHide: () => {
      console.log('onHide');
    },
    onHidden: () => {
      console.log('onHidden 主动调用 Toast.hide 方法不会执行此回调');
    }
  });
class CustomToast extends Toast {
  /**
   * 长时间提示
   *
   * @param {*} content
   * @param {*} opt
   */
  static Long = (content, opt) => {
    if (toast && singleInstance) {
      Toast.hide(toast);
    }
    let args = Object.assign(
      JSON.parse(opts),
      Object.assign(
        {
          duration: Toast.durations.LONG
        },
        opt || {}
      )
    );
    toast = Toast.show(content, args);
    return toast;
  };

  /**
   * 短时间提示
   *
   * @param {*} content
   * @param {*} opt
   */
  static Short = (content, opt) => {
    if (toast && singleInstance) {
      Toast.hide(toast);
    }
    console.log(opts);
    let args = Object.assign(
      JSON.parse(opts),
      Object.assign(
        {
          duration: Toast.durations.SHORT
        },
        opt || {}
      )
    );
    toast = Toast.show(content, args);
    return toast;
  };
  constructor(props: Props) {
    super(props);
  }
}

export default CustomToast;
