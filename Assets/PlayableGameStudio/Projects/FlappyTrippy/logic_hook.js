class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.score = 0;
        this.combo = 0;
        this.lastHitTime = 0;
        this.difficultyScale = 0;
        this.startTime = 0;
        this.isGameOver = false;
        this.gameStarted = false;
        this.activePowerup = null;
        this.powerupTimer = 0;

        // Background
        this.bg = this.add.tileSprite(this.cameras.main.centerX, this.cameras.main.centerY, 1080, 1920, 'SPR_BG_Layer1');
        this.bg.setDisplaySize(this.scale.width, this.scale.height);

        // Player setup
        this.player = this.physics.add.sprite(this.scale.width * 0.2, this.scale.height * 0.5, 'SPR_Player_Idle');
        this.player.setScale(0.4); // Player scaled bigger
        this.player.body.setGravityY(1200);
        this.player.body.setAllowGravity(false); // Suspended until tap
        this.player.setCollideWorldBounds(false); // We want custom out-of-bounds check
        // Adjust hitbox 
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.6);
        this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.2);

        // Groups
        this.bullets = this.physics.add.group();
        this.blocks = this.physics.add.group();
        this.powerups = this.physics.add.group();

        // UI
        this.scoreText = this.add.text(this.scale.width / 2, 80, '0', {
            fontFamily: 'Arial Black, Impact',
            fontSize: '80px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(10);
        
        this.tapPromptText = this.add.text(this.scale.width / 2, this.scale.height * 0.4, 'TAP TO PLAY', {
            fontFamily: 'Arial Black',
            fontSize: '50px',
            color: '#ffffff',
            stroke: '#ff0055',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(20);
        
        this.comboText = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
            fontFamily: 'Arial Black, Impact',
            fontSize: '60px',
            fontStyle: 'italic',
            color: '#ffdd00',
            stroke: '#ff0055',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(30).setAlpha(0);
        
        this.tweens.add({
            targets: this.tapPromptText,
            scaleX: 0.9,
            scaleY: 0.9,
            yoyo: true,
            repeat: -1,
            duration: 500
        });

        // Red Panic Overlay
        this.panicOverlay = this.add.graphics();
        this.panicOverlay.fillStyle(0xff0000, 1);
        this.panicOverlay.fillRect(0, 0, this.scale.width, this.scale.height);
        this.panicOverlay.setDepth(15);
        this.panicOverlay.setVisible(false);
        this.panicOverlay.setAlpha(0);
        
        this.tweens.add({
            targets: this.panicOverlay,
            alpha: { start: 0, end: 0.3 },
            yoyo: true,
            repeat: -1,
            duration: 400
        });

        // Particles for hit sparks (Phaser 3.55 Syntax)
        let particleManager = this.add.particles('FX_G02_Bullet_001');
        this.particles = particleManager.createEmitter({
            speed: { min: -300, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 600,
            gravityY: 500,
            on: false
        });

        // Input
        this.input.on('pointerdown', this.fireAndJump, this);

        // Physics Collisions
        this.physics.add.overlap(this.bullets, this.blocks, this.hitBlock, null, this);
        this.physics.add.overlap(this.player, this.blocks, this.die, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
    }

    scheduleNextSpawn() {
        if (this.isGameOver) return;
        
        // Spawn delay tightens from 1500ms down to 1000ms (smoother)
        let delay = 1500 - (500 * this.difficultyScale); 
        this.time.delayedCall(delay, () => {
             this.spawnWall();
             this.scheduleNextSpawn();
        });
    }

    fireAndJump() {
        if (this.isGameOver) return;
        
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTime = this.time.now;
            this.player.body.setAllowGravity(true);
            this.scheduleNextSpawn();
            if (this.tapPromptText) this.tapPromptText.destroy();
        }

        // Jump physics
        this.player.body.setVelocityY(-600);

        // Programmatic Juice: Tween Rotation and Scale
        this.tweens.killTweensOf(this.player);
        this.player.rotation = -0.5;
        this.player.setScale(0.45, 0.35);
        this.tweens.add({
            targets: this.player,
            rotation: 0.2, // Smoothly aim down
            scaleX: 0.4,
            scaleY: 0.4,
            duration: 600,
            ease: 'Power2'
        });

        // Fire Bullet based on Powerup State
        if (this.activePowerup === 'RAPID_FIRE') {
            for(let i=0; i<3; i++) {
                let bullet = this.bullets.create(this.player.x + 30 - (i*50), this.player.y, 'FX_G02_Bullet_001');
                bullet.setScale(0.5);
                bullet.body.setVelocityX(1000);
                bullet.body.setAllowGravity(false);
            }
        } else if (this.activePowerup === 'MULTISHOT') {
            let spreads = [-200, 0, 200];
            for(let i=0; i<3; i++) {
                let bullet = this.bullets.create(this.player.x + 30, this.player.y, 'FX_G02_Bullet_001');
                bullet.setScale(0.5);
                bullet.body.setVelocityX(800);
                bullet.body.setVelocityY(spreads[i]);
                bullet.body.setAllowGravity(false);
            }
        } else {
            let bullet = this.bullets.create(this.player.x + 30, this.player.y, 'FX_G02_Bullet_001');
            bullet.setScale(0.5);
            bullet.body.setVelocityX(800);
            bullet.body.setAllowGravity(false);
        }

        // Micro camera shake
        this.cameras.main.shake(50, 0.005);
    }

    spawnWall() {
        if (this.isGameOver) return;

        // Difficulty Math
        let elapsed = this.time.now - this.startTime;
        this.difficultyScale = Math.min(elapsed / 30000, 1); // 0.0 to 1.0

        let spawnX = this.scale.width + 100;
        let gapHeight = 250 - (70 * this.difficultyScale); // Gap tightens to 180
        let middleY = Phaser.Math.Between(200, this.scale.height - 200);

        // We'll spawn two blocks (top and bottom)
        let blockTypeTop = Phaser.Math.RND.pick(['SPR_Block_Basic', 'SPR_Block_Moving', 'SPR_Block_Explosive', 'SPR_Block_Metal']);
        let blockTypeBot = Phaser.Math.RND.pick(['SPR_Block_Basic', 'SPR_Block_Moving', 'SPR_Block_Explosive', 'SPR_Block_Metal']);

        let topBlock = this.blocks.create(spawnX, middleY - gapHeight, blockTypeTop);
        let botBlock = this.blocks.create(spawnX, middleY + gapHeight, blockTypeBot);

        [topBlock, botBlock].forEach(b => {
             b.setScale(0.6); // Scale size block nhỏ lại
             b.body.setAllowGravity(false);
             // Velocity scales up smoothly from -350 to -600
             let velocity = -350 - (250 * this.difficultyScale); 
             b.body.setVelocityX(velocity);
             b.body.setImmovable(true);
             b.assetType = b.texture.key;
             
             // HP system based on type
             if (b.assetType === 'SPR_Block_Basic') { b.hp = 2; }
             else if (b.assetType === 'SPR_Block_Moving') { b.hp = 3; b.startY = b.y; }
             else if (b.assetType === 'SPR_Block_Explosive') { b.hp = 1; }
             else { b.hp = 9999; } // Metal
             
             // Accurate hitboxes rule
             b.body.setSize(b.width * 0.9, b.height * 0.9);
        });

        // Spawn Powerup in Phase (Every ~4th wall or if heavily requested)
        this.wallCount = (this.wallCount || 0) + 1;
        if (this.wallCount % 4 === 0) {
             let pw = this.powerups.create(spawnX, middleY, 'SPR_Powerup_Generic');
             pw.setScale(0.7);
             pw.body.setAllowGravity(false);
             pw.body.setVelocityX(-350 - (250 * this.difficultyScale));
             pw.startY = middleY;
        }
    }

    collectPowerup(player, powerup) {
        powerup.destroy();
        this.particles.emitParticleAt(powerup.x, powerup.y, 20);
        
        let types = ['RAPID_FIRE', 'MULTISHOT'];
        this.activePowerup = Phaser.Math.RND.pick(types);
        this.powerupTimer = this.time.now + 5000; // 5 seconds
        
        // Announce!
        this.comboText.setText(this.activePowerup.replace('_', ' ') + '!');
        this.comboText.setPosition(player.x + 80, player.y - 80);
        this.comboText.setAlpha(1);
        this.comboText.setScale(0.5);
        
        this.tweens.killTweensOf(this.comboText);
        this.tweens.add({
            targets: this.comboText,
            scaleX: 1.2,
            scaleY: 1.2,
            y: player.y - 150,
            alpha: 0,
            duration: 1500,
            ease: 'Back.easeOut'
        });
        
        this.cameras.main.flash(300, 100, 255, 255);
    }

    hitBlock(bullet, block) {
        bullet.destroy();

        if (block.assetType === 'SPR_Block_Metal') {
            // Indestructible but triggers sparks
            this.particles.emitParticleAt(bullet.x, bullet.y, 5);
            return;
        } 
        
        block.hp -= 1;
        
        // Damage effect
        block.setTint(0xff5555);
        this.time.delayedCall(100, () => { if (block && block.active) block.clearTint(); });

        if (block.hp <= 0) {
            // COMBO SYSTEM
            this.combo++;
            this.lastHitTime = this.time.now;
            
            // Pop Combo UI only if x2 or above
            if (this.combo >= 2) {
                this.comboText.setText('x' + this.combo + ' COMBO!');
                this.comboText.setPosition(block.x + 40, block.y - 80);
                this.comboText.setAlpha(1);
                this.comboText.setScale(0.5);
                
                this.tweens.killTweensOf(this.comboText);
                this.tweens.add({
                    targets: this.comboText,
                    scaleX: 0.8 + (this.combo * 0.05),
                    scaleY: 0.8 + (this.combo * 0.05),
                    y: block.y - 150,
                    alpha: 0,
                    duration: 1200,
                    ease: 'Back.easeOut'
                });
            }

            // Golden Combo Flash
            if (this.combo >= 3) {
                 this.cameras.main.flash(200, 255, 200, 0);
            }

            // Destroy block
            if (block.assetType === 'SPR_Block_Explosive') {
                this.particles.emitParticleAt(block.x, block.y, 50);
                this.cameras.main.shake(200, 0.04); // x2 shake
                
                // Explode adjacent blocks
                this.blocks.children.each(b => {
                    if (b !== block && b.active && Phaser.Math.Distance.Between(block.x, block.y, b.x, b.y) < 350) {
                        if (b.assetType !== 'SPR_Block_Metal') {
                            this.particles.emitParticleAt(b.x, b.y, 15);
                            b.destroy();
                            this.addScore(1);
                        }
                    }
                });
            } else {
                this.particles.emitParticleAt(block.x, block.y, 15);
                this.cameras.main.shake(100, 0.02);
            }
            
            if (block.active) {
                block.destroy();
                this.addScore(1);
            }

            // Hit stop (Freeze time briefly)
            this.scene.pause();
            setTimeout(() => { if (!this.isGameOver) this.scene.resume(); }, 50);
        } else {
            // Just hit but not destroyed
            this.particles.emitParticleAt(bullet.x, bullet.y, 5);
        }
    }

    addScore(val) {
        this.score += val;
        this.scoreText.setText(this.score.toString());
        // Win condition check
        if (this.score >= 10) {
            this.winGame();
        }
    }

    die() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.input.off('pointerdown');

        this.cameras.main.shake(300, 0.05);
        this.particles.emitParticleAt(this.player.x, this.player.y, 30);
        this.player.setVisible(false);

        // Flash red
        this.cameras.main.flash(300, 255, 0, 0);

        this.time.delayedCall(800, () => {
            this.scene.start('EndScene', { result: 'NICE TRY!' });
        });
    }

    winGame() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        
        // Fever time effect before CTA
        this.cameras.main.flash(500, 255, 255, 255);
        this.time.delayedCall(1000, () => {
            this.scene.start('EndScene', { result: 'AWESOME FLIGHT!' });
        });
    }

    update() {
        if (this.isGameOver) return;
        if (!this.gameStarted) {
            // Idle float before start
            this.player.y = this.scale.height * 0.5 + Math.sin(this.time.now / 300) * 20;
            return;
        }

        // Scroll background
        this.bg.tilePositionX += 2;

        // Clean up out of bounds objects
        this.bullets.children.each(b => { if (b && b.x > this.scale.width + 100) b.destroy(); });
        this.blocks.children.each(b => { 
            if (b && b.x < -100) b.destroy(); 
            else if (b && b.assetType === 'SPR_Block_Moving' && b.active) {
                // Moving block amplitude scales slightly, frequency stays smooth
                let amplitude = 150 + (50 * this.difficultyScale);
                b.y = b.startY + Math.sin(this.time.now / 300) * amplitude;
            }
        });
        
        // Powerups floating and out of bounds cleanup
        this.powerups.children.each(p => {
             if (p && p.x < -100) p.destroy();
             else if (p && p.active) {
                 p.y = p.startY + Math.sin(this.time.now / 200) * 30; // Gentle fast bob
             }
        });

        // Combo decay check
        if (this.combo > 0 && (this.time.now - this.lastHitTime > 1500)) {
            this.combo = 0; // Lost combo!
            this.tweens.killTweensOf(this.comboText);
            this.comboText.setAlpha(0);
        }

        // Fall off screen -> Die
        if (this.player.y > this.scale.height || this.player.y < -50) {
            this.die();
        }

        // Timer
        let elapsed = this.time.now - this.startTime;
        let timeLeft = Math.max(30 - Math.floor(elapsed / 1000), 0);

        // Panic Mode Check
        if (timeLeft <= 8 && timeLeft > 0 && !this.isGameOver) {
             if (!this.panicOverlay.visible) {
                 this.panicOverlay.setVisible(true);
             }
        }

        // Powerup Decay Check
        if (this.activePowerup && this.time.now > this.powerupTimer) {
             this.activePowerup = null; // Revert to normal
        }

        if (timeLeft <= 0) {
            this.winGame();
        }
    }
}

class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    init(data) {
        this.resultText = data.result || 'GAME OVER';
    }

    create() {
        // Background
        this.bg = this.add.tileSprite(this.cameras.main.centerX, this.cameras.main.centerY, 1080, 1920, 'SPR_BG_Layer1');
        this.bg.setDisplaySize(this.scale.width, this.scale.height);

        // Dark Backdrop Overlay
        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.6);
        graphics.fillRect(0, 0, this.scale.width, this.scale.height);

        // Logo
        let logo = this.add.sprite(this.scale.width / 2, this.scale.height * 0.35, 'UI_Title_Logo').setOrigin(0.5);
        logo.setScale(0.9);

        // CTA Button (Using actual AI generated UI Button)
        let ctaBtn = this.add.sprite(this.scale.width / 2, this.scale.height * 0.65, 'UI_Btn_CTA').setOrigin(0.5);
        ctaBtn.setScale(1.2);
        ctaBtn.setInteractive();

        // Pulse tween
        this.tweens.add({
            targets: ctaBtn,
            scaleX: 1.3,
            scaleY: 1.3,
            yoyo: true,
            repeat: -1,
            duration: 600,
            ease: 'Sine.easeInOut'
        });

        ctaBtn.on('pointerdown', () => {
             // Mock store click trigger
             console.log("Store clicked!");
             window.open("https://play.google.com/store/apps", "_blank");
        });
    }

    update() {
        // Scroll EndScene background to keep it lively
        if (this.bg) {
            this.bg.tilePositionX += 1;
        }
    }
}
