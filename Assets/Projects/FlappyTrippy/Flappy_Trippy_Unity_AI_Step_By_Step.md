# Flappy Trippy - Unity Step-by-Step AI Production Guide

> Mục tiêu của tài liệu này: chia nhỏ việc làm game thành các bước cực cụ thể để có thể giao từng phần cho AI hoặc cho từng dev/art/UI trong team.  
> Phạm vi tài liệu: **Unity 6.000.4.2f1**, mobile portrait, 2D endless runner + shoot'em up hybrid.

---

## 1. Bối cảnh thiết kế cần bám

Game gốc là endless mobile màn dọc, người chơi **tap để giữ độ cao và đồng thời bắn phá vật cản**. Hệ thống triển khai cần ưu tiên:
1. cảm giác điều khiển ổn,
2. phá block đọc được,
3. spawn pattern không vô nghiệm,
4. difficulty tăng theo distance band,
5. meta làm sau khi gameplay lõi đã chắc.

Theo tài liệu trước đó:
- Core gameplay phải ưu tiên `Player, Bullet, Block, DamageResolver, CollisionRouter` và scene sandbox để test độc lập.
- Run systems cần `ScrollSystem, SpawnDirector, PatternLibrary, DifficultyBandResolver`, toàn bộ nên data-driven bằng config.
- Prototype phải chứng minh được 4 thứ: tap feel tốt, bắn-phá block đọc được, pattern không vô nghiệm, restart cực nhanh.
- MVP cần đủ 7 block, chapter milestone, shop, mission, spin, ads, analytics.

---

## 2. Nguyên tắc dùng tài liệu này để giao cho AI

Mỗi task trong tài liệu này đều có cùng format:
- **Mục tiêu**
- **Người/AI nhận task**
- **Đầu vào**
- **Các bước thao tác trong Unity Editor**
- **GameObject / Prefab cần tạo**
- **Script cần gắn**
- **Cách hook reference trên Inspector**
- **Tiêu chí Done**
- **Output bàn giao**

### 2.1. Cách giao task cho AI
Khi giao cho AI coder hoặc AI agent, dùng prompt kiểu này:

```md
Bạn hãy làm Task U-STEP-01 trong Unity project Flappy Trippy.
Bám đúng structure folder, tên object, prefab, scene, component như tài liệu.
Không tự ý đổi architecture.
Sau khi xong phải trả về:
1. file/script đã tạo
2. danh sách object đã tạo trong scene
3. các serialized field cần designer set tay
4. checklist test thủ công
```

### 2.2. Rule chung cho toàn dự án
- Không code trực tiếp logic gameplay vào UI script.
- Không dùng `FindObjectOfType` trong flow chính.
- Không hardcode stat block/pattern trong MonoBehaviour nếu stat đó có thể tune.
- Mọi prefab spawn runtime phải có pool hoặc sẵn sàng để pool hóa.
- Mọi config gameplay nên đi qua ScriptableObject.

---

## 3. Unity version và package cần dùng

### 3.1. Unity
- **Unity 6.000.4.2f1**
- Template: **2D**

### 3.2. Package khuyến nghị
Mở:b
- `Window > Package Manager`

Cài:
- Input System
- TextMeshPro
- 2D Sprite
- Addressables
- Unity Analytics hoặc analytics SDK stub

### 3.3. Player Settings ban đầu
Mở:
- `Edit > Project Settings`

Thiết lập:
- `Player > Resolution and Presentation > Default Orientation = Portrait`
- `Active Input Handling = Input System Package` hoặc `Both`
- `Time.fixedDeltaTime = 0.02`

**Done khi:** build trắng Android chạy được, game hiện đúng portrait.

---

## 4. Cấu trúc folder chuẩn

Trong `Assets/`, tạo:

```text
Assets/
  _Project/
    Art/
      Sprites/
      VFX/
      UI/
      Audio/
    Materials/
    Prefabs/
      Core/
      Blocks/
      Projectiles/
      UI/
      Environment/
      PowerUps/
    Scenes/
    Scripts/
      Boot/
      Core/
      Gameplay/
        Player/
        Combat/
        Blocks/
        Spawn/
        Run/
      UI/
      Meta/
      Data/
      Tools/
    ScriptableObjects/
      Player/
      Blocks/
      Patterns/
      Bands/
      PowerUps/
      Economy/
```

### Task SETUP-01 - Tạo folder structure
**Người/AI nhận task:** Tech Lead / AI Setup

**Các bước trong Editor:**
1. Mở Project window.
2. Chuột phải `Assets > Create > Folder`.
3. Tạo lần lượt các folder như trên.
4. Đảm bảo tất cả tên folder thống nhất.

**Done khi:** tree folder giống spec.

---

## 5. Scene list cần có

Tạo các scene trong `Assets/_Project/Scenes/`

```text
Boot.unity
Home.unity
FTUE.unity
Run.unity
Sandbox_Run.unity
Meta_Test.unity
```

### Task SETUP-02 - Tạo scenes
**Các bước:**
1. `File > New Scene`
2. Save scene vào đúng folder.
3. Tạo đủ 6 scene.
4. Vào `Build Settings`
5. Add tất cả scene theo thứ tự:
   - Boot
   - Home
   - FTUE
   - Run
   - Sandbox_Run
   - Meta_Test

**Done khi:** build settings có đầy đủ scene, Boot đứng đầu.

---

## 6. Architecture runtime tối thiểu

### 6.1. Bootstrap layer
Tạo các script:
- `Bootstrapper.cs`
- `GameServices.cs`
- `SceneFlowService.cs`
- `SaveService.cs`
- `AudioService.cs`
- `AnalyticsService.cs`

### Task BOOT-01 - Tạo Bootstrap scene
**GameObject cần tạo trong `Boot` scene**
- `__App`
  - `Bootstrapper`
  - `Services`
- `EventSystem`

**Cách làm**
1. Mở `Boot.unity`
2. Tạo empty object tên `__App`
3. Reset Transform
4. Gắn script `Bootstrapper`
5. Tạo child empty tên `Services`
6. Trong `Bootstrapper`, khởi tạo service cơ bản
7. Khi xong boot, chuyển sang `Home` hoặc `FTUE` tùy save

**Done khi:** bấm Play từ Boot sẽ vào Home tự động.

---

## 7. Data layer - ScriptableObject trước khi làm gameplay

### 7.1. ScriptableObject cần tạo
- `PlayerConfigSO`
- `WeaponConfigSO`
- `BlockConfigSO`
- `PatternDefinitionSO`
- `DifficultyBandSO`
- `PowerUpConfigSO`

### Task DATA-01 - Tạo base class config
**Các bước**
1. Trong `Scripts/Data`, tạo các class SO với `[CreateAssetMenu]`
2. Compile
3. Trong folder `ScriptableObjects/`, tạo asset mẫu:
   - `Player_Default`
   - `Weapon_Default`
   - `Block_Basic`
   - `Band_00`
   - `PowerUp_RapidFire`

**Field gợi ý**
`PlayerConfigSO`
- gravityScale
- tapImpulse
- maxFallSpeed
- minY
- maxY

`WeaponConfigSO`
- fireRate
- projectileSpeed
- baseDamage
- spawnPerTap

`BlockConfigSO`
- blockType
- maxHP
- armorMultiplier
- shieldHP
- moveAmplitude
- moveSpeed
- explosionDamage
- indestructible

`DifficultyBandSO`
- bandIndex
- distanceStart
- distanceEnd
- scrollSpeedMultiplier
- hpMultiplier
- availablePatternTags
- powerUpChance

**Done khi:** designer có thể tạo asset config mà không sửa code.

---

## 8. Run scene - dựng khung gameplay trước

### 8.1. Hierarchy chuẩn cho `Run.unity`

```text
RunScene
  Main Camera
  Systems
    RunInstaller
    ScrollSystem
    SpawnDirector
    DifficultyBandResolver
    PoolService
    RunStateController
  Gameplay
    PlayerRoot
    ProjectileRoot
    BlockRoot
    PickupRoot
    FXRoot
  UI
    Canvas
      HUDRoot
      PausePanel
      ResultPanel
  Bounds
    TopBound
    BottomBound
    LeftKillZone
    RightDespawnZone
```

### Task RUN-01 - Dựng scene khung
**Các bước trong Editor**
1. Mở `Run.unity`
2. Tạo object theo hierarchy trên.
3. `Main Camera`
   - Projection = Orthographic
4. Tạo `Canvas`
   - Render Mode = Screen Space Overlay
   - Canvas Scaler = Scale With Screen Size
   - Reference Resolution = `1080 x 1920`
5. Tạo các bound bằng empty object + BoxCollider2D trigger

**Done khi:** scene có đủ các root object.

---

## 9. Player system

### 9.1. Prefab Player
Tạo prefab: `PF_Player`

### Cấu trúc prefab
```text
PF_Player
  Visual
  FirePoint
  Hitbox
```

### Component trên root
- `PlayerController`
- `PlayerMotor`
- `PlayerWeaponLink`
- `Rigidbody2D`

### Task PLAYER-01 - Tạo prefab player
**Các bước**
1. Trong `Run.unity`, tạo object tên `PF_Player`
2. Add `SpriteRenderer`
3. Add `Rigidbody2D`
   - Gravity Scale = tạm 1
   - Freeze Rotation Z
4. Tạo child `FirePoint`
5. Tạo child `Hitbox`
6. Add `CircleCollider2D` hoặc `BoxCollider2D`
7. Tạo script:
   - `PlayerController.cs`
   - `PlayerMotor.cs`
   - `PlayerWeaponLink.cs`
8. Gắn 3 script lên root
9. Kéo object vào folder `Prefabs/Core/`
10. Kéo prefab trở lại scene

**Hook Inspector**
- `PlayerController`
  - inputReader
  - motorRef
  - weaponRef
- `PlayerMotor`
  - rigidbody2D
  - playerConfig
- `PlayerWeaponLink`
  - firePoint
  - weaponController

**Done khi:** player rơi do gravity và nhận tap input.

---

## 10. Input system - tap để bay và bắn

### Task PLAYER-02 - Thiết lập input tap
**Các bước**
1. `Assets > Create > Input Actions`
2. Tên: `PlayerInputActions`
3. Tạo Action Map: `Gameplay`
4. Tạo Action: `Tap`
5. Binding:
   - `<Touchscreen>/primaryTouch/tap`
   - `<Mouse>/leftButton`
6. Generate C# class
7. Tạo script `InputReader.cs`
8. Trong `Run.unity`, tạo object `InputRoot`
9. Gắn `InputReader`
10. Nối `InputReader` vào `PlayerController`

**Flow mong muốn**
- Tap -> `PlayerController`
- `PlayerMotor.ApplyTapImpulse()`
- `WeaponController.FireOnTap()`

**Done khi:** mỗi tap làm player nảy lên và gọi hàm fire.

---

## 11. Weapon và projectile

### Task COMBAT-01 - Tạo projectile
**Prefab:** `PF_Projectile_Default`

**Các bước**
1. Tạo object `PF_Projectile_Default`
2. Add `SpriteRenderer`
3. Add `CircleCollider2D` và bật `Is Trigger`
4. Tạo script `Projectile.cs`
5. Tạo script `WeaponController.cs`
6. Add `Projectile` vào prefab
7. Kéo vào `Prefabs/Projectiles/`

**Field Inspector cho Projectile**
- speed
- damage
- lifeTime
- pierceCount

**Done khi:** projectile bay thẳng và tự despawn.

### Task COMBAT-02 - Gắn weapon cho player
1. Gắn `WeaponController` lên player
2. Set:
   - projectilePrefab = `PF_Projectile_Default`
   - firePoint = child `FirePoint`
   - weaponConfig = `Weapon_Default`

**Done khi:** tap sẽ spawn projectile tại FirePoint.

---

## 12. Block system

Các block cần làm theo thứ tự:
1. Basic
2. Armor
3. Moving
4. Shield
5. Explosive
6. Metal
7. Ghost

### Task BLOCK-01 - Tạo block base
**Prefab:** `PF_Block_Base`

**Cấu trúc**
```text
PF_Block_Base
  Visual
  Hitbox
```

**Component root**
- `BlockBase`
- `BlockHealth`
- `BlockPresenter`
- `Collider2D`

**Các bước**
1. Tạo object `PF_Block_Base`
2. Add `SpriteRenderer`
3. Add `BoxCollider2D`
4. Tạo script:
   - `IDamageable.cs`
   - `DamagePacket.cs`
   - `BlockBase.cs`
   - `BlockHealth.cs`
   - `BlockPresenter.cs`
5. Gắn script lên root
6. Tạo config `Block_Basic`
7. Kéo prefab vào `Prefabs/Blocks/`

**Done khi:** projectile chạm block sẽ trừ HP.

### Task BLOCK-02 - Basic Block
- Duplicate `PF_Block_Base` thành `PF_Block_Basic`
- Gán `Block_Basic` config
- Test trong `Sandbox_Run`

### Task BLOCK-03 - Armor Block
- Duplicate prefab base -> `PF_Block_Armor`
- Tạo config `Block_Armor`
- damage cuối = `baseDamage * armorMultiplier`

### Task BLOCK-04 - Moving Block
- Duplicate prefab -> `PF_Block_Moving`
- Add `BlockMover`
- Dùng `Mathf.Sin` di chuyển trục Y

### Task BLOCK-05 - Shield Block
- Duplicate prefab -> `PF_Block_Shield`
- Add child `ShieldVisual`
- Có `shieldHP` và `coreHP`

### Task BLOCK-06 - Explosive Block
- Duplicate prefab -> `PF_Block_Explosive`
- Add `ExplosionOnDeath`
- Khi chết gây AoE damage

### Task BLOCK-07 - Metal Block
- Duplicate prefab -> `PF_Block_Metal`
- `indestructible = true`

### Task BLOCK-08 - Ghost Block
- Duplicate prefab -> `PF_Block_Ghost`
- Add `GhostPhaseController`
- Bật/tắt collider theo phase

---

## 13. Collision matrix và layer

Tạo layer:
- Player
- PlayerProjectile
- Block
- Pickup
- Bound

### Task PHYSICS-01 - Setup collision matrix
1. `Edit > Project Settings > Physics 2D`
2. Tắt va chạm không cần
3. Giữ:
   - Projectile <-> Block
   - Player <-> Block
   - Player <-> Pickup

**Done khi:** không có va chạm rác.

---

## 14. Scroll system

### Task RUN-02 - Tạo ScrollSystem
**Mục tiêu:** obstacle tiến từ phải sang trái.

**Cách làm**
1. Tạo object `Systems/ScrollSystem`
2. Add script `ScrollSystem`
3. Expose `currentScrollSpeed`
4. Mọi block/pickup đọc tốc độ từ system này

**Done khi:** block sinh ra ở phải và trôi sang trái ổn định.

---

## 15. Spawn director và pattern library

### Task SPAWN-01 - Tạo pattern definition data
Tạo 5 pattern đầu:
- Single Basic
- Double Basic gap rộng
- Basic + Armor
- Narrow passage
- Recovery empty window

**Done khi:** designer có thể author pattern bằng data.

### Task SPAWN-02 - Tạo SpawnDirector
**Script**
- `SpawnDirector.cs`
- `PatternSpawner.cs`
- `DifficultyBandResolver.cs`

**Các bước**
1. Gắn `SpawnDirector` lên object `Systems/SpawnDirector`
2. Set:
   - patternLibrary
   - bandResolver
   - spawnAnchor
   - blockRoot
3. Theo khoảng cách:
   - hỏi band hiện tại
   - chọn pattern hợp lệ
   - spawn pattern
4. Thêm anti-repeat
5. Thêm recovery cadence

**Done khi:** run có thể chơi 60 giây với pattern đổi hợp lý.

---

## 16. Difficulty band - tăng khó nhưng không vô nghiệm

Block phức tạp unlock dần:
- Armor từ band 2
- Moving + Shield từ band 3
- Explosive + Metal từ band 4
- Ghost từ band 5+

### Task BALANCE-01 - Tạo band config
Tạo asset:
- `Band_00_0_200m`
- `Band_01_200_500m`
- `Band_02_500_1000m`
- `Band_03_1000_1800m`
- `Band_04_1800_3000m`
- `Band_05_3000_4500m`
- `Band_06_4500_plus`

**Mỗi band chứa**
- speed multiplier
- hp multiplier
- allowed block types
- pattern weights
- power-up chance
- recovery frequency

### Task BALANCE-02 - Fairness guard
**Rule tối thiểu**
- Luôn còn ít nhất 1 lời giải.
- Không spawn Metal Block thành tường kín.
- Không dồn 2 spike pattern vượt reaction window liên tiếp.

**Done khi:** band 0-3 không có pattern impossible.

---

## 17. Sandbox scene - bắt buộc phải có

### Task TOOL-01 - Dựng Sandbox_Run
**Hierarchy**
```text
Sandbox_Run
  Main Camera
  Systems
    SandboxController
    SpawnDirector
    ScrollSystem
  Gameplay
    PlayerRoot
    BlockRoot
  UI
    SandboxCanvas
      PatternDropdown
      BandDropdown
      SpawnButton
      GodModeToggle
      SpeedSlider
      HPScaleSlider
```

**Các bước**
1. Copy `Run.unity` thành `Sandbox_Run`
2. Xóa UI thừa
3. Tạo `SandboxController`
4. Add các control debug:
   - force band
   - chọn pattern
   - spawn 1 pattern
   - freeze scroll
   - god mode

**Done khi:** designer có thể ép spawn pattern bất kỳ.

---

## 18. HUD và UI cơ bản

### Task UI-01 - Tạo HUDRoot
**Prefab:** `PF_HUDRoot`

**Cấu trúc**
```text
HUDRoot
  TopBar
    DistanceText
    CoinText
    PowerUpSlot
    PauseButton
```

**Các bước**
1. Tạo Canvas trong `Run`
2. Tạo `HUDRoot`
3. Add TextMeshProUGUI cho distance/coin
4. Add button pause
5. Tạo `HUDPresenter.cs`

**Done khi:** HUD update theo gameplay.

### Task UI-02 - ResultPanel
**Mục tiêu:** sau khi fail, hiện best distance, retry, revive, coin nhận.

**Cách làm**
1. Tạo panel `ResultPanel`
2. Add:
   - BestDistanceText
   - CurrentDistanceText
   - RetryButton
   - ReviveButton
   - HomeButton
3. Tạo script `ResultPanelPresenter.cs`
4. Mặc định panel inactive
5. Khi `RunState = GameOver` thì hiện panel

**Done khi:** fail xong có thể retry nhanh.

---

## 19. Coin, pickup, power-up

### Task PICKUP-01 - Coin
**Prefab:** `PF_Coin`
- SpriteRenderer
- CircleCollider2D trigger
- `CoinPickup.cs`

**Done khi:** player chạm coin, coin biến mất, HUD tăng.

### Task POWERUP-01 - Framework
**Script**
- `PowerUpType.cs`
- `PowerUpPickup.cs`
- `PowerUpManager.cs`
- `TimedBuff.cs`

**Flow**
1. Player ăn pickup
2. `PowerUpManager` nhận buff
3. Buff có duration
4. HUD hiển thị icon + timer
5. Hết thời gian thì revert stat

### Task POWERUP-02 - Rapid Fire
- tăng fire rate x2-x3
- duration 5s

### Task POWERUP-03 - Multishot
- bắn 2-3 lane

### Task POWERUP-04 - Pierce Shot
- projectile xuyên 1-2 target

---

## 20. FTUE scene

### Task FTUE-01 - Dựng FTUE 5 bước
**Các bước đề xuất**
1. Bước 1: tap để bay qua khoảng trống
2. Bước 2: tap vào block basic để hiểu tap = bắn
3. Bước 3: né + phá cụm block đơn giản
4. Bước 4: nhặt power-up
5. Bước 5: hoàn thành đoạn ngắn và sang Home/Run

**Done khi:** người mới hoàn thành < 90 giây.

---

## 21. Home scene và meta tối thiểu

### Task META-01 - Home scene
**Hierarchy**
```text
Home
  Canvas
    HomeRoot
      PlayButton
      ShopButton
      SpinButton
      MissionButton
      ChapterPanel
      CurrencyBar
```

**Done khi:** từ Home vào Run, mở panel shop/spin/mission được.

### Task META-02 - Shop
- tab Skin
- tab Bullet
- equip / locked / unlock condition

### Task META-03 - Lucky Spin
- bấm spin
- random reward theo bảng
- show popup reward

### Task META-04 - Mission
- daily mission
- claim reward
- persist save

---

## 22. Save system

### Task PLATFORM-01 - Save data
**Script**
- `SaveData.cs`
- `SaveService.cs`

**Field save tối thiểu**
- bestDistance
- totalCoins
- unlockedSkins
- equippedSkinId
- unlockedBullets
- equippedBulletId
- chapterProgress
- spinState
- missionState
- ftueCompleted

**Done khi:** thoát game vào lại vẫn còn progress.

---

## 23. Analytics hook

Event bắt buộc:
- run_start
- run_end
- distance_reached
- death_reason
- pattern_id_at_death
- chapter_unlock
- mission_complete
- revive_offer_seen
- revive_offer_accepted
- coins_earned
- coins_spent
- spin_used
- ad_reward_claimed

### Task DATA-02 - Event bus
**Script**
- `AnalyticsEventBus.cs`
- `EventNames.cs`

**Done khi:** event gọi tập trung.

---

## 24. Object pooling

### Task PERF-01 - PoolService
**Script**
- `PoolService.cs`
- `PooledObject.cs`

**Prewarm**
- projectile
- block basic
- coin
- common fx

**Done khi:** run dài không spike GC rõ rệt.

---

## 25. Editor workflow cụ thể cho từng loại thành viên

### 25.1. Cho AI/Dev gameplay
Làm việc chủ yếu ở:
- `Run`
- `Sandbox_Run`
- `FTUE`

### 25.2. Cho AI/UI
Làm việc ở:
- `Home`
- `Run`
- `Meta_Test`

### 25.3. Cho AI/Designer technical
Làm việc ở:
- `Sandbox_Run`
- `ScriptableObjects/Bands`
- `ScriptableObjects/Patterns`
- `ScriptableObjects/Blocks`

---

## 26. Template task giao cho AI theo từng bước

### Task Pack A - Setup project
- Khởi tạo project
- Tạo folder structure
- Tạo scenes
- Setup build settings portrait

### Task Pack B - Gameplay core
- Player movement
- Shooting
- Basic block
- Scroll
- Game over + retry

### Task Pack C - Endless & fairness
- Difficulty bands
- Pattern library
- Spawn director
- Sandbox tools

### Task Pack D - Block expansion
- Armor
- Moving
- Shield
- Explosive
- Metal
- Ghost

### Task Pack E - Meta
- HUD
- Coin
- Power-up framework
- FTUE
- Home
- Shop
- Spin
- Mission
- Save
- Analytics

---

## 27. Checklist review cho từng task AI trả về

```md
# Task ID
PLAYER-01

## File đã tạo/sửa
- Assets/_Project/Scripts/Gameplay/Player/PlayerController.cs
- Assets/_Project/Scripts/Gameplay/Player/PlayerMotor.cs
- Assets/_Project/Prefabs/Core/PF_Player.prefab

## Object đã tạo trong scene
- Run/Gameplay/PlayerRoot/PF_Player
- Run/Systems/InputRoot

## Serialized fields cần set
- PlayerMotor.playerConfig = Player_Default
- WeaponController.weaponConfig = Weapon_Default
- WeaponController.projectilePrefab = PF_Projectile_Default

## Test thủ công
- Tap 1 lần: player nảy lên
- Tap liên tục: player giữ độ cao
- Tap đồng thời spawn projectile
- Không có null reference

## Trạng thái
- Done / Blocked
```

---

## 28. Acceptance criteria toàn dự án

1. Người chơi mới hiểu tap để bay và bắn sau 1-2 lần thử.
2. Có ít nhất 1 run gameplay 60 giây không crash.
3. Band 0-500m không có pattern vô nghiệm.
4. Restart sau fail rất nhanh.
5. Designer chỉnh được tap force, gravity, speed, basic HP, multiplier, pattern weight mà không sửa code.
6. Build mobile low-end vẫn ổn định.
7. Meta không làm hỏng flow core.

---

## 29. Kết luận

Thứ tự thực hiện chuẩn nên là:

1. Setup project + scene + config
2. Player feel
3. Shoot + projectile
4. Basic block + damage
5. Scroll + game over + retry
6. Spawn director + pattern + band
7. Sandbox tools
8. Thêm block đặc biệt
9. HUD + coin + power-up
10. FTUE
11. Home + shop + spin + mission
12. Save + analytics + ads
13. QA fairness + performance + soft launch prep

Chỉ khi **feel control** và **fairness pattern** đã ổn thì mới nên đẩy mạnh phần meta.
