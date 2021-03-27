
# react-native-cloudwise2-react-native-plugin

## Getting started

`$ npm install react-native-cloudwise2-react-native-plugin --save`

### Mostly automatic installation

`$ react-native link react-native-cloudwise2-react-native-plugin`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-cloudwise2-react-native-plugin` and add `RNCloudwise2ReactNativePlugin.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNCloudwise2ReactNativePlugin.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.cloudwise.RNCloudwise2ReactNativePluginPackage;` to the imports at the top of the file
  - Add `new RNCloudwise2ReactNativePluginPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-cloudwise2-react-native-plugin'
  	project(':react-native-cloudwise2-react-native-plugin').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-cloudwise2-react-native-plugin/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-cloudwise2-react-native-plugin')
  	```


## Usage
```javascript
import RNCloudwise2ReactNativePlugin from 'react-native-cloudwise2-react-native-plugin';

// TODO: What to do with the module?
RNCloudwise2ReactNativePlugin;
```
  