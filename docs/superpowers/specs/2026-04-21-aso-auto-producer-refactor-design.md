# Design Specification: ASO Auto Producer Refactor
Date: 2026-04-21
Topic: Synchronizing `aso-auto-producer` with RAG Architecture and Sequential Rendering Pipelines.

## Goal
Tái cấu trúc (Refactor) kỹ năng `aso-auto-producer` để đồng bộ hoàn toàn với kiến trúc hệ thống hiện đại của dự án `game_pipeline`, cụ thể là tích hợp Vector RAG Search, bộ nguyên tắc nghệ thuật DNA, quy trình duyệt Human-in-The-Loop, VLM Evaluation và Tracking Catalog tự động.

## Architecture & Data Flow

### Phase 1: Analyst & Semantic Context Retrieval
Mục tiêu: Đánh giá tự động sản phẩm ASO và kết nối chính xác vào hệ thống DNA Art Style có sẵn thông qua Semantic RAG Retrieval.
- **Thu thập dữ liệu:** `browser_subagent` tự động truy cập link Store (đối thủ hoặc ref) để trích xuất Cấu trúc ASO (Vibe, Palette, Feature List).
- **RAG Integration:** Kịch bản python phân tích vector được tận dụng để quét thư mục `StyleLibrary`. Nhập "Vibe" vào vector engine và trả về **Top 3 Art Styles** tương thích nhất.
- **User Selection Gate:** Đưa Top 3 gới ý cho User để chọn Style chốt cuối.
- **Plan Generation:** Agent tổng hợp tất cả DNA Rules, RAG Context, và ASO Requirements, đóng gói thành `ASO_Design_Plan.md`.

### Phase 2: Key Art Pipeline (Duyệt tuần tự)
Mục tiêu: Loại bỏ tư duy "chạy mù" hàng loạt bằng việc tập trung dồn sức tạo ra một Anchor Image (Feature Graphic) xuất sắc nhất có thể thông qua Human-in-The-Loop.
- **Sketching:** Gọi engine vẽ khởi tạo duy nhất bản phác thảo (Sketch/Silhouette) của Key Art. Dừng tiến trình và gọi duyệt User. Lặp lại nếu có yêu cầu điều chỉnh.
- **Polishing:** Sau khi chốt Outline, hệ thống push lệnh đổ màu (Flat Colors, Material Polish) có áp dụng Global_DNA. 
- **VLM Evaluation:** Key Art sau khi polish được đưa qua VLM Evaluator so khớp với `Evaluation_Rules.json`. Kết quả sẽ được trình bày để User nghiệm thu lần cuối.

### Phase 3: Batch Production & QA
Mục tiêu: Nhân bản Style từ Anchor Image sang 6 bức ASO còn lại với tốc độ siêu tốc và đúng chuẩn layout.
- **Template Binding:** Lấy Anchor Image kết hợp với lưới UI Layout tĩnh (Icon 512, Screenshot 1600x900) nạp thẳng vào thông số `ImagePaths` của generator. Tự động chạy ngầm sinh 6 biến thể.
- **Automated QA:** Pipeline auto-check khung ảnh trả về. Cắt cúp chính xác từng pixel bằng script `resize_image.py`.
- **Log Catalog:** Chuyển bộ ảnh hoàn thiện về `Assets/GameArtist/Generated/ASO_Projects/<Project_Folder>/`. Parse và inject thông tin từng ảnh vào trong `Generated_Asset_Catalog.md`.

## User Review Required
- File thiết kế này cần được User xác nhận là chuẩn chỉ định luật của Game Pipeline. Bất cứ sai số nào về đường dẫn hoặc tên quy trình cần được báo lại để fix.

## Open Questions
- Chưa có. Quá trình đã hoàn thiện rõ ràng qua các câu hỏi làm rõ ở bước Brainstorming.
