# Game Pipeline: Master Architecture & Workflow Document

## 1. Tổng quan & Quan điểm Thiết kế (Overview & Design Philosophy)

Game Pipeline là một hệ thống sản xuất game tự động hóa toàn diện từ ý tưởng đến thành phẩm cuối cùng, được vận hành bởi một tập hợp các AI Agent (Agents) chuyên biệt. Thay vì dựa vào 1 luồng xử lý duy nhất (monolithic AI), dự án này chia nhỏ vòng đời phát triển game thành 8 module (skills) cốt lõi. Mỗi module đóng vai trò như một chuyên gia: từ Game Designer, Art Director, Audio Engineer cho tới Developer.

**Mục tiêu cốt lõi:**
- **Tự động hóa có kiểm soát**: Phát huy tối đa khả năng tạo mã và tài sản (assets) của AI, nhưng giữ lại tính kiểm soát nghiêm ngặt thông qua vòng lặp "Human-in-the-Loop".
- **Tính nhất quán (Consistency)**: Loại bỏ các ảo giác (hallucinations) thường gặp của AI thông qua RAG, Embeddings, Few-shot và Semantic Search.
- **Tối ưu Kỹ thuật**: Code sinh ra cho HTML5/Phaser tuân thủ monolithic <5MB, Unity có Try-Catch tự động qua MCP.

## 2. Công nghệ, Tool & Kỹ thuật (Core Tech Stack)

### 2.1 Kiến trúc RAG: Semantic Search & Embedding Dữ liệu
- **Embedding Dữ liệu (Vector Embeddings)**: Sử dụng Python (thư viện `sentence-transformers` qua các script `.py`) để đọc các định nghĩa thiết kế và tài liệu. Dịch toàn bộ văn bản này thành các chuỗi vector đa chiều, biến khái niệm trừu tượng thành dữ liệu toán học.
- **Semantic Search (Tìm kiếm ngữ nghĩa)**: Khi Agent khởi tạo hình ảnh mới, thuật toán **Cosine Similarity** tìm kiếm trong không gian Vector luật lệ mô tả gần nhất với yêu cầu hiện tại để ép vào Prompt Context.

### 2.2 Kỹ thuật Few-Shot Visual Prompting & Audio Prompters
- **Hình ảnh thông qua Few-Shot Visual Prompting**:Hệ thống trích xuất các ảnh mẫu tốt nhất (Archetypes reference images) tệp đính kèm vào Vision Model. Khái niệm này cho phép AI "Nhìn và Học" trực quan nét vẽ và bảng màu.
- **Audio Translations**: Chuyển đổi tính chất vật lý/lối chơi trong game thành Audio texture parameters (mức độ dội âm vang, tần suất tấn công, tiếng ồn mỏi).

### 2.3 Framework & Game Engine
- **Về Playable Ads**: Sử dụng framework **Phaser 3** (`HTML5`) để quản lý physics. Hệ thống dùng template tĩnh (`phaser_base.html`) để AI chỉ inject `logic_hook.js`, chống hallucination boilerplate code. Toàn bộ tài nguyên Encode Base64 nhồi vào 1 file `index.html`.
- **Về Game Prototype**: Sử dụng nền tảng **Unity (C#)** kết hợp giao thức **MCP** để tự động hoá toolchain C#.

---

## 3. Quy trình Tiêu chuẩn: Chi tiết từng Skill (Zero-Omission Breakdown)

Tài liệu này bắt buộc liệt kê nghiêm ngặt mọi Step nằm trong các `SKILL.md` của các Agent, không được phép bỏ qua bước nào.

### 3.1. Phân tích Nội dung - `game-designer`
- **Phase 1: Concept & Core Loop**: Đọc subskill `1_concept.md`, chuyển ý tưởng thô thành khối `[CONCEPT]` và `[CORE_GAMEPLAY]`. Dừng lại kiểm tra.
- **Phase 2: Rules Mapping**: Đọc subskill `2_rules.md`, CHỈ sử dụng output Phase 1 để định hình khối `[GAME_RULES]` cực kỳ khắt khe. Dừng lại kiểm tra.
- **Phase 3: Event Matrix & Checklists**: Đọc subskill `3_matrix.md`, kết nối các luồng sinh ra `[EVENT_MATRIX]` và check-list JSON khối tài sản `[ASSET_AGGREGATION_CHECKLIST]`.
- **Final Export 1**: Ghi đè tổ hợp thành file MD duy nhất `[ProjectName]_GDD.md`.
- **Final Export 2**: Trích xuất (parse) các mảng JSON ở checklist thành 4 file tài sản độc lập (`_Art_Assets.json`, `_Audio_Assets.json`, `_VFX_Assets.json`, `_UI_Assets.json`).

### 3.2. Quản trị Dữ liệu RAG - `game-art-compiler` & `game-art-configurator`
**(A) `game-art-compiler` (Trích xuất Style từ ảnh gốc):**
- **Step 1:** Quét thư mục Style. Bắt buộc xóa bỏ các file legacy `DNA_Profile.md` (V1).
- **Step 2 (VLM Tagging):** Nạp toàn bộ ảnh qua mô hình VLM để phân tách Shape, Material, Complexity, Color. Sinh ra *RAG Hook Tag* lưu vào bộ nhớ mảng JSON.
- **Step 3 (Local Embeddings):** Chạy lệnh Python `create_embeddings.py`. Tính toán *Centroid*, gắn cờ các ảnh gần tâm là `is_archetype` (ví dụ: ảnh chuẩn nhất làm Few-Shot). Xuất `style_index.json`.
- **Step 4 (Synthesize):** Chế bản file `Generation_DNA.md` với 3 nền tảng (Visual DNA, Product Logic, Technical Excellence). Ghi thêm file `Evaluation_Rules.json` theo đúng Schema JSON bắt buộc.
- **Step 5:** Xác nhận với user.

**(B) `game-art-configurator` (Cập nhật Luật RAG Toàn cục):**
- **Step 1 & 2:** Nhận lệnh của User, tìm Heading Markdown đúng của file `Global_DNA.md` và Inject luật. Ghi file trực tiếp.
- **Step 3 (Embedding):** Kích hoạt script `create_global_embeddings.py` để cập nhật `global_index.json`.
- **Step 4 (Conflict Resolution):** Quét Log Terminal từ Python. Nếu phát hiện Cosine Similarity cảnh báo việc bị *xung đột quy tắc*, ép buộc report cho User.
- **Step 5:** Chấp nhận thay đổi theo logic đã phân giải.

### 3.3. Sản xuất Mỹ thuật - `game-art-orchestrator`
- **Phase 1: RAG & Few-Shot**: 
  - Xác định style, đọc DNA. 
  - Chạy `retrieve_orchestrator_context.py`. Bắt buộc dùng luật do Console Output nhả ra, cấm dùng tay bắt file. 
  - Bơm rule "nền trong suốt". Kích hoạt `generate_image`, trói buộc chỉ được phép **sinh nét sketch đen trắng**. Nhúng Few-Shot image vào parameters.
- **Phase 2: Sequential Rendering**: 
  - Đưa ảnh Sketch / Silhouette dán trực tiếp vào markdown chat xin User duyệt (Human Loop). 
  - Nếu duyệt, nạp prompt lên màu hoàn thiện (Flat Colors/Polish).
  - Đưa xuống cho mô hình VLM Evaluator chấm điểm đối chiếu với `Evaluation_Rules.json`. Trả về Binary Checklist + Score + Định hướng Sửa lỗi.
  - (Luồng rẽ 2.1): Nếu User muốn nắn cọ, dịch Prompt translation theo ý User và sinh lại.
- **Phase 3: Export**: Copy image từ `.gemini` sang thư mục Style, gắn name `YYYY-MM-DD` vào, mở `Generated_Asset_Catalog.md` ghi log 1 hàng mới thông minh.

### 3.4. Kịch bản Âm thanh - `game-audio-prompter`
- **Phase 1: Ingest Local**: Đọc ngầm GDD (Vibe, Gameplay) + Audio_Assets.json.
- **Phase 2: Audio logic Trans**: Áp dụng 5 Quy tắc biến đổi: *Tiếng vọng Reverb, Quy tắc chống nhức tai (Fatigue), Cờ đánh lặp vòng (Loops), Tần số Nhạc, Giới hạn MS thời gian*. Phân rã cho AI bên thứ 3.
- **Phase 3: Book Generation**: Ghi chính thức file `<Project_Name>_Audio_Prompt_Book.md` chuẩn Markdown form: có System Definition, có BGM Asset ID, có SFX Asset Breakdown để tiện việc Copy-paste.
- **Phase 4: Finalize**: Báo cáo URL hoàn tất tài liệu.

### 3.5. Sản xuất Playable Ads - `game-playable-orchestrator`
Hoạt động cực đoan theo cơ chế *Phase-gated* (Dừng ở mỗi phase chờ User bấm nút đi tiếp).
- **Phase 1 (Ingest):** Nạp GDD playable, xác nhận State.
- **Phase 2 (Harvest & Opt):** Gặt hái toàn bộ ảnh, nén Audio, gộp Spritesheet nếu cần.
- **Phase 3 (Dev Phaser 3):** Gõ mã Logic vào `logic_hook.js`. Bị cấm không được sinh lại boiler_plate từ đầu.
- **Phase 4 (Package):** Đổ `logic_hook` và Base64 Assets xuống file template gốc. Auto-compile trình duyệt Headless QA. Kết quả là HTML monolithic cực gắt < 3MB.

### 3.6. App Store Optimization - `game-aso-orchestrator`
- **Phase 1 (Planning):** Chạy Subskill `aso-analyst`, quét RAG từ mã Script `retrieve_aso_style.py` và xuất `ASO_Design_Plan.md`. Request duyệt.
- **Phase 2 (Key Art Polish):** Quét Template Bounding Box bằng ảnh mask đen đặc rỗng. Bơm vào Few-shot. Buộc render dạng khung phác thảo Sketch. Trình User duyệt qua ngõ Checkpoint. Sau khi chốt Sketch, lên màu Polish và chuyển cho bộ VLM Evaluate chấm. Trình User duyệt chốt Key Art.
- **Phase 3 (Batch Prod):** Chạy im lặng Batch-trigger sinh toàn bộ 6 ảnh Screenshot còn lại. Cắt (Crop), Bo viền Reshape chuẩn Store, nạp vào Asset_Catalog. Hoàn tất.

---

## 4. Chuyên đề Chuyên sâu: `game-prototype-orchestrator`

`(Re-integration section based on the README detailed specification)`

**Game Prototype Orchestrator** là "Tổng công trình sư" tạo nguyên mẫu trên **Unity Engine** thông qua giao thức **MCP (Model Context Protocol)**. Khác với Playable Ads, Skill này đặc trưng bởi Triết lý **"Fire-and-forget"** vòng lặp dài (Không pause dọc đường xin ý kiến Code). 

Để không bao giờ mắc lỗi Hallucination khi code project khổng lồ trên Unity, hệ thống băm rã cực độ quy trình 3 Phase:

**1. Phase 1: Ingestion & Verification (`01_Ingestion_Verification.md`)**
- **Cơ chế hoạt động:** Nạp GDD.MD, nạp danh sách thực tế của Asset. Cân đo đong đếm đối chiếu giữa GDD và thực tế.
- **Quản lý Placeholder (Bước then chốt):** Bất cứ Image / Audio nào đang bị rỗng (Thiếu tài sản do Artist chưa vẽ xong), hệ thống tự động sinh các Dummy Prefabs/ Solid Color Primitives thế chỗ. Đây là chốt chặn (Gatekeeper) bắt buộc xong 100% tài sản giả lập mới gỡ rào.

**2. Phase 2: Ahead-of-Time Task Generation (`02_Task_Generation.md`)**
- **Cơ chế hoạt động (Băm nhỏ chống quên mảng nhớ):** Bổ dọc toàn bộ GDD ra thành các Task siêu chi tiết (Micro-level).
- Ghi đè vào lưu trữ vật lý MD File. (Ví dụ: `.agents/tasks/Pack_A_PlayerController.md`). Đội Code Script tuyệt đối không được gõ phím C# khi đội Planing MD File này chưa In (Write_to_file) toàn bộ xuống ổ cứng.

**3. Phase 3: Automated MCP Execution (`03_MCP_Execution.md`)**
- **Cơ chế hoạt động (Thao túng Unity Editor):** AI dùng file `.md` vừa chế tạo làm phễu nạp. Kích hoạt giao thức MCP:
  - Sinh Scripts `Player.cs` theo chuẩn C#.
  - Quản trị Hierarchy Object Paths (Gắn scripts vào object bằng command line).
  - Add RigidBody / Collider vào Unity.
- Tự động dùng `Try-Catch` để bắt dính lỗi rác Re-compiling domain khi thao tác liên tục trên Engine, nếu sập, rollback logic qua MCP lặp lại. Xong báo cáo người dùng vào Play Unity Editor.

---

## 5. Tổng kết & Đánh giá (Retrospective)

**Thành tựu thiết kế hệ thống:**
Sự nghiêm ngặt tuyệt đối thông qua RAG và Băm nhỏ Subskill chính là linh hồn của dự án. AI không bao giờ được tự do suy diễn các lệnh gộp, mọi khối đều phải chạy đập nhịp nhàng như máy cơ khí.

**Hạn chế & Cải thiện tương lai:**
- Giới hạn Audio Context RAG: Có thể cần đưa tiếng ồn về dạng Matrix phổ để gán vào Vector.
- Nén Base64 Playable Ads: Lúc String phình quá to nhúng HTML, có rủi ro chạm ngưỡng Token Limit của LLM.
- **Tương lai MCP Unity:** Thiết kế Map Generator hoàn toàn do Agent thao túng Toạ độ Grid bằng tay qua MCP thay vì chỉ xây dựng System Scripts.
