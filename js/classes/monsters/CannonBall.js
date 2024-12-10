class CannonBall extends Sprite {
    constructor({
        imageSrc, frameRate,
        animations, loop, frameBuffer,
        position, isFlip = false, xflip = 1, hitbox,
        life
    }) {
        super({ imageSrc, frameRate, frameBuffer, animations, loop, position, isFlip })
        this.isFlip = isFlip
        this.xflip = xflip
        this.hitbox = hitbox
        this.maxlife = life
        this.life = life
        this.alive = false
    }
    set(positionX, positionY) {
        this.position.x = positionX - 15
        this.position.y = positionY - 8

        this.hitbox.position.x = positionX + 33
        this.hitbox.position.y = positionY + 25
    }
    update() {
        this.updatePosition();
        this.life--
        if (this.life < 0) {
            this.alive = false
            this.hitbox.radius = 0
            this.life = this.maxlife
        } else {
            this.AttackPlayer();
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
        let testWidth = 75
        let testHeight = 49

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

        this.updateFrames();
    }
    updatePosition() {
        if (this.xflip == -1) {
            this.position.x += 2;
            this.hitbox.position.x += 2;
        } else {
            this.position.x -= 2;
            this.hitbox.position.x -= 2;
        }
    }
    checkCollision() {
        // Tính khoảng cách giữa tâm hình tròn và cạnh của hình chữ nhật
        let circleDistanceX = Math.abs(this.hitbox.position.x - player.hitbox.position.x - player.hitbox.width / 2);
        let circleDistanceY = Math.abs(this.hitbox.position.y - player.hitbox.position.y - player.hitbox.height / 2);

        // Kiểm tra va chạm nếu khoảng cách theo trục X hoặc Y lớn hơn bán kính của hình tròn
        if (circleDistanceX > (player.hitbox.width / 2 + this.hitbox.radius)) {
            return false;
        }
        if (circleDistanceY > (player.hitbox.height / 2 + this.hitbox.radius)) {
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

        return cornerDistance_sq <= (this.hitbox.radius ** 2);
    }
    AttackPlayer() {
        let isHit = this.checkCollision()
        if (isHit) {
            this.life = -1
            player.life -= 1
            // console.log(player.life)
            // console.log('hit player')
        }
    }

}