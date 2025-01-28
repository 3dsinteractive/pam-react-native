#import "PamReactNative.h"
#import "PopupViewController.h"

@implementation PamReactNative
RCT_EXPORT_MODULE()

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (void) displayPopup {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
        UIViewController *rootViewController = keyWindow.rootViewController;
        
        if (rootViewController) {
            PopupViewController *viewController = [[PopupViewController alloc] init];
            viewController.modalPresentationStyle = UIModalPresentationOverFullScreen;
          
            viewController.popupData = @{
                @"title": @"Hello World",
                @"description": @"This is a popup",
                @"size": @"large",
                @"image": @"https://placehold.co/720x1280/5596CA/000000"
            };
            
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
