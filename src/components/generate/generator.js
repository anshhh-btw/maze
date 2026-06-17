export function randint(min, max) {
    return ~~(Math.random() * (max - min) + min)
}

function choice(array) {
    return array[randint(0, array.length)]
}

function shuffle(array) {
    let shuffled = []
    const max = array.length
    for (let i = 0; i < max; i++) {
        let index = randint(0, array.length)
        shuffled.push(array[index])
        array.splice(index, 1)
    }
    return shuffled
}

class Maze {
    constructor(size, start, end) {
        this.array;
        this.size = size;
        this.start = this.getIndex(start)
        this.end = this.getIndex(end)
        this.changesStorage = [];
        this.sol = [];
        this.algorithm = 0;
    }

    generate(using, storeChanges) {
        this.array = Array(this.size[0] * this.size[1]).fill(0b00000000);
        this.algorithm = using;
        switch (using) {
            case 0:
                this.backtracking(storeChanges);
                break;
            case 1:
                this.kruskals(storeChanges);
                break;
            case 2:
                this.prims(storeChanges);
                break;
            case 3:
                this.wilsons(storeChanges);
                break;
        }
        this.refine()
    }

    getCoords(index) {
        return [Math.floor(index / this.size[1]), index % this.size[1]]
    }

    getIndex(coords) {
        return this.size[1] * coords[0] + coords[1]
    }

    getAdjacent(index) {
        let coords = this.getCoords(index)
        return {
            0b00000001: coords[0] > 0 ? this.getIndex([coords[0] - 1, coords[1]]) : null,
            0b00000010: coords[1] < this.size[1] - 1 ? this.getIndex([coords[0], coords[1] + 1]) : null,
            0b00000100: coords[0] < this.size[0] - 1 ? this.getIndex([coords[0] + 1, coords[1]]) : null,
            0b00001000: coords[1] > 0 ? this.getIndex([coords[0], coords[1] - 1]) : null
        }
    }

    getOppositeDir(dir) {
        switch (dir) {
            case 0b00000001:
                return 0b00000100;
            case 0b00000010:
                return 0b00001000;
            case 0b00000100:
                return 0b00000001;
            case 0b00001000:
                return 0b00000010;
        }
    }

    backtracking(storeChanges) {
        this.array[this.start] |= 0b01000000;
        let path = [this.start];

        while (path.length !== 0) {
            let currPos = path.pop()
            let adjacents = this.getAdjacent(currPos)
            let available = Object.keys(adjacents).filter((dir) => { return (!(this.array[adjacents[dir]] & 0b01000000) && (adjacents[dir] !== null)) ? dir : 0 })
            if (available.length !== 0) {
                path.push(currPos)
                let nextDir = Number(choice(available))
                let nextPos = adjacents[nextDir]
                this.array[currPos] |= nextDir
                this.array[nextPos] |= (0b01000000 | this.getOppositeDir(nextDir))
                if (storeChanges) {
                    this.changesStorage.push([[currPos, this.array[currPos]], [nextPos, this.array[nextPos]]])
                }
                path.push(nextPos)
            }
        }
    }

    kruskals(storeChanges) {
        let walls = []
        for (let i = 0; i < this.array.length; i++) {
            let adjacents = this.getAdjacent(i)
            for (let each of Object.values(adjacents)) {
                if (i < each && each !== null) {
                    walls.push([i, each])
                }
            }
        }
        let cells = Array.from({ length: this.array.length }, (_, index) => { return index })
        walls = shuffle(walls)
        function find(i) {
            while (cells[i] !== i) {
                i = cells[i]
            }
            return i
        }
        for (let i = 0; i < walls.length; i++) {
            let wall = walls[i]
            let root0 = find(wall[0])
            let root1 = find(wall[1])
            if (root0 !== root1) {
                cells[root0] = root1;
                let adjacents = this.getAdjacent(wall[0])
                let dir = Number(Object.keys(Object.fromEntries(Object.entries(adjacents).filter(([key, value]) => { return (value === wall[1]) ? [key, value] : 0; })))[0])
                this.array[wall[0]] |= dir
                this.array[wall[1]] |= this.getOppositeDir(dir)
                if (storeChanges) {
                    this.changesStorage.push([[wall[0], this.array[wall[0]]], [wall[1], this.array[wall[1]]]])
                }
            }
        }
    }

    prims(storeChanges) {
        let pickedCell = randint(0, this.array.length);
        this.array[pickedCell] |= 0b01000000;
        function getWalls(mazeObject, index) {
            let adjacents = mazeObject.getAdjacent(index)
            let nearbyCells = Object.entries(adjacents).filter(([dir, i]) => { return ((i !== null) && !(mazeObject.array[i] & 0b01000000)) ? true : false })
            let nearbyWalls = []
            for (let [dir, i] of nearbyCells) {
                nearbyWalls.push([parseInt(dir, 10), i, index])
            }
            return nearbyWalls
        }

        let walls = []
        walls = [...walls, ...getWalls(this, pickedCell)]

        while (walls.length !== 0) {
            let wallIndex = randint(0, walls.length)
            let wall = walls[wallIndex]
            if (!(this.array[wall[1]] & 0b01000000)) {
                this.array[wall[1]] |= 0b01000000;
                this.array[wall[2]] |= Number(wall[0])
                this.array[wall[1]] |= this.getOppositeDir(Number(wall[0]))
                walls = [...walls, ...getWalls(this, wall[1])]
                if (storeChanges) {
                    this.changesStorage.push([[wall[2], this.array[wall[2]]], [wall[1], this.array[wall[1]]]])
                }
            }
            walls.splice(wallIndex, 1)
        }
    }

    wilsons(storeChanges) {
        let visitedCells = new Set()
        let indicesUnvisited = shuffle(Array.from({ length: this.array.length }, (_, index) => index))

        let randomCell = indicesUnvisited.pop()
        this.array[randomCell] |= 0b01000000;
        visitedCells.add(randomCell)

        while (visitedCells.size < this.array.length) {
            let startCell = null;
            while (indicesUnvisited.length > 0) {
                let cell = indicesUnvisited[indicesUnvisited.length - 1];
                if (!visitedCells.has(cell)) {
                    startCell = cell;
                    break;
                }
                indicesUnvisited.pop();
            }
            if (startCell === null) break;

            let currPos = startCell;
            let walk = [currPos]
            let dirStore = []

            while (!visitedCells.has(currPos)) {
                let adjacents = this.getAdjacent(currPos)
                let available = Object.entries(adjacents).filter(([dir, i]) => i !== null)

                let nextCell = choice(available)
                let nextDir = Number(nextCell[0])
                let nextPos = Number(nextCell[1])

                let loopIndex = walk.indexOf(nextPos);
                if (loopIndex > -1) {
                    walk.splice(loopIndex + 1);
                    dirStore.splice(loopIndex);
                    currPos = nextPos;
                } else {
                    dirStore.push(nextDir)
                    currPos = nextPos;
                    walk.push(currPos);
                }
            }

            for (let i = 0; i < walk.length - 1; i++) {
                let u = walk[i];
                let v = walk[i + 1];
                let dir = dirStore[i];

                this.array[u] |= dir;
                this.array[v] |= this.getOppositeDir(dir);
                this.array[u] |= 0b01000000;
                this.array[v] |= 0b01000000;

                visitedCells.add(u);
                if (storeChanges) {
                    this.changesStorage.push([[u, this.array[u]], [v, this.array[v]]]);
                }
            }
            visitedCells.add(walk[walk.length - 1]);
        }
    }

    drawing(canvas, ppt, bgColor, borderColor, borderWidth, solColor, solWidth, startEndColor) {
        this.ctx = canvas.getContext('2d')
        this.ppt = ppt;
        this.bgColor = bgColor
        this.borderColor = borderColor
        this.borderWidth = borderWidth
        this.solColor = solColor
        this.solWidth = solWidth
        this.startEndColor = startEndColor;

        canvas.width = this.ppt * this.size[1]
        canvas.height = this.ppt * this.size[0]
    }

    drawCell(index, dirByte, solution) {
        let coords = this.getCoords(index)
        let topLeftCorner = [coords[0] * this.ppt, coords[1] * this.ppt];
        let dir = dirByte;
        this.ctx.fillStyle = this.borderColor
        this.ctx.fillRect(topLeftCorner[1], topLeftCorner[0], this.ppt, this.ppt);
        this.ctx.fillStyle = ((index === this.start) || (index === this.end)) ? this.startEndColor : this.bgColor
        this.ctx.fillRect(topLeftCorner[1] + this.borderWidth, topLeftCorner[0] + this.borderWidth, this.ppt - (2 * this.borderWidth), this.ppt - (2 * this.borderWidth));

        if (dir & 0b00000001) {
            this.ctx.fillRect(topLeftCorner[1] + this.borderWidth, topLeftCorner[0], this.ppt - (2 * this.borderWidth), this.borderWidth)
        }
        if (dir & 0b00000010) {
            this.ctx.fillRect(topLeftCorner[1] - this.borderWidth + this.ppt, topLeftCorner[0] + this.borderWidth, this.borderWidth, this.ppt - (2 * this.borderWidth))
        }
        if (dir & 0b00000100) {
            this.ctx.fillRect(topLeftCorner[1] + this.borderWidth, topLeftCorner[0] + this.ppt - this.borderWidth, this.ppt - (2 * this.borderWidth), this.borderWidth)
        }
        if (dir & 0b00001000) {
            this.ctx.fillRect(topLeftCorner[1], topLeftCorner[0] + this.borderWidth, this.borderWidth, this.ppt - (2 * this.borderWidth));
        }
        if (solution && (this.array[index] & 0b00010000)) {
            let middle = Math.floor(this.ppt / 2);
            this.ctx.fillStyle = this.solColor
            let previousCell = this.sol[this.sol.indexOf(index) - 1]
            let nextCell = this.sol[this.sol.indexOf(index) + 1]
            let gateList = []
            let widthMiddle = Math.floor(this.solWidth / 2)
            if (previousCell !== undefined) {
                if (previousCell + 1 === index) {
                    gateList.push(0b00001000)
                }
                if (previousCell - 1 === index) {
                    gateList.push(0b00000010)
                }
                if (previousCell + this.size[1] === index) {
                    gateList.push(0b00000001)
                }
                if (previousCell - this.size[1] === index) {
                    gateList.push(0b00000100)
                }
            }
            if (nextCell !== undefined) {
                if (nextCell + 1 === index) {
                    gateList.push(0b00001000)
                }
                if (nextCell - 1 === index) {
                    gateList.push(0b00000010)
                }
                if (nextCell + this.size[1] === index) {
                    gateList.push(0b00000001)
                }
                if (nextCell - this.size[1] === index) {
                    gateList.push(0b00000100)
                }
            }
            for (let dir of gateList) {
                if (dir & 0b00000001) {
                    this.ctx.fillRect(topLeftCorner[1] + middle - widthMiddle, topLeftCorner[0], this.solWidth, middle)
                }
                if (dir & 0b00000100) {
                    this.ctx.fillRect(topLeftCorner[1] + middle - widthMiddle, topLeftCorner[0] + middle - widthMiddle, this.solWidth, middle)
                }
                if (dir & 0b00000010) {
                    this.ctx.fillRect(topLeftCorner[1] + middle - widthMiddle, topLeftCorner[0] + middle - widthMiddle, middle, this.solWidth)
                }
                if (dir & 0b00001000) {
                    this.ctx.fillRect(topLeftCorner[1], topLeftCorner[0] + middle - widthMiddle, middle, this.solWidth)
                }
            }
        }
    }

    drawFrame(frame) {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.ppt * this.size[1], this.ppt * this.size[0])
        if (frame === -1) {
            for (let i = 0; i < this.array.length; i++) {
                this.drawCell(i, this.array[i], false)
            }
            return;
        }
        for (let i = 0; i < frame; i++) {
            let cellsAltered = this.changesStorage[i]
            this.drawCell(cellsAltered[0][0], cellsAltered[0][1]);
            this.drawCell(cellsAltered[1][0], cellsAltered[1][1]);
        }
    }


    refine() {
        const mask = ~(1 << 6);
        for (let i = 0; i < this.array.length; i++) {
            this.array[i] = this.array[i] & mask;
        }
    }

    solve(storeSolPath) {
        let path = [];
        let currPos = this.start;
        let endPos = this.end;
        while (currPos !== endPos) {
            path.push(currPos)
            this.array[currPos] |= (0b01000000 | 0b00010000);
            let availableDirection = Object.entries(this.getAdjacent(currPos)).filter(([dir, index]) => {
                return ((index !== null) && (this.array[currPos] & dir) && !(this.array[index] & 0b01000000))
            });
            if (availableDirection.length === 0) {
                path.pop()
                this.array[currPos] ^= 0b00010000;
                currPos = path.pop()
                continue;
            }
            let nextCell = choice(availableDirection);
            let nextPos = nextCell[1]
            currPos = nextPos;
        }
        path.push(endPos)
        this.array[endPos] |= 0b00010000;
        if (storeSolPath) {
            this.sol = path;
        }
    }

    drawSolFrame(frame, lastFrameOnCanvas) {
        for (let i = lastFrameOnCanvas; i <= frame; i++) {
            let cellAltered = this.sol[i]
            this.drawCell(cellAltered, this.array[cellAltered], true);
        }
    }

    serialize() {
        let mask = 0b00001111;
        let structureData = this.array.map((byte) => {
            return (byte & mask).toString(16);
        }).join("")
        let metaData = [...this.size, ...this.getCoords(this.start), ...this.getCoords(this.end)].map(num => num.toString(10)).join("_")
        let imageData = [this.ppt, this.borderWidth, this.solWidth].map(num => num.toString(10)).join("_")
        let colorData = [this.bgColor, this.borderColor, this.solColor, this.startEndColor].map(c => c.replace("#", "")).join("_")
        return [structureData, metaData, imageData, colorData].join("-")
    }

    drawArray() {
        for (let i = 0; i < this.array.length; i++) {
            this.drawCell(i, this.array[i], false);
        }
    }

    clearCanvas() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.size[1] * this.ppt, this.size[0] * this.ppt);
    }
}

export default Maze;


// let c = [0b00000100, 0b00000010, 0b00001010, 0b00001010, 0b00001010, 0b00001010, 0b00001010, 0b00001010, 0b00001000, 0b00000100,
//     0b00000101, 0b00000110, 0b00001010, 0b00001010, 0b00001100, 0b00000110, 0b00001010, 0b00001010, 0b00001100, 0b00000101,
//     0b00000101, 0b00000101, 0b00000010, 0b00001000, 0b00000101, 0b00000101, 0b00000010, 0b00001000, 0b00000101, 0b00000101,
//     0b00000101, 0b00000101, 0b00000010, 0b00001000, 0b00000101, 0b00000101, 0b00000010, 0b00001000, 0b00000101, 0b00000101,
//     0b00000101, 0b00000101, 0b00000010, 0b00001000, 0b00000011, 0b00001001, 0b00000010, 0b00001000, 0b00000101, 0b00000101,
//     0b00000101, 0b00000101, 0b00000010, 0b00001010, 0b00001010, 0b00001010, 0b00001010, 0b00001000, 0b00000101, 0b00000101,
//     0b00000101, 0b00000101, 0b00000010, 0b00001010, 0b00001010, 0b00001010, 0b00001010, 0b00001000, 0b00000101, 0b00000101,
//     0b00000101, 0b00000101, 0b00000010, 0b00001010, 0b00001010, 0b00001010, 0b00001010, 0b00001000, 0b00000101, 0b00000101,
//     0b00000101, 0b00000101, 0b00000010, 0b00001010, 0b00001010, 0b00001010, 0b00001010, 0b00001000, 0b00000101, 0b00000101,
//     0b00000011, 0b00001001, 0b00000010, 0b00001010, 0b00001010, 0b00001010, 0b00001010, 0b00001000, 0b00000011, 0b00001001]
// let t = '42aaaaaa8456aac6aac5552855285555285528555528392855552aaaa855552aaaa855552aaaa855552aaaa855392aaaa839-10_10_0_0_9_9-40_5_5-121214_39ff14_ffffff_121214'