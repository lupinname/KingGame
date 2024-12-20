class Player extends Sprite {
    constructor({
        collisionBlocks = [], imageSrc, frameRate, animations, loop, isAttack, life, isAlive = true, position
    }) {
        super({ imageSrc, frameRate, animations, loop, position })

        this.life = life
        this.isAlive = isAlive

        this.velocity = {
            x: 0,
            y: 0,
        }
        this.sides = {
            bottom: this.position.y + this.height,
        }
        this.gravity = 0.3;
        this.collisionBlocks = collisionBlocks;
        this.isAttack = isAttack;
    }


    update() {
        //debug player 
        // c.fillStyle = 'rgba(0, 255, 0, 0.5)';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.position.x += this.velocity.x;

        // Update hitbox player
        this.updateHitbox()

        // check horizontal collision
        this.checkForHorizontalCollisions()
        this.checkForMonsterCollisionX()
        //apply gravity
        this.applyGravity()

        this.updateHitbox()

        this.updateHitboxAttack()
        this.checkForAttacking()

        // c.fillRect(
        //     this.hitbox.position.x,
        //     this.hitbox.position.y,
        //     this.hitbox.width,
        //     this.hitbox.height
        // )

        // Draw Player hitbox Attack 
        // if (this.isAttack) {
        //     c.fillStyle = "rgb(255, 0, 0, 0.5)"
        //     c.fillRect(
        //         this.hitboxAttack.position.x,
        //         this.hitboxAttack.position.y,
        //         this.hitboxAttack.width,
        //         this.hitboxAttack.height
        //     )
        // }

        // check for vertical collisions
        this.checkForVerticalCollision()
        this.checkForMonsterCollisionY()
        
    }
    draw() {
        if (!this.loaded) return
        const cropbox = {
            position: {
                x: this.width * this.currentFrame,
                y: 0
            },
            width: this.width,
            height: this.height
        }

        //Set playet attack left
        let xDraw = this.position.x
        let yDraw = this.position.y
        if (this.lastDirection === 'left' && this.isAttack) {
            if (this.currentFrame == this.frameRate - 1) {
                xDraw = this.position.x + 28
            } else xDraw = this.position.x - 35
        }

        // Draw Player
        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            xDraw,
            yDraw,
            this.width,
            this.height
        )


        // if(this.debug){
        //     c.fillStyle = 'red'
        //     c.fillRect(
        //         this.position.x,
        //         this.position.y,
        //         this.width,
        //         this.height
        //     )
        // }

        this.updateFrames();
    }

    handleInput(keys) {
        if (this.preventInput) return
        this.velocity.x = 0;
        if (keys.f.pressed) {
            if (this.lastDirection === 'right' || this.lastDirection == null) {
                this.switchSprite('attackRight')
            } else if (this.lastDirection === 'left') {
                this.switchSprite('attackLeft')
            }
        } else if (keys.a.pressed) {
            this.switchSprite('runLeft')
            this.velocity.x = -3
            this.lastDirection = 'left'
        } else if (keys.d.pressed) {
            this.switchSprite('runRight')
            this.velocity.x = 3
            this.lastDirection = 'right'
        } else {
            if (this.lastDirection === 'left') this.switchSprite('idleLeft')
            else this.switchSprite('idleRight')
        }

    }
    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 58,
                y: this.position.y + 34
            },
            width: 48,
            height: 53
        }
    }
    updateHitboxAttack() {

        if (this.isAttack) {
            if (this.lastDirection === 'right' || this.lastDirection == null) {
                this.hitboxAttack = {
                    position: {
                        x: this.position.x + 100,
                        y: this.position.y + 49,
                    },
                    width: 46,
                    height: 40,
                }
            } else {
                if (this.lastDirection === 'left') {
                    this.hitboxAttack = {
                        position: {
                            x: this.position.x + 10,
                            y: this.position.y + 49,
                        },
                        width: 46,
                        height: 40,
                    }
                }
            }
        } else {
            this.hitboxAttack = {
                position: {
                    x: this.position.x + 10,
                    y: this.position.y + 49,
                },
                width: 0,
                height: 0,
            }
        }

    }
    switchSprite(name) {
        if (this.image === this.animations[name].image) return
        this.currentFrame = 0
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = this.animations[name].frameBuffer
        this.loop = this.animations[name].loop
        this.currentAnimation = this.animations[name]
    }
    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            // if a collision exists
            if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                if (this.velocity.x < 0) {
                    const offset = this.hitbox.position.x - this.position.x
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01 //this.width
                    break
                }
                if (this.velocity.x > 0) {
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }

            }
        }
    }
    applyGravity() {
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
    }
    checkForVerticalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            // if a collision exists
            if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y
                    this.position.y = collisionBlock.position.y - offset + collisionBlock.height + 0.01 //this.width
                    break
                }
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }

            }
        }
    }
    checkForMonsterCollisionX(){
        for (let i = 0; i < pigs.length; i++) {
            const pig = pigs[i];
            // if a collision exists
            if (this.hitbox.position.x <= pig.hitbox.position.x + pig.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= pig.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= pig.hitbox.position.y &&
                this.hitbox.position.y <= pig.hitbox.position.y + pig.hitbox.height
            ) { 
                if (this.velocity.x < 0) {
                    const offset = this.hitbox.position.x - this.position.x
                    this.position.x = pig.hitbox.position.x + pig.hitbox.width - offset + 0.01 //this.width
                    break
                }
                if (this.velocity.x > 0) {
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
                    this.position.x = pig.hitbox.position.x - offset - 0.01
                    break
                }

            }
        }
    }
    checkForMonsterCollisionY(){
        for (let i = 0; i < pigs.length; i++) {
            const pig = pigs[i];
            // if a collision exists
            if (this.hitbox.position.x <= pig.hitbox.position.x + pig.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= pig.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= pig.hitbox.position.y &&
                this.hitbox.position.y <= pig.hitbox.position.y + pig.hitbox.height
            ) { 
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y
                    this.position.y = pig.hitbox.position.y - offset + pig.hitbox.height + 0.01 //this.width
                    break
                }
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = pig.hitbox.position.y - offset - 0.01
                    break
                }

            }
        }
    }
    checkForAttacking() {
        // set limit attack
        if (this.collision_Count === undefined) {
            this.collision_Count = 0
        }

        if (this.isAttack && this.collision_Count < 1) {
            for (let i = 0; i < pigs.length; i++) {
                const pig = pigs[i]
                if(pigs[i].isAlive){
                    if (this.hitboxAttack.position.x <= pig.hitbox.position.x + pig.hitbox.width &&
                        this.hitboxAttack.position.x + this.hitboxAttack.width >= pig.hitbox.position.x &&
                        this.hitboxAttack.position.y + this.hitboxAttack.height >= pig.position.y &&
                        this.hitboxAttack.position.y <= pig.hitbox.position.y + pig.hitbox.height
                    ) {
                        console.log('attacking')
                        pigs[i].switchSprite('pigHit')
                        if (this.lastDirection === 'right' || this.lastDirection == null) {
                            pigs[i].velocity.x += 4;
                            setTimeout(function () {
                                pigs[i].velocity.x = 0;
                            }, 50)
                        } else {
                            pigs[i].velocity.x += -4;
                            setTimeout(function () {
                                pigs[i].velocity.x = 0;
                            }, 50)
                        }
                        pigs[i].life--;
                        console.log(pigs[i].life)
                        if (pigs[i].life <= 0) {
                            pigs[i].isAlive = false
                        }
                        this.collision_Count++;
                        break
                    }
                }
                
            }
        } else if (!this.isAttack) {
            this.collision_Count = 0;
        }
    }

}
