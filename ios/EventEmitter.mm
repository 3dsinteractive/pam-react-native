#import "EventEmitter.h"

@implementation EventEmitter 

RCT_EXPORT_MODULE();

// Supported events to emit
- (NSArray<NSString *> *)supportedEvents {
    return @[@"OnBannerClick"];
}

// Emit event to JavaScript
- (void)dispatchOnBannerClick:(NSDictionary  *)popupData {
    [self sendEventWithName:@"OnBannerClick" body: popupData];
}

@end
