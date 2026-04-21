# TASK PACK C: Endless & Fairness

## Architecture Rules For This Pack
- All scroll behaviors must reference the global `ScrollSystem`.
- Spawn logic must pool all pattern geometries. No `Instantiate()` during runtime gameplay outside of the `PoolService`.
- Fairness configuration must be entirely data-driven via `DifficultyBandSO`.

---

### Task SCROLL-01 - Tích hợp Scroll System

**Mục tiêu:** Mọi vật thể chướng ngại vật được lập trình phải trôi nghịch hướng.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** Cấu trúc `/Systems` từ Pack B.

**Các bước thao tác trong Editor/Code:**
1. Tạo GameObject hệ thống chuyên biệt xử lý Scrolling toàn cục.
2. Xây dựng Script `ScrollSystem.cs` đóng vai trò Controller phân phối vận tốc cho các thực thể Mover.

**GameObject / Prefab cần tạo:**
- ScrollSystem -> `/Systems/ScrollSystem`

**Script cần gắn:**
- `ScrollSystem.cs`

**Cách hook reference trên Inspector:**
- `currentScrollSpeed` = 5.0f (Giá trị mapping từ `global_scroll_speed` GDD)

**Tiêu chí Done:**
- Compile thành công. Bất kỳ đối tượng nào Subscribe vào hệ thống này đều trôi dạt về X-âm. Đo đạc bằng console log không báo NullReference.

**Output bàn giao:**
- Object `/Systems/ScrollSystem`

---

### Task SPAWN-01 - Khởi tạo Data Tầng Difficulty Bands

**Mục tiêu:** Scaler độ khó theo Base Distance chạy.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** Framework ScriptableObject.

**Các bước thao tác trong Editor/Code:**
1. Lập trình Scriptable Object class `DifficultyBandSO`.
2. Tạo Asset thể hiện Band Level 1 (Khởi điểm) với thông số dễ thở.
3. Tạo Asset thể hiện Band Level 2 (Đẳng cấp cao) với vận tốc cuộn nhanh.

**GameObject / Prefab cần tạo:**
- N/A -> Khởi tạo vào Data Storage.

**Script cần gắn:**
- N/A

**Cách hook reference trên Inspector:**
- Tạo file `Assets/_Project/ScriptableObjects/Bands/Band_00_0_200m.asset` -> `scrollMultiplier` = 1.0f
- Tạo file `Assets/_Project/ScriptableObjects/Bands/Band_01_200_500m.asset` -> `scrollMultiplier` = 1.15f

**Tiêu chí Done:**
- Band Asset tồn tại trong thư mục. Có thể mở Inspector kéo thả tham số trọng số tỉ lệ rơi Block.

**Output bàn giao:**
- Các files `.asset` trong `Assets/_Project/ScriptableObjects/Bands/`
