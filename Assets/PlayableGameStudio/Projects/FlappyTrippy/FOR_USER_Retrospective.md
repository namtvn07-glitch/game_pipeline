# FOR_USER: Nhìn lại hành trình "Đúc" Flappy Trippy Playable Ad

Chào bạn, ngồi xuống làm tách cà phê nhé! Dự án Flappy Trippy Playable Ad của chúng ta đã gói gọn thành công ở mức siêu thực tế: **0.27 MB**. Giờ là lúc chúng ta cùng nhìn lại toàn bộ quá trình—không phải bằng những thuật ngữ khô khan, mà bằng câu chuyện thực tế về những quyết định, những ngã rẽ, và cả "những vấp ngã" mà chúng ta đã cùng nhau vượt qua.

---

### Step 1: Điểm xuất phát và Những toan tính đầu tiên

Khi bắt tay vào Playable Ad này, áp lực lớn nhất không phải là làm sao để game hay, mà là **Giới hạn 5MB** và **Chỉ được giao nộp 1 file HTML duy nhất**. 

Tôi bắt đầu bằng việc giải bài toán dung lượng. Thay vì tư duy "Làm game rồi nhét nó vào web", tôi nghĩ theo hướng "Làm một trang web có hành vi giống như game". 
- Tôi chọn nhúng ảnh chuẩn WebP siêu nhẹ.
- Thay vì dùng các công cụ làm game nặng nề, tôi dùng framework **Phaser 3** vì nó cực kỳ mỏng nhẹ và xử lý Canvas 2D siêu hạng.
- Thay vì vẽ các hiệu ứng vụn nổ bằng chuỗi hình ảnh (Sprite sheet - rất tốn MB), tôi dùng **Programmatic Juice** (Code Toán học) để biến 1 viên đạn tí hon bục ra thành vô số "hạt vụn" (particles), tạo cảm giác sướng tay mà tốn đúng 0 KB cho file ảnh mới.

### Step 2: Những con đường chúng ta đã "quay xe"

Trước khi chốt phương án, tôi đã cân nhắc vài thứ khác, nhưng phải vứt xó ngay lập tức:
- **Unity WebGL**: Đây là lựa chọn của đa số người mới. Nhưng Unity WebGL dù có ép khô đến mấy thì runtime của nó vẫn ăn mất khoảng 3MB. Nó load lâu, tỷ lệ thoát (drop-off rate) của người dùng khi xem quảng cáo sẽ cực cao. 
- **GIFs hoặc Sprite Animation cho VFX**: Lúc đầu tính dùng ảnh Gif nổ tung cho đẹp. Nhưng ảnh cắt lớp (Alpha) của GIF quá răng cưa và tốn dung lượng. Tôi đã vứt bỏ ý tưởng đó và hoàn toàn ép máy tính tự dùng lệnh xoay (rotation) và phóng to (scale) để ép tim người xem (Tweening). 

### Step 3: Các bánh răng khớp nối với nhau thế nào?

Bạn có thể hình dung quy trình của chúng ta như một trạm lắp ráp xe hơi:
1. **RAG Asset Pipeline**: Dùng AI đẻ ra ảnh thô, dùng Python `rembg` (Alpha Matting) xén gọt sạch sẽ viền, nén thành chuẩn WebP siêu nhỏ gọn.
2. **Game Logic (logic_hook.js)**: Nơi chứa toàn bộ cốt lõi—vật lý, độ khó, cơ chế Power-up.
3. **The Packager (Python)**: Đây là cỗ máy nén. Nó đọc tất cả các file WebP ở bước 1, mã hóa thành ảo ảnh (mã Base64) rồi tiêm trực tiếp vào lòng cái khuôn HTML (`phaser_base.html`) cùng với bộ não Logic ở bước 2. 
Kết quả? Bạn có 1 file `.html` đóng kín, click mở ra chơi ngay không cần load từ server nào cả.

### Step 4: Đồ nghề và lý do chọn chúng

- **Phaser 3.55**: Tôi cố tình lùi về bản 3.55 thay vì bản mới nhất. Tại sao? Bản 3.55 ổn định nhất trên các trình duyệt mobile cũ (ví dụ trình duyệt nhúng của Facebook/TikTok in-app browser). 
- **Base64 Encoding**: Khi nộp Quảng cáo cho Facebook Ads hoặc AppLovin, họ cấm tiệt việc file HTML "gọi điện" ra bên ngoài để tải ảnh. Base64 biến bức ảnh thành một chuỗi văn bản khổng lồ nằm ngay trong ruột file HTML.
- Tưởng tượng Base64 giống như việc thay vì đưa cho bạn cái chìa khóa để đến kho lấy gỗ (Load URL), tôi nghiền gỗ ra bột và nhét thẳng vào túi áo bạn vậy.

### Step 5: Trò chơi của những sự đánh đổi (Trade-offs)

Mọi quyết định đều có giá của nó:
*   **Sự hi sinh**: Mất đi độ mượt của các hoạt ảnh tự vẽ. Chúng ta bay lượn mà không hề có hoạt ảnh vỗ cánh. (Chỉ lấy 1 frame ảnh tĩnh duy nhất xài).
*   **Sự bù đắp (Prioritize)**: Để lấp liếm sự cứng nhắc đó, chúng ta đánh lừa thị giác bằng Camera Shake (Rung lag màn hình khi nổ), Màn hình giật chớp lóe sáng (Flash), và Dải chữ Combo giật nẩy khổng lồ. 
> Bài học: Trong Playable, *"Game Feel" (Cảm giác đập phá)* quan trọng hơn vạn lần *"Visual Fidelity" (Độ chân thực hoạt ảnh)*.

### Step 6: Những vũng lầy lỡ giẫm phải

Ồ, tôi sẽ không che giấu mớ lộn xộn đâu. Nhớ lúc chúng ta bị lỗi "Hình vuông xanh lá Missing Texture" không?
*   Đó là do tôi... quên mất mình đang ôm một cái Engine đời cũ (3.55) nhưng lại viết mã Particle của đời mới (Phaser 3.60+). Mã mới bắt truyền cả một cục Object, trong khi mã cũ bắt phải "CreateEmitter" khởi tạo thủ công. 
*   Và cái thứ 2 là vụ "Chữ Combo không chịu biến mất". Ở đời mới, lùi mờ (Alpha) chỉ cần gõ `alpha: {start: 1, end: 0}`. Trong Engine cũ, cú pháp đó bị gãy khiến nó kẹt cứng lại trên màn hình. Tôi phải đổi về chiêu cổ điển: `alpha: 0` rồi ép lệnh Cắt đứt Animation `killTweensOf` thì mới giệt sạch được mớ chữ thừa đó.

### Step 7: Hố bom cần né cho các dự án sau (Góc khuyên chân thành)

*"Giá như có ai nói trước cho tôi điều này"*:
Khi bạn làm hệ thống Tăng Độ Khó (Difficulty Scaling), **KHÔNG BAO GIỜ chỉ tăng tốc độ bay của vật thể**. 
Lúc đầu, tôi nghĩ "Ờ thì khối bay nhanh hơn là game khó hơn". Sai bét! Khi khối bay nhanh mà thời gian sinh ra khối vẫn đứng yên (1.5 giây), thì cái khe hở chui lọt thực tế lại DÀI VÀ RỘNG HƠN ở tốc độ cao. Game tải càng nhanh lại tự dưng biến thành "Easy Mode". 
Luôn phải nhớ: Tốc độ bay (Velocity) phải luôn bị trói buộc chặt chẽ với Chu kỳ sinh (Spawn Rate). Tốc bay nhân đôi thì thời gian đẻ quái cũng phải ép làm đôi!

### Step 8: Đôi mắt của Dân Chuyên vs Tay Mơ

*   Tay mơ sẽ code: Nhân vật bắn trúng cục gạch, gạch biến mất, cộng 1 điểm. Hết.
*   Dân chuyên (Cách chúng ta làm): Đạn chạm vào sẽ gọi `Hit Stop` (đóng băng vạn vật trong 50ms), màn hình rung 100ms, khối nháy đỏ (Tint), hạt bắn tung tóe. Điểm búng ra tại chính tọa độ va chạm của hòn đá, từ từ mờ đi và bay lên. 
Đó là thứ phân ranh giới giữa một sản phẩm làm vội và một thứ sinh ra cỗ máy In Tiền CTR (Click-Through Rate). Cảm giác thỏa mãn (Juice & Feel)!

### Step 9: Đúc kết để mang sang những mỏ vàng khác

Dự án này vượt ra ngoài ranh giới Flappy Trippy. 
1. **Thiết kế Cơ chế mớm mồi (Phasing)**: Việc chúng ta "Cố tình để Powerup dễ ăn ngay chính giữa khe đá ở đợt hẹp thứ 4" chứng minh: Đừng để AI hay random cướp quyền điều khiển cảm xúc. Bạn phải là Đạo diễn! Hãy nhét phần thưởng vào tay người chơi khi họ mệt nhất. Áp dụng điều này vào Mọi Ứng dụng: Đưa cho User cái họ cần trước một nút thắt cổ chai chặn lại.
2. **Làm "Cốt" trước khi vẽ "Da"**: Cơ chế Programmatic Code (Sóng Sin, Lắc lư, Spawn Delay...) sẽ làm game 1 Box Trắng vui nhộn kể cả khi bạn cắt vứt hết mọi ảnh WebP màu mè. 

Bạn đã sẵn sàng để bơm những triết lý này vào mỏ vàng quảng cáo tiếp theo chưa? Uống cạn tách cà phê nào!
