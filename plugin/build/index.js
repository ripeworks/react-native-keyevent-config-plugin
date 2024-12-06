"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const withIosAppDelegateImport = (config) => {
    // @ts-ignore
    const newConfig = (0, config_plugins_1.withAppDelegate)(config, (config) => {
        const newSrc = ["#import <RNKeyEvent.h>"];
        const newConfig = (0, generateCode_1.mergeContents)({
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
const withIosAppDelegateBody = (config) => {
    // @ts-ignore
    const newConfig = (0, config_plugins_1.withAppDelegate)(config, (config) => {
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
        const newConfig = (0, generateCode_1.mergeContents)({
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
const withAndroidMainActivityImport = (config) => {
    // @ts-ignore
    const newConfig = (0, config_plugins_1.withMainActivity)(config, (config) => {
        const newSrc = [
            "import android.view.KeyEvent",
            "import com.github.kevinejohn.keyevent.KeyEventModule",
        ];
        const newConfig = (0, generateCode_1.mergeContents)({
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
const withAndroidMainActivityBody = (config) => {
    // @ts-ignore
    const newConfig = (0, config_plugins_1.withMainActivity)(config, (config) => {
        const newSrc = `
  override fun onKeyDown(keyCode: int, event: KeyEvent): boolean {
    KeyEventModule.getInstance().onKeyDownEvent(keyCode, event)
    super.onKeyDown(keyCode, event)
    return true
  }

  override fun onKeyUp(keyCode: int, event: KeyEvent): boolean {
    KeyEventModule.getInstance().onKeyUpEvent(keyCode, event)
    super.onKeyUp(keyCode, event)
    return true
  }

  override fun onKeyMultiple(keyCode: int, repeatCount: int, event:KeyEvent): boolean {
    KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event)
    return super.onKeyMultiple(keyCode, repeatCount, event)
  }

  override fun dispatchKeyEvent(event: KeyEvent): boolean {
    if (event.getKeyCode() == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_UP) {
      KeyEventModule.getInstance().onKeyUpEvent(event.getKeyCode(), event)
      return false
    }
    return super.dispatchKeyEvent(event)
  }
`;
        const newConfig = (0, generateCode_1.mergeContents)({
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
const withReactNativeKeyEventPlugin = (config) => {
    return (0, config_plugins_1.withPlugins)(config, [
        withIosAppDelegateImport,
        withIosAppDelegateBody,
        withAndroidMainActivityImport,
        withAndroidMainActivityBody,
    ]);
};
exports.default = withReactNativeKeyEventPlugin;
