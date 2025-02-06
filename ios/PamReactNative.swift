import UIKit

@objc(PamReactNative)
class PamReactNative: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }



  @objc(displayPopup:withBtnColor:withBtnLabel:withBtnLabelColor:withResolver:withRejecter:)
  func displayPopup(banner:NSDictionary, btnColor: String, btnLabel:String, btnLabelColor: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
    DispatchQueue.main.async {
      let popupVC = PopupViewController()
      popupVC.resolve = resolve
      popupVC.popupData = banner as? [String:Any]
      popupVC.modalPresentationStyle = .overFullScreen  // ให้แสดงแบบเต็มจอ
      
      popupVC.btnColor = btnColor
      popupVC.btnLabel = btnLabel
      popupVC.btnLabelColor = btnLabelColor
      
      if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
         let window = scene.windows.first {
          window.rootViewController?.present(popupVC, animated: false, completion: nil)
      }
      
    }
  }

}
