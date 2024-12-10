class Cannon extends Sprite{
    constructor({
        imageSrc, frameRate,
        animations, loop, frameBuffer,
        position, isFlip = false, xflip = 1, 
        setTimeAttack = 200, cannonBallTime = 150
    }) {
        super({ imageSrc, frameRate, frameBuffer, animations, loop, position, isFlip })
        this.hitbox = {
            position: {
                x: this.position.x + 28,
                y: this.position.y + 12
            },
            width: 38,
            height: 30
        }
        
        this.cannonBall = new CannonBall({
            position: {
                x: this.position.x - 15,
                y: this.position.y - 8
            },
            hitbox: {
                position: {
                    x: this.position.x + 33,
                    y: this.position.y + 25
                },
                radius: 10
            },
            imageSrc: './img/Cannon/cannonBall.png',
            frameRate: 1,
            frameBuffer: 1,
            life: cannonBallTime,
            loop: true,
            isFlip: true,
        })

        this.isFlip = isFlip
        this.xflip = xflip


        //setting cannon
        this.actionLockCounter = 0
        this.isAttack = false
        this.setTimeAttack = setTimeAttack

        //animations    
        this.animations = {
            idleCannon: {
                frameRate: 1,
                frameBuffer: 1,
                loop: true,
                imageSrc: './img/Cannon/idleCannon.png',
            },
            CannonShoot: {
                frameRate: 4,
                frameBuffer: 14,
                loop: false,
                imageSrc: './img/Cannon/cannonShoot.png',
                onComplete: () => {
                    this.switchSprite('idleCannon')
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
    switchSprite(name) {
        if (this.image === this.animations[name].image) return
        this.currentFrame = 0
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = this.animations[name].frameBuffer
        this.loop = this.animations[name].loop
        this.currentAnimation = this.animations[name]
    }
    update() {
        this.setTimeCannonShoot(this.setTimeAttack)
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

        //test scale image 
        let testWidth = 70
        let testHeight = 50

        c.save()

        if (this.isFlip) {
            let setX
            let setY
            if (this.xflip == -1) {
                setX = xDraw + this.width / 2 + this.width + 5
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

        //Attack and setting cannonBall

        if(this.isAttack){
            if(this.cannonBall.alive){
                this.cannonBall.hitbox.radius = 10
                this.cannonBall.update()
                this.cannonBall.draw()  
            }
        } else{
            this.cannonBall.hitbox.radius = 0
        }

        // this.cannonBall.draw()  
        // this.cannonBall.update()

        // c.fillStyle = "rgb(255, 0, 0, 0.3)"
        // c.fillRect(
        //     this.hitbox.position.x,
        //     this.hitbox.position.y,
        //     this.hitbox.width,
        //     this.hitbox.height
        // )
        // c.fillStyle = "rgb(0, 0, 255, 0.5)"
        // c.beginPath();
        // c.arc(
        //     this.cannonBall.hitbox.position.x,
        //     this.cannonBall.hitbox.position.y,
        //     this.cannonBall.hitbox.radius,
        //     0,
        //     2 * Math.PI    
        // )
        // c.fill();
        this.updateFrames();
    }
    setTimeCannonShoot(time){
        this.actionLockCounter++
        if(this.actionLockCounter > time){

            //set cannonBall
            if(this.cannonBall.alive == false){
                if(this.xflip == -1){
                    this.cannonBall.xflip = -1 
                    this.cannonBall.set(this.position.x + 30, this.position.y)
                }else{
                    this.cannonBall.set(this.position.x, this.position.y)
                }
                this.cannonBall.alive = true
                this.switchSprite('CannonShoot')   
                //setting attack
                this.isAttack = true;  
            }             
            this.actionLockCounter = 0;
        }
    }
}