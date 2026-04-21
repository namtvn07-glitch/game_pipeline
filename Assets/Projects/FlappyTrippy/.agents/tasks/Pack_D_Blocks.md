# TASK PACK D: Block Expansion

## Architecture Rules For This Pack
- Implement Inheritance: Build a `PF_Block_Base` first. Derivate it into 6 specific types.
- Ensure all blocks utilize interfaces like `IDamageable`.

---

### Task BLOCK-01 - Quy chuẩn Block Cơ bản (Base Class)

**Mục tiêu:** Tạo Template gốc cho mọi khối kiến trúc cản đường.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** Framework ScriptableObject.

**Các bước thao tác trong Editor/Code:**
1. Tạo một Quad Object.
2. Gắn BoxCollider2D. Bật IsTrigger = true.
3. Viết hệ thống `BlockHealth.cs` implements `IDamageable`. Nhận sát thương và trừ máu.
4. Đóng gói object này thành Base Prefab.

**GameObject / Prefab cần tạo:**
- Block_Base -> `/Gameplay/BlockRoot/Block_Base` (Tạo xong move vào Prefabs)

**Script cần gắn:**
- `BoxCollider2D`
- `BlockHealth.cs`
- `BlockPresenter.cs`

**Cách hook reference trên Inspector:**
- Trên `BlockHealth.cs` -> `maxHP` = 10f

**Tiêu chí Done:**
- Object bị đạn va phải tự động gọi hàm Deduct HP theo Trigger event.

**Output bàn giao:**
- Prefab tĩnh `Assets/_Project/Prefabs/Blocks/PF_Block_Base.prefab`

---

### Task BLOCK-02 - Đột biến Block: Metal (Kim Loại)

**Mục tiêu:** Loại block chống lại mọi sát thương và độ bật nảy.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** `PF_Block_Base`.

**Các bước thao tác trong Editor/Code:**
1. Tạo một Prefab Variable (Variant) mới từ `PF_Block_Base`
2. Kích hoạt cờ vô địch sát thương.

**GameObject / Prefab cần tạo:**
- Block_Metal (Kéo thả từ Base)

**Script cần gắn:**
- Giữ nguyên Base, gán thêm thuộc tính cản vật lý. `PhysicsMaterial2D(Bouncy)`.

**Cách hook reference trên Inspector:**
- `indestructible` = true
- Đổi màu Quad Material sang Xám/Trắng kim loại bằng lệnh API Renderer.

**Tiêu chí Done:**
- Không chết khi đạn bắn trung, phản đạn. Inspector thể hiện indestructible là dấu V.

**Output bàn giao:**
- Prefab mới: `Assets/_Project/Prefabs/Blocks/PF_Block_Metal.prefab`
