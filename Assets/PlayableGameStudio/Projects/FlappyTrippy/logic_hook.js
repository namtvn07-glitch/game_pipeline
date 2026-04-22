class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
    }

    create() {
        this.sys.game.canvas.style.display = 'block';
        this.sys.game.canvas.style.margin = '0 auto';

        const w = this.scale.width;
        const h = this.scale.height;

        let bgImg = this.textures.get('SPR_BG_Layer1').get();
        let bgScale = Math.max(w / bgImg.width, h / bgImg.height);
        this.bg = this.add.tileSprite(w / 2, h / 2, w / bgScale, h / bgScale, 'SPR_BG_Layer1').setScale(bgScale);

        this.player = this.physics.add.sprite(w * 0.2, h / 2, 'SPR_Trippybara_Idle').setScale(0.25);
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.5);
        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (body.gameObject === this.player && (up || down)) {
                this.gameOver();
            }
        });

        // Setup groups
        this.pillars = this.physics.add.group();
        this.bullets = this.physics.add.group();

        // Collisions
        this.physics.add.collider(this.player, this.pillars, this.gameOver, null, this);
        this.physics.add.overlap(this.bullets, this.pillars, this.hitBlock, null, this);

        // State variables
        this.isStarted = false;
        this.isGameOver = false;
        this.score = 0;
        this.player.body.setAllowGravity(false);
        this.physics.world.gravity.y = 1800; // snappier gravity

        // UI
        const textStyle = { fontFamily: 'Impact, sans-serif', fontSize: '70px', fill: '#FFD700', stroke: '#5A3A22', strokeThickness: 8 };
        this.scoreText = this.add.text(w / 2, 80, '0', textStyle).setOrigin(0.5).setShadow(4, 4, '#000', 0, true, true);

        this.instructions = this.add.text(w / 2, h / 2 - 100, 'TAP TO SHOOT\n& FLY!', {
            fontFamily: 'Impact, sans-serif', fontSize: '70px', fill: '#00FFFF', stroke: '#004444', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5).setShadow(4, 4, '#000', 2, true, true);

        this.input.on('pointerdown', this.tapAction, this);

        this.spawnTimer = 0;
        this.nextSpawn = 1500;

        // End condition variables
        this.survivalTime = 0;
    }

    tapAction() {
        if (this.isGameOver) return;

        if (!this.isStarted) {
            this.isStarted = true;
            this.instructions.destroy();
            this.player.body.setAllowGravity(true);
        }

        // Action: Snappier jump
        this.player.setVelocityY(-650);

        // Light camera shake per shot
        this.cameras.main.shake(40, 0.003);

        // Muzzle flash particle
        let flash = this.add.circle(this.player.x + 50, this.player.y, 25, 0x00ffff);
        this.tweens.add({ targets: flash, scale: 0, alpha: 0, duration: 150, onComplete: () => flash.destroy() });

        // Recoil shake effect (squish only, angle is handled via velocity)
        this.tweens.add({
            targets: this.player,
            scaleX: 0.22,
            scaleY: 0.28,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                if (!this.isGameOver) {
                    this.player.setScale(0.25);
                }
            }
        });

        // Fire Bullet
        const bullet = this.bullets.create(this.player.x + 30, this.player.y, 'SPR_Bullet').setScale(0.3);
        bullet.body.setSize(bullet.width * 0.4, bullet.height * 0.4);
        bullet.body.setAllowGravity(false);
        bullet.setVelocityX(800);
    }

    hitBlock(bullet, block) {
        bullet.destroy();
        if (!block.active) return;

        block.hp--;

        if (block.hp <= 0) {
            this.destroyBlock(block);
        } else {
            // Visual feedback on non-lethal hit
            block.setTintFill(0xffffff);
            block.setDisplaySize(block.displayWidth * 0.85, block.displayHeight * 0.85);
            this.time.delayedCall(50, () => {
                if (block.active) block.clearTint();
            });
        }
    }

    destroyBlock(block) {
        if (!block.active) return;
        let bx = block.x;
        let by = block.y;
        let isExplosive = block.blockType === 'explosive';

        block.destroy();

        if (isExplosive) {
            this.cameras.main.shake(300, 0.04);
            let flash = this.add.circle(bx, by, 70, 0xff5500);
            this.tweens.add({ targets: flash, scale: 6, alpha: 0, duration: 400, onComplete: () => flash.destroy() });

            // Apply AOE damage to surrounding
            let toDestroy = [];
            this.pillars.getChildren().forEach(b => {
                if (b.active && Phaser.Math.Distance.Between(bx, by, b.x, b.y) < 250) {
                    toDestroy.push(b);
                }
            });
            // Chain explosion
            toDestroy.forEach(b => this.destroyBlock(b));
        } else {
            // Burst of small particles
            for (let i = 0; i < 5; i++) {
                let puff = this.add.circle(bx + Phaser.Math.Between(-30, 30), by + Phaser.Math.Between(-30, 30), Phaser.Math.Between(15, 30), 0xffffff, 0.8);
                this.tweens.add({
                    targets: puff,
                    x: bx + Phaser.Math.Between(-80, 80),
                    y: by + Phaser.Math.Between(-80, 80),
                    scale: 0, alpha: 0, duration: 300,
                    onComplete: () => puff.destroy()
                });
            }
        }
    }

    spawnPillar() {
        const w = this.scale.width;
        const h = this.scale.height;
        const holeSize = 400;
        const holeY = Phaser.Math.Between(holeSize, h - holeSize);

        // Exact height of 200 to maintain the original tall aspect ratio (~1.25)
        const blockHeight = 200;
        const numBlocks = Math.ceil(h / blockHeight) + 1;

        // Check if we passed a pillar to gain score
        this.score++;
        this.scoreText.setText(this.score.toString());

        for (let i = -1; i < numBlocks; i++) {
            let by = i * blockHeight + blockHeight / 2;
            if (Math.abs(by - holeY) < holeSize / 2) continue; // The hole

            // Random block type
            let bType = 'basic';
            let spr = 'SPR_Block_Basic';
            let r = Phaser.Math.Between(0, 100);
            if (r < 10) { bType = 'explosive'; spr = 'SPR_Block_Explosive'; }
            else if (r < 25) { bType = 'moving'; spr = 'SPR_Block_Moving'; }

            let block = this.pillars.create(w + 100, by, spr);

            // Normalize crop sizes by forcing display size to a proper tall aspect ratio
            block.setDisplaySize(150, blockHeight);

            // Adjust physical hitbox (slightly smaller than visual to be more forgiving)
            block.body.setSize(block.width * 0.7, block.height * 0.9);

            block.body.setAllowGravity(false);
            block.body.setImmovable(true);
            block.setVelocityX(-250);
            block.blockType = bType;
            if (bType === 'moving') block.startY = by;

            // Health parameters
            if (bType === 'basic') block.hp = Phaser.Math.Between(1, 2);
            else if (bType === 'moving') block.hp = 3;
            else if (bType === 'explosive') block.hp = 1;
        }
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.cameras.main.shake(400, 0.04);
        this.player.setTexture('SPR_Trippybara_Death');
        this.physics.pause();
        this.bg.tilePositionX += 0;
        this.time.delayedCall(1000, () => {
            this.scene.start('EndScene', { score: this.score });
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;

        if (this.isStarted) {
            this.bg.tilePositionX += 0.1 * delta;
            this.survivalTime += delta;

            // Dynamic flappy angle blending based on velocity
            let targetAngle = Phaser.Math.Clamp(this.player.body.velocity.y * 0.08, -25, 60);
            this.player.angle = Phaser.Math.Linear(this.player.angle, targetAngle, 0.2);

            // Generate Pillars
            this.spawnTimer += delta;
            if (this.spawnTimer > this.nextSpawn) {
                this.spawnPillar();
                this.spawnTimer = 0;
            }

            // Cleanup Bullets & Update moving blocks
            this.bullets.getChildren().forEach(b => {
                if (b.x > this.scale.width + 100) b.destroy();
            });

            this.pillars.getChildren().forEach(p => {
                if (p.x < -100) p.destroy();
                else if (p.blockType === 'moving') {
                    // Use a kinematic Physics P-controller to track the sine wave perfectly
                    // This prevents teleportation jitter and Arcade Physics offset desync
                    let targetY = p.startY + Math.sin(time / 200) * 60;
                    p.setVelocityY((targetY - p.y) * 10);
                }
            });

            // Win condition constraint
            if (this.score >= 20 || this.survivalTime > 30000) {
                this.gameOver(); // Consider as 'Complete' hook for Playable ad
            }
        }
    }
}

class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.add.rectangle(0, 0, w, h, 0x000000, 0.7).setOrigin(0);

        let titleStyle = { fontFamily: 'Impact, sans-serif', fontSize: '60px', fill: '#FF4444', stroke: '#330000', strokeThickness: 8 };
        let pointsStyle = { fontFamily: 'Impact, sans-serif', fontSize: '80px', fill: '#FFD700', stroke: '#5A3A22', strokeThickness: 10 };

        this.add.text(w / 2, h / 2 - 140, 'GAME OVER', titleStyle).setOrigin(0.5).setShadow(4, 4, '#000', 0, true, true);
        this.add.text(w / 2, h / 2 - 40, 'SCORE: ' + this.score, pointsStyle).setOrigin(0.5).setShadow(5, 5, '#000', 0, true, true);

        let btn = this.add.image(w / 2, h / 2 + 150, 'UI_Btn_Play').setScale(0.8).setInteractive();

        // Pulsing animation
        this.tweens.add({
            targets: btn,
            scaleX: 0.9,
            scaleY: 0.9,
            yoyo: true,
            repeat: -1,
            duration: 500
        });

        btn.on('pointerdown', () => {
            console.log("CTA Clicked! Redirecting to App Store...");
            let storeUrl = "https://play.google.com/store/apps/details?id=com.puzzle.trippy.glide";

            // Standard Ad Network routing (Fallback to window.open for local test)
            try {
                if (typeof mraid !== 'undefined') {
                    mraid.open(storeUrl);
                } else if (typeof dapi !== 'undefined') {
                    dapi.openStoreUrl();
                } else {
                    window.open(storeUrl, '_blank');
                }
            } catch (e) {
                window.open(storeUrl, '_blank');
            }
        });
    }
}
