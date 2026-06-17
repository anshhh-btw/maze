import cupIcon from '../../assets/svgs/cup.svg'
import Maze, { randint } from '../generate/generator.js'
import { useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';

function PlayableMaze({ mazeSerial, playAgain, victoryText }) {
    const canvasRef = useRef(null);
    const canvasBoxRef = useRef(null);
    const celebrationeRef = useRef(null);
    const page404Ref = useRef(null);
    const navigate = useNavigate()

    const touchStart = useRef(null);
    const touchEnd = useRef(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        touchEnd.current = null;
        const touch = e.targetTouches[0];
        touchStart.current = {
            x: touch.clientX,
            y: touch.clientY
        };
    };

    const onTouchMove = (e) => {
        const touch = e.targetTouches[0];
        touchEnd.current = {
            x: touch.clientX,
            y: touch.clientY
        };
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;

        const distanceX = touchStart.current.x - touchEnd.current.x;
        const distanceY = touchStart.current.y - touchEnd.current.y;

        const absX = Math.abs(distanceX);
        const absY = Math.abs(distanceY);

        if (absX > absY) {
            if (absX > minSwipeDistance) {
                if (distanceX > 0) {
                    left()
                } else {
                    right()
                }
            }
        } else {
            if (absY > minSwipeDistance) {
                if (distanceY > 0) {
                    up()
                } else {
                    down()
                }
            }
        }
    };

    var currPos;
    var mazeObject;
    var path = new Set()
    function deserialize(serial) {
        const [structureData, metaData, imageData, colorData] = serial.split("-");
        const array = structureData.split("").map(num => parseInt(num, 16));
        const [height, width, startY, startX, endY, endX] = metaData.split("_").map(item => parseInt(item));
        const [ppt, borderWidth, solWidth] = imageData.split("_").map(item => parseInt(item));
        const [bgColor, borderColor, solColor, startEndColor] = colorData.split("_").map(item => `#${item}`)
        const maze = new Maze([height, width], [startY, startX], [endY, endX]);
        maze.array = array;
        maze.drawing(canvasRef.current, ppt, bgColor, borderColor, borderWidth, solColor, solWidth, startEndColor)
        currPos = maze.start;
        return maze;
    }
    useEffect(() => {
        mazeObject = deserialize(mazeSerial)
        mazeObject.drawArray()
    }, [])

    function checkMovable(currPos, dir) {
        return (mazeObject.array[currPos] & dir);
    }

    function up() {
        if (checkMovable(currPos, 0b00000001)) {
            drawPath(currPos, 0b00000001)
        }
    }
    function right() {
        if (checkMovable(currPos, 0b00000010)) {
            drawPath(currPos, 0b00000010)
        }
    }
    function down() {
        if (checkMovable(currPos, 0b00000100)) {
            drawPath(currPos, 0b00000100)
        }
    }
    function left() {
        if (checkMovable(currPos, 0b00001000)) {
            drawPath(currPos, 0b00001000)
        }
    }

    function drawPath(fromIndex, dir) {
        let middle = Math.floor(mazeObject.ppt / 2);
        mazeObject.ctx.fillStyle = mazeObject.solColor
        let widthMiddle = Math.floor(mazeObject.solWidth / 2)

        let toIndex = Object.entries(mazeObject.getAdjacent(fromIndex)).filter(([dirn, index]) => { return ((index !== null) && (dir === Number(dirn))) ? true : false })[0][1]
        let drawErase = 0; // 0 draw 1 erase

        if (!path.has(toIndex)) {
            if (!path.has(fromIndex)) {
                path.add(fromIndex)
            }
            path.add(toIndex);
            drawErase = 0;
        } else {
            if (path.has(fromIndex)) {
                path.delete(fromIndex)
            }
            path.delete(toIndex)
            drawErase = 1;
        }


        let topLeftCorner1 = mazeObject.getCoords(fromIndex).map(num => num * mazeObject.ppt)
        let topLeftCorner2 = mazeObject.getCoords(toIndex).map(num => num * mazeObject.ppt)
        let oppDir = mazeObject.getOppositeDir(dir);
        mazeObject.ctx.fillStyle = mazeObject.solColor;

        if (drawErase) {
            mazeObject.ctx.fillStyle = mazeObject.bgColor;
        }
        if (dir & 0b00000001) {
            mazeObject.ctx.fillRect(topLeftCorner1[1] + middle - widthMiddle, topLeftCorner1[0], mazeObject.solWidth, middle)
        }
        if (dir & 0b00000100) {
            mazeObject.ctx.fillRect(topLeftCorner1[1] + middle - widthMiddle, topLeftCorner1[0] + middle - widthMiddle, mazeObject.solWidth, middle)
        }
        if (dir & 0b00000010) {
            mazeObject.ctx.fillRect(topLeftCorner1[1] + middle - widthMiddle, topLeftCorner1[0] + middle - widthMiddle, middle, mazeObject.solWidth)
        }
        if (dir & 0b00001000) {
            mazeObject.ctx.fillRect(topLeftCorner1[1], topLeftCorner1[0] + middle - widthMiddle, middle, mazeObject.solWidth)

        }
        mazeObject.ctx.fillStyle = mazeObject.solColor;
        if (drawErase) {
            mazeObject.ctx.fillStyle = mazeObject.bgColor;
        }
        if (oppDir & 0b00000001) {
            mazeObject.ctx.fillRect(topLeftCorner2[1] + middle - widthMiddle, topLeftCorner2[0], mazeObject.solWidth, middle)
        }
        if (oppDir & 0b00000100) {
            mazeObject.ctx.fillRect(topLeftCorner2[1] + middle - widthMiddle, topLeftCorner2[0] + middle - widthMiddle, mazeObject.solWidth, middle)
        }
        if (oppDir & 0b00000010) {
            mazeObject.ctx.fillRect(topLeftCorner2[1] + middle - widthMiddle, topLeftCorner2[0] + middle - widthMiddle, middle, mazeObject.solWidth)
        }
        if (oppDir & 0b00001000) {
            mazeObject.ctx.fillRect(topLeftCorner2[1], topLeftCorner2[0] + middle - widthMiddle, middle, mazeObject.solWidth)
        }


        mazeObject.array[fromIndex] ^= 0b00010000;
        mazeObject.array[toIndex] ^= 0b00010000;
        currPos = toIndex;

        if (currPos === mazeObject.end) {
            winningCelebration()
        }
    }

    function winningCelebration() {
        canvasBoxRef.current.style.display = "none";
        celebrationeRef.current.style.display = "flex";
    }



    return (<>
        <div id='play'>
            <div id='canvasBox' onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd} ref={canvasBoxRef} tabIndex={0} onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        up()
                    }
                    if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        down()
                    }
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault()
                        left()
                    }
                    if (e.key === 'ArrowRight') {
                        e.preventDefault()
                        right()
                    }
                }}>
                <canvas ref={canvasRef}></canvas>
            </div>
            <div id='celebration' ref={celebrationeRef}>
                <div id='cupImage'>
                    <img src={cupIcon} alt="" />
                </div>
                <h1>{victoryText}</h1>
                <div id='celebrationButtons' style={{ display: playAgain ? "flex" : "none" }}>
                    <button onClick={
                        () => {
                            mazeObject.generate(randint(0, 4));
                            let serial = mazeObject.serialize()
                            navigate(`https://anshhh-btw.github.io/maze/play/${serial}`)
                            window.location.reload(true)
                        }}>Play New</button>
                </div>
            </div>

        </div >
    </>)
}

export default PlayableMaze;