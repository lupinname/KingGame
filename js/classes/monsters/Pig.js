class Pig extends Sprite {
    constructor({
        collisionBlocks = [], imageSrc, frameRate,
        animations, loop, isAttack, frameBuffer,
        position, isAlive = true, life = 1, isFlip = false,
    }) {
        super({ imageSrc, frameRate, frameBuffer, animations, loop, position, isFlip })

        //position pig
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.sides = {
            bottom: this.position.y + this.height,
        }
        this.gravity = 0.3;
        //colision
        this.collisionBlocks = collisionBlocks;

        //setting pig
        this.actionLockCounter = 0;
        this.isAttack = isAttack;
        this.xflip = 1
        this.isFlip = isFlip;

        //status monster
        this.life = life
        this.isAlive = isAlive;
        this.isDead = false

        //animations    
        this.animations = {
            pigAttack: {
                frameRate: 5,
                frameBuffer: 10,
                loop: false,
                imageSrc: './img/pig/pig_attack.png',
            },
            pigDefault: {
                frameRate: 11,
                frameBuffer: 10,
                loop: true,
                imageSrc: './img/pig/pig.png',
            },
            pigRun: {
                frameRate: 6,
                frameBuffer: 10,
                loop: true,
                imageSrc: './img/pig/pig_run_left.png',
            },
            pigDead: {
                frameRate: 4,
                frameBuffer: 12,
                loop: false,
                imageSrc: './img/pig/pig_dead.png',
                onComplete: () => {
                    // console.log('completed')
                    this.isDead = true
                    this.update()
                },

            },
            pigHit: {
                frameRate: 2,
                frameBuffer: 40,
                loop: true,
                imageSrc: './img/pig/pig_hit.png',
                onComplete: () => {
                    // console.log('completed')
                    this.switchSprite('pigDefault')
                },
            }
        }
        this.loadAnimations()
    }
    loadAnimations() {
        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image()
                image.src = this.animations[key].imageSrc
                this.animations[key].image = image
            }
        }
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
        // this.checkForPlayerCollisionX()
        //apply gravity
        this.applyGravity()

        // update hitbox
        this.updateHitbox()
        this.updateHitboxAttack()

        // check for be attacked or attack
        this.checkForAttacking()

        //check hit box
        c.fillStyle = "rgb(255, 0, 0, 0.3)"
        c.fillRect(
            this.hitbox.position.x,
            this.hitbox.position.y,
            this.hitbox.width,
            this.hitbox.height
        )

        if (this.isAttack) {
            c.fillRect(
                this.hitboxAttack.position.x,
                this.hitboxAttack.position.y,
                this.hitboxAttack.width,
                this.hitboxAttack.height
            )
        }


        this.controlMovePig(120)

        // check for vertical collisions
        this.checkForVerticalCollision()
         this.checkForPlayerCollisionY()
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

        // set position image attack left
        let xDraw = this.position.x
        let yDraw = this.position.y
        if (this.lastDirection === 'left' && this.isAttack) {
            if (this.currentFrame == this.frameRate - 1) {
                xDraw = this.position.x + 28
            } else xDraw = this.position.x - 35
        }

        //test scale image
        let testWidth = 70
        let testHeight = 70

        c.save()

        if (this.isFlip) {
            let setX
            let setY
            if (this.xflip == -1) {
                setX = xDraw + this.width / 2 + this.width + 12
                setY = yDraw + this.height / 2
            } else {
                setX = xDraw + this.width / 2
                setY = yDraw + this.height / 2
            }
            c.translate(
                setX,
                setY,
            )
            c.scale(this.xflip, 1);
        }

        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            -this.width / 2,
            -this.height / 2,
            testWidth,
            testHeight
        )

        c.restore()

        // c.drawImage(
        //     this.image,
        //     cropbox.position.x,
        //     cropbox.position.y,
        //     cropbox.width,
        //     cropbox.height,
        //     xDraw,
        //     yDraw,
        //     testWidth,
        //     testHeight
        // )


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
        if (this.isAlive) {
            this.hitbox = {
                position: {
                    x: this.position.x + 20,
                    y: this.position.y + 25
                },
                width: 40,
                height: 45
            }
        } else {
            this.hitbox = {
                position: {
                    x: 0,
                    y: 0
                },
                width: 0,
                height: 0
            }
        }
    }
    updateHitboxAttack() {
        this.hitboxAttack = {
            position: {
                x: this.position.x + 100,
                y: this.position.y + 49,
            },
            width: 0,
            height: 0,
        }
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
    checkForAttacking() {
        // set limit attack
        if (this.collision_Count === undefined) {
            this.collision_Count = 0
        }

        if (this.isAttack && this.collision_Count < 1) {
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i]

                if (this.hitboxAttack.position.x <= door.position.x + door.width &&
                    this.hitboxAttack.position.x + this.hitboxAttack.width >= door.position.x &&
                    this.hitboxAttack.position.y + this.hitboxAttack.height >= door.position.y &&
                    this.hitboxAttack.position.y <= door.position.y + door.height
                ) {
                    console.log('attacking')
                    this.collision_Count++;
                    break
                }
            }
        } else if (!this.isAttack) {
            this.collision_Count = 0;
        }
    }
    checkForPlayerCollisionX() {
        // if a collision exists
        const defaultPlayer = player 
        if (this.hitbox.position.x <= defaultPlayer.hitbox.position.x + defaultPlayer.hitbox.width &&
            this.hitbox.position.x + this.hitbox.width >= defaultPlayer.hitbox.position.x &&
            this.hitbox.position.y + this.hitbox.height >= defaultPlayer.hitbox.position.y &&
            this.hitbox.position.y <= defaultPlayer.hitbox.position.y + defaultPlayer.hitbox.height
        ) {
            if (this.velocity.x < 0) {
                const offset = this.hitbox.position.x - this.position.x
                this.position.x = defaultPlayer.hitbox.position.x + defaultPlayer.hitbox.width - offset + 0.01 //this.width
                return
            }
            if (this.velocity.x > 0) {
                const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
                this.position.x = defaultPlayer.hitbox.position.x - offset - 0.01
                return
            }
        }

    }
    checkForPlayerCollisionY() {
        // if a collision exists
        if (this.hitbox.position.x <= player.hitbox.position.x + player.hitbox.width &&
            this.hitbox.position.x + this.hitbox.width >= player.hitbox.position.x &&
            this.hitbox.position.y + this.hitbox.height >= player.hitbox.position.y &&
            this.hitbox.position.y <= player.hitbox.position.y + player.hitbox.height
        ) {
            if (this.velocity.y < 0) {
                this.velocity.y = 0
                const offset = this.hitbox.position.y - this.position.y
                this.position.y = player.hitbox.position.y - offset + player.hitbox.height + 0.01 //this.width
                return
            }
            if (this.velocity.y > 0) {
                this.velocity.y = 0
                const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                this.position.y = player.hitbox.position.y - offset - 0.01
                return
            }

        }

    }
    controlMovePig(setTime) {
        // Returns a random integer from 1 to 100:
        this.actionLockCounter++;

        if (this.actionLockCounter > setTime) {
            // // Returns a random integer from 1 to 100:
            // let i = Math.floor(Math.random() * 50) + 1;

            // if(i <= 25) {
            // 	this.velocity.x = 2;
            // }
            // if(i > 25 && i <= 50) {
            // 	this.velocity.x = -2
            // }
            if (this.lastDirection === 'right' || this.lastDirection == null) {
                this.velocity.x = +1
                this.lastDirection = 'left'
                this.switchSprite('pigRun')
                this.xflip = -1
            } else if (this.lastDirection === 'left') {
                this.velocity.x = -1
                this.lastDirection = 'right'
                this.xflip = 1
            }
            this.actionLockCounter = 0;
        }

    }

}
