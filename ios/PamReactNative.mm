#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PamReactNative, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(displayPopup:(NSDictionary *)banner
                 withBtnColor: (NSString *) btnColor
                 withBtnLabel: (NSString *) btnLabel
                 withBtnLabelColor: (NSString *) btnLabelColor
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)


+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
