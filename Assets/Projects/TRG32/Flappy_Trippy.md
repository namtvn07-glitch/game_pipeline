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
Người chơi có thể sử dụng các vật phẩm hỗ trợ để vượt qua các giai đoạn khó khăn:
Booster:
Khiên Bong Bóng (Bubble Shield): Chặn hoàn toàn sát thương cho 1 lần va chạm. Giá: 500 coins.
Powerups (Xuất hiện ngẫu nhiên khi phá block):
Tăng Tốc Đánh (Rapid Fire): Xả đạn liên tục với tốc độ x2 hoặc x3 trong 5 giây.
Đạn Đa Mục Tiêu (Multishot): Bắn ra 2-3 viên đạn theo hình nón trong 5 giây.
5. Hệ thống Gacha & Skin
Hệ thống Gacha cho phép người chơi mở khóa các Skin nhân vật với tỷ lệ như sau:
Normal (Thường): 70%
Rare (Hiếm): 25%
Legendary (Huyền thoại): 5%
Ghi chú: Nếu quay trùng có thể nhận lại 250 coins.
6. Hệ thống Cửa hàng (Shop)
Cung cấp các gói vật phẩm ưu đãi cho người chơi:
Starter Pack: 2000 coins + 3 booster ($0.99)
Beginner Bundle: 3000 coins + 3 booster ($4.99)
Legendary Bundle: 25000 coins + 9 booster ($18.99)

(Và nhiều gói trung gian khác từ $3.99 đến $14.99)
7. Nhiệm vụ hàng ngày (Daily Tasks)
Hệ thống nhiệm vụ giúp người chơi kiếm thêm tài nguyên mỗi ngày:
Ngày 1: Đăng nhập (50 coins)
Ngày 2: Thu thập Coins (1 Booster Shield)
Ngày 3: Thu thập Dots (1 Booster Freeze)
Ngày 8: Sử dụng vàng mua vật phẩm (100 coins)
Ngày 9: Xem quảng cáo (1 Booster Magnet)
Phần thưởng đặc biệt: Hoàn thành toàn bộ 9 nhiệm vụ sẽ nhận được Rương chứa 500 coins + 4 boosters.
8. Giao diện người dùng (UI/Popup)
Màn hình Home: Hiển thị danh sách Level, Cài đặt, số Coin, Mạng chơi, Leaderboard, Shop và các sự kiện đang diễn ra. Đây là màn hình chính xuất hiện sau Splash game hoặc khi kết thúc một màn chơi.
