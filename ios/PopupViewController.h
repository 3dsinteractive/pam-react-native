#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PopupViewController : UIViewController

@property (nonatomic, strong) NSDictionary *popupData;
@property (nonatomic, strong) AVPlayerLayer *playerLayer;
@property (nonatomic, strong) UIView *containerView;
@property (nonatomic, strong) AVPlayer *videoPlayer;


@end

NS_ASSUME_NONNULL_END
