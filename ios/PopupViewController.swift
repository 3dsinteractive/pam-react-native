import AVFoundation
import UIKit

public class PopupViewController: UIViewController {

    var popupData: [String: Any]?
    var playerLayer: AVPlayerLayer?
    var containerView: UIView?
    var videoPlayer: AVPlayer?
    var resolve: RCTPromiseResolveBlock?
    var reject: RCTPromiseRejectBlock?

    var btnColor: String?
    var btnLabel: String?
    var btnLabelColor: String?
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    private func setupUI() {
        guard let popup = popupData else { return }

        // อ่านค่าจาก popupData
        let title = popup["title"] as? String
        let description = popup["description"] as? String
        let image = popup["image"] as? String
        let video = popup["video"] as? String
        let size = popup["size"] as? String
        let trackingPixelUrl = popup["tracking_pixel_url"] as? String

        // ส่ง Tracking Pixel ไปยัง Server
        if let url = URL(string: trackingPixelUrl ?? "") {
            URLSession.shared.dataTask(with: url).resume()
        }

        // พื้นหลังสีดำโปร่งแสง
        view.backgroundColor = UIColor.black.withAlphaComponent(0.7)

        // Container View สำหรับแสดง Popup
        containerView = UIView()
        containerView!.backgroundColor = .clear
        containerView!.layer.cornerRadius = 15
        containerView!.layer.masksToBounds = true
        containerView!.clipsToBounds = true
        containerView!.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(containerView!)

        // กำหนดขนาด popup ตาม size
        if size == "large" {
            NSLayoutConstraint.activate([
                containerView!.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.8),
                containerView!.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: 0.6),
                containerView!.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                containerView!.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -10),
            ])
        } else {
            NSLayoutConstraint.activate([
                containerView!.topAnchor.constraint(equalTo: view.topAnchor),
                containerView!.bottomAnchor.constraint(equalTo: view.bottomAnchor),
                containerView!.leadingAnchor.constraint(equalTo: view.leadingAnchor),
                containerView!.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            ])
        }

        // Description Label
        let descriptionLabel = UILabel()
        descriptionLabel.text = description
        descriptionLabel.textColor = .white
        descriptionLabel.font = UIFont.systemFont(ofSize: 16)
        descriptionLabel.textAlignment = .center
        descriptionLabel.numberOfLines = 0
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(descriptionLabel)

        if size == "large" {
            descriptionLabel.textAlignment = .center
            NSLayoutConstraint.activate([
                descriptionLabel.topAnchor.constraint(
                    equalTo: containerView!.bottomAnchor, constant: 10),
                descriptionLabel.leadingAnchor.constraint(
                    equalTo: view.leadingAnchor, constant: 20),
                descriptionLabel.trailingAnchor.constraint(
                    equalTo: view.trailingAnchor, constant: -20),
            ])
        } else {
            descriptionLabel.textAlignment = .left
            NSLayoutConstraint.activate([
                descriptionLabel.bottomAnchor.constraint(
                    equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -70),
                descriptionLabel.leadingAnchor.constraint(
                    equalTo: view.leadingAnchor, constant: 20),
                descriptionLabel.trailingAnchor.constraint(
                    equalTo: view.trailingAnchor, constant: -20),
            ])
        }

        // Title Label
        let titleLabel = UILabel()
        titleLabel.text = title
        titleLabel.textColor = .white
        titleLabel.font = UIFont.boldSystemFont(ofSize: 20)

        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(titleLabel)

        if size == "large" {
            titleLabel.textAlignment = .center
            NSLayoutConstraint.activate([
                titleLabel.bottomAnchor.constraint(
                    equalTo: containerView!.topAnchor, constant: -10),
                titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
                titleLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            ])
        } else {
            titleLabel.textAlignment = .left
            NSLayoutConstraint.activate([
                titleLabel.bottomAnchor.constraint(
                    equalTo: descriptionLabel.topAnchor, constant: -10),
                titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
                titleLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            ])
        }

        // รองรับการแสดง Image หรือ Video
        if let imageUrl = image, let url = URL(string: imageUrl) {
            let imageView = UIImageView()
            imageView.contentMode = .scaleAspectFit
            imageView.translatesAutoresizingMaskIntoConstraints = false
            containerView!.addSubview(imageView)
            imageView.contentMode = .scaleAspectFill
            NSLayoutConstraint.activate([
                imageView.widthAnchor.constraint(
                    equalTo: containerView!.widthAnchor, multiplier: 1.0),
                imageView.heightAnchor.constraint(
                    equalTo: containerView!.heightAnchor, multiplier: 1.0),
                imageView.centerXAnchor.constraint(equalTo: containerView!.centerXAnchor),
                imageView.centerYAnchor.constraint(equalTo: containerView!.centerYAnchor),
            ])

            DispatchQueue.global().async {
                if let data = try? Data(contentsOf: url), let image = UIImage(data: data) {
                    DispatchQueue.main.async {
                        imageView.image = image
                    }
                }
            }
        }

        if let videoUrl = video, let url = URL(string: videoUrl) {
            videoPlayer = AVPlayer(url: url)
            playerLayer = AVPlayerLayer(player: videoPlayer!)
            playerLayer!.frame = CGRect(x: 0, y: 0, width: 0, height: 0)
            containerView!.layer.addSublayer(playerLayer!)
            videoPlayer!.play()
        }

        // Close Button
        let closeButton = UIButton(type: .system)
        closeButton.backgroundColor = .white
        closeButton.layer.cornerRadius = 20
        //let icon = UIImage(systemName: "xmark")  // ไอคอน "X"

        if #available(iOS 13.0, *) {
            let icon = UIImage(systemName: "xmark")  // ใช้ SF Symbol บน iOS 13+
            closeButton.setImage(icon, for: .normal)
        } else {
            // ใช้ตัวอักษร ✖️ แทนรูปภาพ
            closeButton.setTitle("✖️", for: .normal)
            closeButton.setTitleColor(.black, for: .normal) // เปลี่ยนสีให้ตรงกับ UI
        }

        closeButton.tintColor = .black  // สีของไอคอน
        closeButton.translatesAutoresizingMaskIntoConstraints = false

        closeButton.addTarget(self, action: #selector(closePopup), for: .touchUpInside)
        closeButton.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(closeButton)

        if size == "large" {
            NSLayoutConstraint.activate([
                closeButton.heightAnchor.constraint(equalToConstant: 40),
                closeButton.widthAnchor.constraint(equalToConstant: 40),
                closeButton.topAnchor.constraint(
                    equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
                closeButton.trailingAnchor.constraint(
                    equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -30),
            ])
        } else {
            NSLayoutConstraint.activate([
                closeButton.heightAnchor.constraint(equalToConstant: 40),
                closeButton.widthAnchor.constraint(equalToConstant: 40),
                closeButton.topAnchor.constraint(
                    equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
                closeButton.trailingAnchor.constraint(
                    equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20),
            ])
        }

        // Close Button
        let info = UIButton(type: .system)
        info.layer.cornerRadius = 20
      
        if self.btnLabel != nil && self.btnLabel != "" {
            info.setTitle(self.btnLabel, for: .normal)
        }else{
            info.setTitle("LEARN MORE..", for: .normal)
        }
        
        let bc = self.colorFromHex(self.btnColor)
        info.backgroundColor = bc ?? UIColor(red: 0.36, green: 0.94, blue: 0.85, alpha: 1.0)
        
        let lc = self.colorFromHex(self.btnLabelColor)
        if lc != nil {
          info.setTitleColor(lc, for: UIControl.State.normal)
        }else{
          info.setTitleColor(.black, for: UIControl.State.normal)
        }
      
        
        info.addTarget(self, action: #selector(learnMore), for: .touchUpInside)
        info.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(info)

        NSLayoutConstraint.activate([
            info.heightAnchor.constraint(equalToConstant: 40),
            info.bottomAnchor.constraint(
                equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: 0),
            info.leadingAnchor.constraint(
                equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 10),
            info.trailingAnchor.constraint(
                equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -10),
        ])

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(restartVideo),
            name: .AVPlayerItemDidPlayToEndTime,
            object: videoPlayer?.currentItem
        )
    }
  
    private func colorFromHex(_ hex: String?) -> UIColor? {
        guard let hex = hex else{return nil}
        if hex == "" {
          return nil
        }
      
        // ตัดช่องว่างและแปลงให้เป็นตัวพิมพ์ใหญ่
        var hexFormatted = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        // ถ้ามีเครื่องหมาย # ให้ตัดออก
        if hexFormatted.hasPrefix("#") {
            hexFormatted.remove(at: hexFormatted.startIndex)
        }
        
        // ตรวจสอบว่ามีความยาว 6 ตัวอักษรหรือไม่
        guard hexFormatted.count == 6 else {
            return nil
        }
        
        // แปลง String เป็นค่าเลขฐาน 16 (UInt64)
        var rgbValue: UInt64 = 0
        guard Scanner(string: hexFormatted).scanHexInt64(&rgbValue) else {
            return nil
        }
        
        // ดึงค่า red, green, blue
        let red   = CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0
        let green = CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0
        let blue  = CGFloat(rgbValue & 0x0000FF) / 255.0
        
        // คืนค่า UIColor
        return UIColor(red: red, green: green, blue: blue, alpha: 1.0)
    }

    @objc private func restartVideo() {
        videoPlayer?.seek(to: .zero)
        videoPlayer?.play()
    }

    public override func viewDidLayoutSubviews() {
        playerLayer?.frame = containerView?.bounds ?? CGRect.zero
    }

    @objc private func learnMore() {
        resolve?(popupData)
        dismiss(animated: true)
    }

    @objc private func closePopup() {
        UIView.animate(
            withDuration: 0.3,
            animations: {
                self.view.alpha = 0
            },
            completion: { _ in
                self.dismiss(animated: false, completion: nil)
            })
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

}
