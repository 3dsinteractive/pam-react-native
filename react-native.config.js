/**
 * @type {import('@react-native-community/cli-types').UserDependencyConfig}
 */
module.exports = {
  dependency: {
    platforms: {
      ios: {
        podspecPath: 'pam-react-native.podspec',
      },
      android: {
        packageImportPath: 'import com.pamreactnative.PamReactNativePackage;',
        packageInstance: 'new PamReactNativePackage()',
        cmakeListsPath: 'generated/jni/CMakeLists.txt',
      },
    },
  },
};
