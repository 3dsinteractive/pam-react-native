#import "PopupViewController.h"

@implementation PopupViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setupUI];
}

- (void)setupUI {
    NSDictionary *popup = self.popupData;
    if (!popup) return;

    NSString *title = popup[@"title"];
    NSString *description = popup[@"description"];
    NSString *image = popup[@"image"];
    NSString *video = popup[@"video"];
    NSString *size = popup[@"size"];
    NSString *trackingPixelUrl = popup[@"tracking_pixel_url"];

    // Send tracking pixel
    if (trackingPixelUrl) {
        NSURL *url = [NSURL URLWithString:trackingPixelUrl];
        if (url) {
            [[[NSURLSession sharedSession] dataTaskWithURL:url] resume];
        }
    }

    self.view.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.7];

    // Container view
    self.containerView = [[UIView alloc] init];
    self.containerView.backgroundColor = [UIColor clearColor];
    self.containerView.layer.cornerRadius = 15;
    self.containerView.clipsToBounds = YES;
    self.containerView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.containerView];

    if ([size isEqualToString:@"large"]) {
        [NSLayoutConstraint activateConstraints:@[
            [self.containerView.widthAnchor constraintEqualToAnchor:self.view.widthAnchor multiplier:0.8],
            [self.containerView.heightAnchor constraintEqualToAnchor:self.view.heightAnchor multiplier:0.6],
            [self.containerView.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor],
            [self.containerView.centerYAnchor constraintEqualToAnchor:self.view.centerYAnchor constant:-10]
        ]];
    } else {
        [NSLayoutConstraint activateConstraints:@[
            [self.containerView.topAnchor constraintEqualToAnchor:self.view.topAnchor],
            [self.containerView.bottomAnchor constraintEqualToAnchor:self.view.bottomAnchor],
            [self.containerView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
            [self.containerView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor]
        ]];
    }

    // Description label
    UILabel *descriptionLabel = [[UILabel alloc] init];
    descriptionLabel.text = description;
    descriptionLabel.textColor = [UIColor whiteColor];
    descriptionLabel.font = [UIFont systemFontOfSize:16];
    descriptionLabel.numberOfLines = 0;
    descriptionLabel.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:descriptionLabel];

    if ([size isEqualToString:@"large"]) {
        [NSLayoutConstraint activateConstraints:@[
            [descriptionLabel.topAnchor constraintEqualToAnchor:self.containerView.bottomAnchor constant:10],
            [descriptionLabel.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:20],
            [descriptionLabel.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-20]
        ]];
    } else {
        [NSLayoutConstraint activateConstraints:@[
            [descriptionLabel.bottomAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor constant:-70],
            [descriptionLabel.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:20],
            [descriptionLabel.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-20]
        ]];
    }

    // Title label
    UILabel *titleLabel = [[UILabel alloc] init];
    titleLabel.text = title;
    titleLabel.textColor = [UIColor whiteColor];
    titleLabel.font = [UIFont boldSystemFontOfSize:20];
    titleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:titleLabel];

    if ([size isEqualToString:@"large"]) {
        [NSLayoutConstraint activateConstraints:@[
            [titleLabel.bottomAnchor constraintEqualToAnchor:self.containerView.topAnchor constant:-10],
            [titleLabel.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:20],
            [titleLabel.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-20]
        ]];
    } else {
        [NSLayoutConstraint activateConstraints:@[
            [titleLabel.bottomAnchor constraintEqualToAnchor:descriptionLabel.topAnchor constant:-10],
            [titleLabel.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:20],
            [titleLabel.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-20]
        ]];
    }

    // Image or Video
    if (image != nil && ![image isKindOfClass:[NSNull class]] && ![image isEqualToString:@""]) {
        NSURL *imageUrl = [NSURL URLWithString:image];
        if (imageUrl && imageUrl.scheme && imageUrl.host) {
            UIImageView *imageView = [[UIImageView alloc] init];
            imageView.contentMode = UIViewContentModeScaleAspectFit;
            imageView.translatesAutoresizingMaskIntoConstraints = NO;
          
          
            [self.containerView addSubview:imageView];
            [NSLayoutConstraint activateConstraints:@[
                [imageView.widthAnchor constraintEqualToAnchor:self.containerView.widthAnchor],
                [imageView.heightAnchor constraintEqualToAnchor:self.containerView.heightAnchor],
                [imageView.centerXAnchor constraintEqualToAnchor:self.containerView.centerXAnchor],
                [imageView.centerYAnchor constraintEqualToAnchor:self.containerView.centerYAnchor]
            ]];

            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                NSData *data = [NSData dataWithContentsOfURL:imageUrl];
                UIImage *image = [UIImage imageWithData:data];
               
                NSLog(@"Image data length: %lu", (unsigned long)data.length);
                dispatch_async(dispatch_get_main_queue(), ^{
                    imageView.image = image;
                    CGSize size = imageView.frame.size;
                    NSLog(@"Image size: %f x %f", size.width, size.height);
                });
            });
        }
    }

    if (video != nil && ![video isKindOfClass:[NSNull class]] && ![video isEqualToString:@""]) {
        NSURL *videoUrl = [NSURL URLWithString:video];
        if (videoUrl) {
            self.videoPlayer = [AVPlayer playerWithURL:videoUrl];
            self.playerLayer = [AVPlayerLayer playerLayerWithPlayer:self.videoPlayer];
            self.playerLayer.frame = CGRectZero;
            [self.containerView.layer addSublayer:self.playerLayer];
            [self.videoPlayer play];
        }
    }

    // Close button
    UIButton *closeButton = [UIButton buttonWithType:UIButtonTypeSystem];
    closeButton.backgroundColor = [UIColor whiteColor];
    closeButton.layer.cornerRadius = 20;
    UIImage *icon = nil;

    if (@available(iOS 13.0, *)) {
        icon = [UIImage systemImageNamed:@"xmark"];
    } else {
        icon = [UIImage imageNamed:@"ic_close"];
    }

    [closeButton setImage:icon forState:UIControlStateNormal];
    closeButton.tintColor = [UIColor blackColor];
    closeButton.translatesAutoresizingMaskIntoConstraints = NO;
    [closeButton addTarget:self action:@selector(closePopup) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:closeButton];

    [NSLayoutConstraint activateConstraints:@[
        [closeButton.heightAnchor constraintEqualToConstant:40],
        [closeButton.widthAnchor constraintEqualToConstant:40],
        [closeButton.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:20],
        [closeButton.trailingAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.trailingAnchor constant:-20]
    ]];
}

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    self.playerLayer.frame = self.containerView.bounds;
}

- (void)closePopup {
    [UIView animateWithDuration:0.3 animations:^{
        self.view.alpha = 0;
    } completion:^(BOOL finished) {
        // if (self.result) {
        //     self.result(nil);
        // }
        [self dismissViewControllerAnimated:NO completion:nil];
    }];
}

@end
