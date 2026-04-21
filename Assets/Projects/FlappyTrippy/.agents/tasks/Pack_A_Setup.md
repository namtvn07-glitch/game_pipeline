# TASK PACK A: Setup Project & Data Layer

## Architecture Rules For This Pack
- Create folder structures exactly as instructed.
- Ensure all Boot services and Data layer ScriptableObjects (SOs) are created before runtime objects.
- Do NOT use `FindObjectOfType`.
- Wait for C# compilation when generating new scripts.

---

### Task SETUP-01 - Tạo Cấu trúc Thư mục và File C#

**Mục tiêu:** Xây dựng khung nền móng vững chắc cho dự án để các module độc lập.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** Project trống

**Các bước thao tác trong Editor/Code:**
1. Tạo thư mục `Assets/_Project/` nếu chưa có.
2. Bên trong tạo các folder: `Art/Sprites`, `Prefabs/Core`, `Prefabs/Projectiles`, `Scripts/Data`, `Scripts/Gameplay`, `ScriptableObjects/Player`, `Scenes/`.
3. Tạo file C# `Assets/_Project/Scripts/Data/PlayerConfigSO.cs` kế thừa ScriptableObject.
4. WAIT FOR COMPILE (CRITICAL). Cấm qua bước tiếp theo nếu Unity đang reload domain.

**GameObject / Prefab cần tạo:**
- N/A -> Không áp dụng.

**Script cần gắn:**
- N/A

**Cách hook reference trên Inspector:**
- N/A

**Tiêu chí Done:**
- Thư mục được tạo đầy đủ. Compiler không báo lỗi file C#.

**Output bàn giao:**
- Mạng lưới thư mục `Assets/_Project/`
- `Assets/_Project/Scripts/Data/PlayerConfigSO.cs`

---

### Task DATA-01 - Khởi tạo ScriptableObject

**Mục tiêu:** Tạo các asset Data Driven để thiết lập Gameplay.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** SETUP-01 (Script SO đã biên dịch)

**Các bước thao tác trong Editor/Code:**
1. Create Asset (Instantiate SO) từ class `PlayerConfigSO`.
2. Đặt tên file là `Player_Default.asset`.
3. Lưu tại ổ cứng: `Assets/_Project/ScriptableObjects/Player/`.
4. Mở Inspector của file này và chỉnh thông số.

**GameObject / Prefab cần tạo:**
- N/A -> (Tạo Asset file, không tạo trong Hierarchy)

**Script cần gắn:**
- N/A

**Cách hook reference trên Inspector:**
- `gravityScale` = 1.5
- `tapImpulse` = 12

**Tiêu chí Done:**
- `Player_Default.asset` xuất hiện trong đúng thư mục và lưu giá trị.

**Output bàn giao:**
- `Assets/_Project/ScriptableObjects/Player/Player_Default.asset`
