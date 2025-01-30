#import "PamReactNative.h"
#import "PopupViewController.h"

@implementation PamReactNative
RCT_EXPORT_MODULE()

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (void) displayPopup:(NSDictionary *)banner {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *keyWindow = [UIApplication sharedApplication].windows.firstObject;
        UIViewController *rootViewController = keyWindow.rootViewController;
        
        if (rootViewController) {
            PopupViewController *viewController = [[PopupViewController alloc] init];
            viewController.modalPresentationStyle = UIModalPresentationOverFullScreen;
          
            viewController.popupData = banner;
            
            [rootViewController presentViewController:viewController animated:NO completion:nil];
        }
    });
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativePamReactNativeSpecJSI>(params);
}

@end
