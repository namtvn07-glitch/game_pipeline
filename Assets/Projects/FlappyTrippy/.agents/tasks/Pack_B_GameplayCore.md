# TASK PACK B: Gameplay Core (Player & Mechanics)

## Architecture Rules For This Pack
- Do not instantiate random empty primitives unless specifically creating prototypes.
- Ensure strict absolute Hierarchy Paths.
- Hook dependencies correctly from `ScriptableObjects` established in Pack A.

---

### Task RUN-01 - Dựng Hierarchy Scene Khung

**Mục tiêu:** Thiết lập cấu trúc lõi trong Scene `Run.unity` theo thiết kế GDD.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** Scene trống.

**Các bước thao tác trong Editor/Code:**
1. Xóa toàn bộ Hierarchy mặc định ở Scene hiện tại.
2. Tạo Main Camera cấu hình Orthographic, màu Black, size 5.
3. Tạo tập hợp Empty GameObjects theo mô hình Absolute Paths chuẩn.

**GameObject / Prefab cần tạo:**
- Main Camera -> `/Main Camera`
- ├ Background -> `/Main Camera/Background` (PrimitiveType.Quad làm nền ảo)
- Systems -> `/Systems`
- Gameplay -> `/Gameplay`
- ├ PlayerRoot -> `/Gameplay/PlayerRoot`
- ├ BlockRoot -> `/Gameplay/BlockRoot`

**Script cần gắn:**
- Trên `Main Camera` -> Camera (Default)

**Cách hook reference trên Inspector:**
- `Camera.orthographic` = true
- `Camera.backgroundColor` = #000000

**Tiêu chí Done:**
- Khung hierarchy đã sạch và có đủ các rễ cây (Root) cần thiết để spawn object.

**Output bàn giao:**
- Cấu trúc Hierarchy trong `Run.unity`

---

### Task PLAYER-01 - Tạo Prefab Player Cơ Bản

**Mục tiêu:** Setup thực thể PlayerController và gắn Physics đúng chuẩn GDD.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** `Player_Default.asset` từ Pack A.

**Các bước thao tác trong Editor/Code:**
1. Khởi tạo một GameObject dạng Quad (Để test prototype khi chưa có Art).
2. Xóa MeshCollider 3D tụt lại mặc định của Quad.
3. Chỉnh scale khối Player.

**GameObject / Prefab cần tạo:**
- PF_Player -> Sinh tự do vào `/Gameplay/PlayerRoot/PF_Player`

**Script cần gắn:**
- `SpriteRenderer` (Thay thế cho Quad default mesh)
- `Rigidbody2D`
- `BoxCollider2D`
- (Scripts custom sau khi dev C#) `PlayerController`

**Cách hook reference trên Inspector:**
- `Rigidbody2D.gravityScale` = 1.5
- `Rigidbody2D.freezeRotation` = Z (Bật rigid constraint)
- (Trên PlayerController.cs) `PlayerController.configSO` = Link Asset tới `Assets/_Project/ScriptableObjects/Player/Player_Default.asset`

**Tiêu chí Done:**
- Object Player có thể rơi xuống nảy lên trong Scene nhờ Engine vật lý. Inspector gắn đúng Reference của SO.

**Output bàn giao:**
- GameObject Player trong Scene hiện tại.
