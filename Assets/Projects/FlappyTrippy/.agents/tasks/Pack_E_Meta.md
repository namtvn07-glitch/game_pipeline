# TASK PACK E: Meta & UI Foundation

## Architecture Rules For This Pack
- UI logic must NOT contain core gameplay data references explicitly. Rely on Events (Event Bus).
- Follow standard Canvas Hierarchy. Canvas Scaler strongly defined as 1080x1920.

---

### Task UI-01 - Khởi tạo HUD Màn Hình Chơi

**Mục tiêu:** Hiển thị điểm số và đồng xu real-time.
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** Canvas system từ Pack A.

**Các bước thao tác trong Editor/Code:**
1. Tạo cụm UI Element cho HUD. Điển hình là khoảng cách sống sót (Distance) và Coin counter.
2. Khóa Canvas Anchor chuẩn xác phía Top màn hình (RectTransform TopCenter).

**GameObject / Prefab cần tạo:**
- HUDRoot -> `/UI/Canvas/HUDRoot`
- ├ TopBar -> `/UI/Canvas/HUDRoot/TopBar`
- ├ ├ Text_Distance -> `/UI/Canvas/HUDRoot/TopBar/Text_Distance`
- ├ ├ Text_Coin -> `/UI/Canvas/HUDRoot/TopBar/Text_Coin`

**Script cần gắn:**
- `TextMeshProUGUI` trên các node Text.
- `HUDPresenter.cs` trên HUDRoot.

**Cách hook reference trên Inspector:**
- Trên `HUDPresenter`:
  - `distanceTextRef` = Link object Text_Distance
  - `coinTextRef` = Link object Text_Coin

**Tiêu chí Done:**
- HUD hiện nổi trên Camera, text placeholder đổi được nội dung. Cấu trúc Panel bám Top mà không trôi khi đổi tỷ lệ màn.

**Output bàn giao:**
- Hệ thống UI Root được cập nhật trong `Run.unity`.

---

### Task PICKUP-01 - Thực thể Đồng Xu (Coin)

**Mục tiêu:** Thúc đẩy Meta Progression (để mang Coin ra mua Skin).
**Người/AI nhận task:** MCP Unity Executor
**Đầu vào:** Layer Pickup đã thiết lập.

**Các bước thao tác trong Editor/Code:**
1. Tạo thực thể 2D Coin.
2. Viết Trigger để ghi nhận đụng độ Player, cộng Event lên EventBus và tự hủy biến mất.

**GameObject / Prefab cần tạo:**
- Coin_Pickup (Quad màu Vàng - Placeholder cho `SPR_Coin`). (Đem vô folder Prefabs)

**Script cần gắn:**
- `CircleCollider2D` (IsTrigger = true)
- `CoinDataModifier.cs`

**Cách hook reference trên Inspector:**
- `coinValue` = 1

**Tiêu chí Done:**
- Player lướt ngang qua vòng tròn va chạm của biến thể. HUD hiển thị Coin tăng lên 1 và Object xóa sổ khỏi Map.

**Output bàn giao:**
- Prefab: `Assets/_Project/Prefabs/PowerUps/PF_Coin.prefab`
