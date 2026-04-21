Mục tiêu của hệ thống là:
User chỉ cần nhập yêu cầu game → AI tự động tạo prototype trong Unity.

🧩 2. Đầu vào (Input)

User cung cấp:

Tên game
Gameplay chính
Platform
Tính năng cần có

👉 User KHÔNG cần biết code hay Unity

🧠 3. Bước 1 – Phân tích tài liệu (AI Plan)

Tôi lấy tài liệu từ GD → đưa vào AI

AI sẽ:

Hiểu gameplay
Xác định feature
Chia thành phase + task

👉 Output:

Implementation Plan
🧱 4. Bước 2 – Tách thành từng bước thực thi

Tôi không để AI làm 1 phát toàn bộ

Tôi yêu cầu AI:

Tách plan thành nhiều file .md
Mỗi file = 1 task cụ thể

Ví dụ:

tạo scene
tạo object
gắn component
setup UI

👉 Mỗi file ghi rõ:

tạo gì
đặt ở đâu
dùng component gì
kiểm tra thế nào
🤖 5. Bước 3 – Cho Antigravity chạy

Antigravity sẽ:

Đọc từng file .md
Hiểu task
Thực hiện tuần tự
🔌 6. Bước 4 – MCP Unity thực thi

Antigravity không thao tác Unity trực tiếp
→ nó dùng mcp-unity

MCP sẽ:

tạo GameObject
gắn component
chỉnh scene
chạy lệnh trong Unity Editor

👉 Nói đơn giản:

MCP là “tay” của AI trong Unity

🧪 7. Bước 5 – Review & kiểm tra

Sau mỗi bước AI sẽ:

check lỗi compile
check scene chạy được chưa
check đúng yêu cầu chưa
📦 8. Kết quả

Output cuối cùng:

Một prototype game chạy được
Scene + Script + UI cơ bản
Báo cáo đã làm gì / còn thiếu gì
🧠 9. Kiến trúc tổng (1 câu chốt)

Hệ thống gồm 3 phần chính:

Brain: Antigravity (AI điều phối)
Process: Workflow + Markdown Task
Execution: MCP Unity + Unity Editor
🔥 10. Câu chốt mạnh (nên nói)

Thay vì để AI tự code một cách mù mờ,
tôi chia toàn bộ quá trình thành từng bước nhỏ bằng markdown,
giúp AI làm việc có kiểm soát và có thể thao tác trực tiếp trong Unity thông qua MCP.

⚠️ 11. (Nếu có thời gian nói thêm)
Phù hợp tạo prototype nhanh
Không thay thế hoàn toàn dev
Cần input rõ ràng + workflow chuẩn
✅ Phiên bản siêu ngắn (1 slide)

Input → Plan → Task (.md) → Antigravity → MCP → Unity → Game