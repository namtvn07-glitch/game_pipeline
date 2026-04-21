TÀI LIỆU MÔ TẢ CHI TIẾT GAME: TRG32 - FLAPPY TRIPPY
1. Tổng quan dự án (Project Overview)
Tên dự án: TRG32: Flappy Trippy
Thể loại: 2D Action, Endless Runner, Shoot 'em up.
Nền tảng: Mobile (iOS, Android), tối ưu hóa cho trải nghiệm vuốt/chạm dọc màn hình.
Điểm bán hàng độc nhất (USP): Cơ chế lai "Hybrid-Casual". Khác với các game Endless Runner truyền thống (né tránh thụ động), người chơi trong Flappy Trippy được trao quyền phòng thủ chủ động. Bạn không chỉ bay mà còn phải "dọn đường" bằng cách bắn phá các vật cản, tạo ra một lớp chiến thuật thời gian thực lôi cuốn.
2. Cơ chế cốt lõi (Core Mechanics)
Bay & Bắn (Shoot-to-fly): Màn hình tự động cuộn ngang. Khi người chơi chạm (tap), nhân vật Trippybara bắn ra một viên đạn thẳng. Lực đẩy từ phát bắn (độ giật) sẽ đẩy nhân vật nảy lên, trong khi trọng lực luôn kéo nhân vật xuống.
Chướng ngại vật (Cột): Các cột chắn ngang đường được cấu tạo từ các khối có điểm máu (HP).
Điều kiện Thắng/Thua:
Thua: Khi nhân vật chạm vào cột hoặc rơi khỏi màn hình.
Thắng (Cục bộ): Phá hủy đủ số khối để tạo khe hở và bay xuyên qua an toàn. Mỗi viên đạn trúng đích trừ 1 HP của khối.
Cơ chế Nâng cao:
- Độ giật giảm dần (Diminishing Recoil): Tap liên tục ở tốc độ cao sẽ giảm dần lực nảy, giúp nhân vật an toàn lơ lửng trên không (hovering) thay vì đâm trần và chết. Đạn có thể dội ngược (bouncing) khi va đập vùng cứng.
- Hệ thống Combo & Fever Mode: Việc phá vỡ gạch liên tục tích điểm cho thanh Combo. Khi đầy, kích hoạt Fever Mode 5 giây: Nhân vật bất tử, xả laser càn quét thẳng phía trước và tự động hút rớt thưởng.
- Tiến trình theo Chặng (Phase Milestones): Khắc phục sự nhàm chán của Endeless Runner. Cứ mỗi 50 cột chắn, trò chơi sang Phase cấp độ mới (đổi màu Cảnh nền, tăng +10% tốc độ), đồng thời xuất hiện 1 thử thách đặc trách "Warning Wall".
3. Các loại khối vật cản (Game Elements)
Game sở hữu hệ thống vật cản đa dạng yêu cầu người chơi phải xử lý linh hoạt:
Basic Block: Khối cơ bản, chỉ có HP, không có thuộc tính đặc biệt.
Armor Block: Khối bọc thép, giảm sát thương nhận vào (mỗi hit chỉ gây 0.5 damage).
Moving Block: Khối di chuyển lên xuống theo trục Y, yêu cầu căn thời gian (timing) chính xác.
Shield Block: Có lớp khiên bảo vệ, cần một phát bắn để phá khiên trước khi có thể trừ HP.
Explosive Block: Khi bị phá hủy sẽ gây sát thương lan (2 damage) cho các khối xung quanh.
Metal Block: Khối thép không thể phá hủy, người chơi bắt buộc phải né tránh.
Ghost Block: Khối mập mờ, có thể đi xuyên qua khi ẩn và trở thành vật cản khi hiện hình.
4. Hệ thống hỗ trợ (Boosters & Powerups)
Để tinh giản tài nguyên thiết kế, hệ thống sức mạnh được gộp chung thành một vật phẩm duy nhất xuất hiện trên đường càn quét:
- Hộp Cứu Trợ (Generic Powerup): Rớt ra ngẫu nhiên khi đập vỡ block. Mỗi khi ăn sẽ mang lại một bùa lợi tạm thời (ví dụ: Tạo bong bóng khiên chặn 1 hit, hoặc xả đạn cực đại trong 5 giây).
(Loại bỏ khái niệm mua Booster từ màn hình chờ để giữ game tập trung vào kỹ năng chiến đấu).
8. Giao diện người dùng (UI/Popup)
Áp dụng triết lý "Zero-Friction" (giảm thiểu ma sát điều hướng):
- Màn hình Home: Màn hình trọng tâm duy nhất sau khi vào game, hiển thị nút Play để nhảy thẳng vào cuộc chiến. Bao gộp luôn phần xem tống số lượng Xu (Coins).
- Gameplay & HUD: Hiển thị nhanh điểm số hiện tại và thanh Combo gạch đập được.
- Popup Màn Chơi: Pause, GameOver, và thông báo PhaseUp Milestone đều chỉ là các mảnh đè (Overlay) lên không gian chơi lõi, giúp người chơi quay vòng Replay nhanh chóng không độ trễ.
