
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface EventEmitter : RCTEventEmitter <RCTBridgeModule>
-(void)dispatchOnBannerClick:(NSDictionary  *)popupData;
@end
