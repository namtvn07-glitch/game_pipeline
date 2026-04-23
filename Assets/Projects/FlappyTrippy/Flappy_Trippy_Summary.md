# Tóm tắt game Flappy Trippy

### 1. Tổng quan dự án (Project Overview)
* **Tên dự án:** TRG32: Flappy Trippy
* **Thể loại:** 2D Action, Endless Runner, Shoot 'em up.
* **Nền tảng:** Mobile (iOS, Android), tối ưu cho thao tác chạm/vuốt dọc.
* **Điểm nhấn độc đáo (USP):** Game "Hybrid-Casual", vừa bay (chống trọng lực) vừa chủ động bắn phá vũ khí để dọn đường qua các chướng ngại vật thành lớp chiến thuật thời gian thực.

### 2. Cơ chế cốt lõi (Core Mechanics)
* **Cơ chế bay & bắn (Shoot-to-fly):** Chạm màn hình để bắn đạn. Độ giật (recoil) từ súng đóng vai trò như lực đẩy nhân vật bay lên.
* **Thắng/Thua cốt lõi:**
  * **Thua:** Va vào các khối chặn đường hoặc rớt khỏi màn hình.
  * **Thắng (Cơ bản):** Phát đạn bắn trúng trừ 1 HP, mở đường để bay qua.
* **Cơ chế nâng cao:**
  * **Độ giật giảm dần:** Tap quá nhanh thì lực đẩy lên sẽ yếu đi, giúp dễ dàng duy trì tầm lơ lửng an toàn.
  * **Combo & Fever Mode:** Đập gạch liên tiếp đầy thanh Combo sẽ kích hoạt 5 giây "Fever Mode" (Bất tử, bắn tia laser to dọn sạch, tự động hút vật phẩm).
  * **Chặng đua (Phase):** Giải quyết sự nhàm chán bằng cách tăng phase mỗi 50 cột (đổi màu nền, tăng tốc độ), kèm cảnh báo đặc biệt "Warning Wall".

### 3. Hệ thống vật cản (Game Elements)
Bao gồm 7 loại khối với độ khó đa dạng:
1. **Basic Block:** Khối thường.
2. **Armor Block:** Bọc giáp, giảm sát thương nhận vào.
3. **Moving Block:** Di chuyển lên xuống liên tục.
4. **Shield Block:** Cần 1 viên đạn đầu để phá khiên trước, sau đó mới gây damge.
5. **Explosive Block:** Phá hủy sẽ gây nổ chặn lan (2 damage) cho các khối đứng cạnh.
6. **Metal Block:** Khối cứng ngắc không thể bắn vỡ, bắt buộc phải luồn lách.
7. **Ghost Block:** Khối ma tàng hình (xuyên thấu) và thỉnh thoảng hiện ra (va chạm vật lý).

### 4. Hệ thống sức mạnh (Boosters & Powerups)
* **Powerups (Nhặt trên đường):** Rớt ngẫu nhiên từ khối bị bắn vỡ, ăn vào sẽ nhận 1 trong 3 trạng thái đạn đặc biệt:
  * **Rapid Fire:** Bắn đạn siêu nhanh.
  * **Multishot:** Đạn tỏa ra bắn nhiều hướng cùng lúc.
  * **Đạn Xuyên:** Bắn xuyên qua phá hủy nhiều mục tiêu liền một hàng.
* **Booster Chủ động (Sử dụng qua Nút bấm):** Có 1 **nút bấm kỹ năng trên màn hình Game** (In-game HUD). Cho phép kích hoạt **KHIÊN**, tạo vòng bảo vệ đỡ ngay 1 pha va chạm hoặc sát thương chí mạng.

### 5. Thiết kế UI/UX ("Zero-Friction")
* **Bỏ qua Màn Hình Home:** Không có menu chờ. Khởi động app là "Nhảy thẳng luôn vào màn hình Gameplay" để bắt đầu ván.
* **Gameplay HUD Thiết yếu:** Góc nhìn in-game bao cùng điểm số, Thanh Combo Fever và **Nút bấm Booster Khiên**.
* **Hệ thống Overlay Pop-up:** Các Pause, Gameover và Thông báo chuyển phase chỉ là lớp mờ phủ lên màn hình chơi lõi. Giúp thiết lập Replay ván mới vòng quay cực kỳ nhanh mà hoàn toàn không có độ trễ chuyển cảnh.
