#### 运行错误解决方案

1、Could not find iPhone 6 simulator
```shell
itenls-MacBook-Pro:RN_XENL itenl$ npm run ios

> rn_xenl@0.0.1 ios /Users/itenl/Code/Biyao/github/RN_XENL
> react-native run-ios

Scanning folders for symlinks in /Users/itenl/Code/Biyao/github/RN_XENL/node_modules (18ms)
Found Xcode project RN_XENL.xcodeproj

Could not find iPhone 6 simulator

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! rn_xenl@0.0.1 ios: `react-native run-ios`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the rn_xenl@0.0.1 ios script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

【解决方案】：

请到项目依赖：node_modules/react-native/local-cli/runIOS/findMatchingSimulator.js

// 约第 30 行
// source
if (!version.startsWith('iOS') && !version.startsWith('tvOS')) {
// 修改成以下内容
// target
if (version.indexOf('com.apple.CoreSimulator.SimRuntime.iOS') !== 0) {

或使用 npm run ios-devices 查看目前Mac下已安装的模拟器并使用 react-native run-ios --device "iPhone 6" 运行指定模拟器；

```

2、Print: Entry, ":CFBundleIdentifier", Does Not Exist
```shell
party/glog-0.3.4/src/demangle.cc -o /Users/itenl/Code/Biyao/github/RN_XENL/ios/build/Build/Intermediates.noindex/React.build/Debug-iphonesimulator/third-party.build/Objects-normal/x86_64/demangle-0816d31544167686f27d5264f82a6f5ac67a869564183b68ceff63bc9453d1d1.o
In file included from /Users/itenl/Code/Biyao/github/RN_XENL/node_modules/react-native/third-party/glog-0.3.4/src/demangle.cc:38:
/Users/itenl/Code/Biyao/github/RN_XENL/node_modules/react-native/third-party/glog-0.3.4/src/demangle.h:73:10: fatal error: 'config.h' file not found
#include "config.h"
         ^~~~~~~~~~
1 error generated.


** BUILD FAILED **


The following build commands failed:

	CompileC /Users/itenl/Code/Biyao/github/RN_XENL/ios/build/Build/Intermediates.noindex/React.build/Debug-iphonesimulator/third-party.build/Objects-normal/x86_64/demangle-0816d31544167686f27d5264f82a6f5ac67a869564183b68ceff63bc9453d1d1.o /Users/itenl/Code/Biyao/github/RN_XENL/node_modules/react-native/third-party/glog-0.3.4/src/demangle.cc normal x86_64 c++ com.apple.compilers.llvm.clang.1_0.compiler
(1 failure)

Installing build/Build/Products/Debug-iphonesimulator/RN_XENL.app
An error was encountered processing the command (domain=NSPOSIXErrorDomain, code=22):
Failed to install the requested application
The bundle identifier of the application could not be determined.
Ensure that the application's Info.plist contains a value for CFBundleIdentifier.
Print: Entry, ":CFBundleIdentifier", Does Not Exist

Command failed: /usr/libexec/PlistBuddy -c Print:CFBundleIdentifier build/Build/Products/Debug-iphonesimulator/RN_XENL.app/Info.plist
Print: Entry, ":CFBundleIdentifier", Does Not Exist


npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! rn_xenl@0.0.1 ios: `react-native run-ios`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the rn_xenl@0.0.1 ios script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/itenl/.npm/_logs/2019-05-24T05_22_56_418Z-debug.log

【解决方案】：

package.json 已经整合了所需操作，使用 npm run rncache 即可，若 curl 下载 RN_XENL_Dependence-master 缓慢可直接用浏览器下载放置 lib 并解压 再执行 npm run rncache-after-min；


```