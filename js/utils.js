Array.prototype.parse2D = function () {
    const rows = []
    // thay doi i+= 16 tùy thuộc vào độ dài map
    for (let i = 0; i < this.length; i += canvasXBlock) {
        rows.push(this.slice(i, i + canvasXBlock))
    }
    return rows
}
Array.prototype.creatObjectsFrom2D = function (){
    const objects = []
    this.forEach((row, y) => {
        row.forEach((Symbol, x) => {
            if (Symbol === 292 || Symbol === 250) {
                objects.push(
                    new CollisionBlock({
                        position: {
                            x: x * 64,
                            y: y * 64
    
                        },
                    })
                )
            }
        })
    });
    return objects
}