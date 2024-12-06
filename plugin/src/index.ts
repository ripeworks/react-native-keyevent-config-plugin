import {
  ConfigPlugin,
  withAppDelegate,
  withMainActivity,
  withPlugins,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

const withIosAppDelegateImport: ConfigPlugin = (config) => {
  // @ts-ignore
  const newConfig = withAppDelegate(config, (config) => {
    const newSrc = ["#import <RNKeyEvent.h>"];
    const newConfig = mergeContents({
      tag: "react-native-keyevent-import",
      src: config.modResults.contents,
      newSrc: newSrc.join("\n"),
      anchor: `#import "AppDelegate.h"`,
      offset: 1,
      comment: "//",
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
  return newConfig;
};
const withIosAppDelegateBody: ConfigPlugin = (config) => {
  // @ts-ignore
  const newConfig = withAppDelegate(config, (config) => {
    const newSrc = [
      "RNKeyEvent *keyEvent = nil;",
      " ",
      "- (NSMutableArray<UIKeyCommand *> *)keyCommands {",
      "  NSMutableArray *keys = [NSMutableArray new];",
      "   ",
      "  if (keyEvent == nil) {",
      "    keyEvent = [[RNKeyEvent alloc] init];",
      "  }",
      "   ",
      "  if ([keyEvent isListening]) {",
      '    NSArray *namesArray = [[keyEvent getKeys] componentsSeparatedByString:@","];',
      "     ",
      '    NSCharacterSet *validChars = [NSCharacterSet characterSetWithCharactersInString:@"ABCDEFGHIJKLMNOPQRSTUVWXYZ"];',
      "     ",
      "    for (NSString* names in namesArray) {",
      "      NSRange  range = [names rangeOfCharacterFromSet:validChars];",
      "       ",
      "      if (NSNotFound != range.location) {",
      "        [keys addObject: [UIKeyCommand keyCommandWithInput:names modifierFlags:UIKeyModifierShift action:@selector(keyInput:)]];",
      "      } else {",
      "        [keys addObject: [UIKeyCommand keyCommandWithInput:names modifierFlags:0 action:@selector(keyInput:)]];",
      "      }",
      "    }",
      "  }",
      "   ",
      "  return keys;",
      "}",
      "",
      "- (void)keyInput:(UIKeyCommand *)sender {",
      "  NSString *selected = sender.input;",
      "  [keyEvent sendKeyEvent:selected];",
      "}",
    ];
    const newConfig = mergeContents({
      tag: "react-native-keyevent-body",
      src: config.modResults.contents,
      newSrc: newSrc.join("\n"),
      anchor: `@implementation AppDelegate`, // /#import "AppDelegate\.h"/g,
      offset: 1,
      comment: "//",
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
  return newConfig;
};

const withAndroidMainActivityImport: ConfigPlugin = (config) => {
  // @ts-ignore
  const newConfig = withMainActivity(config, (config) => {
    const newSrc = [
      "import android.view.KeyEvent",
      "import com.github.kevinejohn.keyevent.KeyEventModule",
    ];
    const newConfig = mergeContents({
      tag: "react-native-keyevent-import",
      src: config.modResults.contents,
      newSrc: newSrc.join("\n"),
      anchor: "",
      offset: 1,
      comment: "//",
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
  return newConfig;
};
const withAndroidMainActivityBody: ConfigPlugin = (config) => {
  // @ts-ignore
  const newConfig = withMainActivity(config, (config) => {
    const newSrc = `
  override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
    KeyEventModule.getInstance().onKeyDownEvent(keyCode, event)
    super.onKeyDown(keyCode, event)
    return true
  }

  override fun onKeyUp(keyCode: Int, event: KeyEvent): Boolean {
    KeyEventModule.getInstance().onKeyUpEvent(keyCode, event)
    super.onKeyUp(keyCode, event)
    return true
  }

  override fun onKeyMultiple(keyCode: Int, repeatCount: Int, event:KeyEvent): Boolean {
    KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event)
    return super.onKeyMultiple(keyCode, repeatCount, event)
  }

  override fun dispatchKeyEvent(event: KeyEvent): Boolean {
    if (event.getKeyCode() == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_UP) {
      KeyEventModule.getInstance().onKeyUpEvent(event.getKeyCode(), event)
      return false
    }
    return super.dispatchKeyEvent(event)
  }
`;

    const newConfig = mergeContents({
      tag: "react-native-keyevent-body",
      src: config.modResults.contents,
      newSrc,
      anchor: /class MainActivity : ReactActivity\(\) {/,
      offset: 1,
      comment: "//",
    });
    return {
      ...config,
      modResults: newConfig,
    };
  });
  return newConfig;
};

const withReactNativeKeyEventPlugin: ConfigPlugin = (config) => {
  return withPlugins(config, [
    withIosAppDelegateImport,
    withIosAppDelegateBody,
    withAndroidMainActivityImport,
    withAndroidMainActivityBody,
  ]);
};

export default withReactNativeKeyEventPlugin;
