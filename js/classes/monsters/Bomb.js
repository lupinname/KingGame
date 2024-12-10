class Bomb extends Sprite{
    constructor({
        imageSrc = './img/Bomb/BombOff.png',
        frameRate = 1,
        frameBuffer = 1,
        animations, loop,
        position, isFlip = true, xflip = 1, 
    }) {
        super({ imageSrc, frameRate, frameBuffer, animations, loop, position, isFlip })
        this.hitbox = {
            position: {
                x: this.position.x + 40,
                y: this.position.y + 50
            },
            radius: 10
        }

        this.hitboxDamage = {
            position: {
                x: this.position.x + 40,
                y: this.position.y + 45
            },
            radius: 30
        }

        this.isFlip = isFlip
        this.xflip = xflip
        this.timeCount = 200
        this.isAlive = true
        this.isActive = false
        this.actionLockCounter = 0


        //setting cannon
        this.actionLockCounter = 0
        this.isAttack = false


        //animations    
        this.animations = {
            BombOff: {
                frameRate: 1,
                frameBuffer: 1,
                loop: true,
                imageSrc: './img/Bomb/BombOff.png',
            },
            BombOn: {
                frameRate: 4,
                frameBuffer: 18,
                loop: true,
                imageSrc: './img/Bomb/BombOn.png',
            },
            BombBoom: {
                frameRate: 6,
                frameBuffer: 15,
                loop: false,
                imageSrc: './img/Bomb/BombBoom.png',
                onComplete: () => {
                    this.isAlive = false
                    this.isActive = false
                    this.resetHitBox()
                },
            },
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
        this.checkTurnOnBoom()

        if(this.isActive){
            this.timeBombActive(this.timeCount)
        }
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
        let testWidth = 80
        let testHeight = 85

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


        //debug
        // c.fillStyle = "rgb(0, 0, 255, 0.5)"
        // c.beginPath();
        // c.arc(
        //     this.hitbox.position.x,
        //     this.hitbox.position.y,
        //     this.hitbox.radius,
        //     0,
        //     2 * Math.PI    
        // )
        // c.fill();
        // c.fillStyle = "rgb(0, 255, 0, 0.5)"
        // c.beginPath();
        // c.arc(
        //     this.hitboxDamage.position.x,
        //     this.hitboxDamage.position.y,
        //     this.hitboxDamage.radius,
        //     0,
        //     2 * Math.PI    
        // )
        // c.fill();
        this.updateFrames();
    }
    checkCollision(circle) {
        // Tính khoảng cách giữa tâm hình tròn và cạnh của hình chữ nhật
        let circleDistanceX = Math.abs(circle.position.x - player.hitbox.position.x - player.hitbox.width / 2);
        let circleDistanceY = Math.abs(circle.position.y - player.hitbox.position.y - player.hitbox.height / 2);

        // Kiểm tra va chạm nếu khoảng cách theo trục X hoặc Y lớn hơn bán kính của hình tròn
        if (circleDistanceX > (player.hitbox.width / 2 + circle.radius)) {
            return false;
        }
        if (circleDistanceY > (player.hitbox.height / 2 + circle.radius)) {
            return false;
        }

        // Nếu hình tròn nằm trong phạm vi hình chữ nhật theo một trong hai trục, có va chạm
        if (circleDistanceX <= (player.hitbox.width / 2)) {
            return true;
        }
        if (circleDistanceY <= (player.hitbox.height / 2)) {
            return true;
        }

        // Kiểm tra va chạm với các góc của hình chữ nhật
        let cornerDistance_sq = (circleDistanceX - player.hitbox.width / 2) ** 2 +
            (circleDistanceY - player.hitbox.height / 2) ** 2;

        return cornerDistance_sq <= (circle.radius ** 2);
    }
    checkTurnOnBoom(){
        let isTurnOn = this.checkCollision(this.hitbox)
        if(isTurnOn && this.isAlive && (this.isActive == false)){
            this.switchSprite('BombOn')
            this.isActive = true;
        }
    }
    timeBombActive(time){
        this.actionLockCounter++
        if(this.actionLockCounter > time){
            this.checkHitboxDamage()
            this.switchSprite('BombBoom')           
            this.actionLockCounter = 0;
        }
    }
    resetHitBox(){
        this.hitbox = {
            position: {
                x: this.position.x + 40,
                y: this.position.y + 50
            },
            radius: 0
        }
    }
    checkHitboxDamage(){
        let checkPlayerHitBox = this.checkCollision(this.hitboxDamage)
        if(checkPlayerHitBox){
            console.log('player hit')
        }
    }
}