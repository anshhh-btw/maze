

import { useEffect, useRef, useState } from 'react';
import './generate.css';
import Maze from './generator.js'

import pauseIcon from '../../assets/svgs/pause.svg'
import resumeIcon from '../../assets/svgs/resume.svg'
import skipNextIcon from '../../assets/svgs/skipNext.svg'
import skipPreviousIcon from '../../assets/svgs/skipPrevious.svg'
import rewindIcon from '../../assets/svgs/rewind.svg'
import noRewindIcon from '../../assets/svgs/noRewind.svg'
import { useNavigate, useParams } from 'react-router';


function Generate() {
    const [copyStatus, setCopyStatus] = useState('COPY')
    const navigate = useNavigate()
    var { mazeData } = useParams()
    const [limittingData, setLimittingData] = useState([9, 9, 40]);
    const canvasRef = useRef(null);
    const mazeRef = useRef(null);
    const intervalRef = useRef(null);
    const formRef = useRef(null);
    const [viewMode, setViewMode] = useState(false);
    const [playMode, setPlayMode] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(99);
    const [maxFrame, setMaxFrame] = useState(99);
    const [playState, setPlayState] = useState(false);

    function generateMaze() {
        const formData = Object.fromEntries(new FormData(formRef.current))
        mazeRef.current = new Maze([Number(formData['height']), Number(formData['width'])], [Number(formData['startingCoordY']), Number(formData['startingCoordX'])], [Number(formData['endingCoordY']), Number(formData['endingCoordX'])]);
        mazeRef.current.generate(Number(formData['algorithm']), true);
        mazeRef.current.drawing(canvasRef.current, Number(formData['ppt']), formData['bgColor'], formData['borderColor'], Number(formData['borderWidth']), formData['solColor'], Number(formData['solWidth']), formData['startEndColor']);
        mazeRef.current.solve(true)

        const total = viewMode ? mazeRef.current.sol.length : mazeRef.current.changesStorage.length;

        if (viewMode) {
            mazeRef.current.drawFrame(total, 0);
            mazeRef.current.drawSolFrame(total, 0);
        } else {
            mazeRef.current.drawFrame(total, 0);
        }
        setPlayState(false);
        setCurrentFrame(total);
        setMaxFrame(total);
    }

    useEffect(generateMaze, [])


    useEffect(() => {
        if (!mazeRef.current) return;

        if (viewMode) {
            mazeRef.current.drawFrame(mazeRef.current.changesStorage.length, 0)
            mazeRef.current.drawSolFrame(currentFrame, 0);
        } else {
            mazeRef.current.drawFrame(currentFrame, 0)
        }
    }, [currentFrame, viewMode])

    useEffect(() => {
        if (!mazeRef.current) return;
        const total = viewMode ? mazeRef.current.sol.length : mazeRef.current.changesStorage.length;
        setCurrentFrame(total);
        setMaxFrame(total);
    }, [viewMode])

    useEffect(() => {
        if (!playState) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setCurrentFrame((prevFrame) => {
                if (!playMode) {
                    if (prevFrame < maxFrame) {
                        return prevFrame + 1;
                    } else {
                        setPlayState(false);
                        return prevFrame;
                    }
                } else {
                    if (prevFrame > 0) {
                        return prevFrame - 1;
                    } else {
                        setPlayState(false);
                        return prevFrame;
                    }
                }
            });
        }, 100);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [playState, playMode, maxFrame]);

    return (
        <div id='generate'>
            <div id='generateLeft'>
                <div id='mazeBox'>
                    <canvas ref={canvasRef} id='generateCanvas'></canvas>
                </div>
                <div id='mazeControl'>
                    <div>
                        <div id='mazeControlTop'>
                            <button id='controlFor' onClick={() => {
                                setPlayState(false);
                                setViewMode(!viewMode);
                            }}>{viewMode ? "Solution" : "Maze"}</button>

                            <button id='controlRewind' style={{ backgroundColor: playMode ? "#39FF14" : "transparent" }} onClick={() => {
                                setPlayMode(!playMode);
                            }}><img src={playMode ? rewindIcon : noRewindIcon} alt="Rewind Mode" /></button>
                        </div>

                        <div id='frameController'>
                            <button id="controlPrevious" onClick={() => {
                                setPlayState(false);
                                setCurrentFrame(prev => prev - (prev > 0 ? 1 : 0));
                            }}><img src={skipPreviousIcon} alt="Previous Frame" /></button>

                            <button id="controlPause" onClick={() => {
                                setPlayState(!playState);
                            }}><img src={playState ? pauseIcon : resumeIcon} alt="Play/Pause" /></button>

                            <button id="controlNext" onClick={() => {
                                setPlayState(false);
                                setCurrentFrame(prev => prev + (prev < maxFrame ? 1 : 0));
                            }}><img src={skipNextIcon} alt="Next Frame" /></button>
                        </div>
                    </div>
                    <div id='framesInfo'>
                        <p>CURRENT FRAME: <span id="currentFrame">{currentFrame}</span></p>
                        <p>TOTAL FRAMES: <span id="totalFrames">{maxFrame}</span></p>
                    </div>
                </div>
            </div>
            <div id='generateRight'>
                <form ref={formRef} onSubmit={(e) => {
                    e.preventDefault()
                    generateMaze()
                }}>
                    <div>
                        <h3>MAZE SETTINGS</h3>
                        <div id='mazeSettings'>
                            <div>
                                <p>DIMENSIONS (W x H)</p>
                                <div>
                                    <input type='number' min="1" max="75" required defaultValue="10" name="width" onChange={(e) => {
                                        setLimittingData([Number(e.currentTarget.value) - 1, limittingData[1], limittingData[2]])
                                    }}></input>
                                    <p> x </p>
                                    <input type='number' min="1" max="75" required defaultValue="10" name='height' onChange={(e) => {
                                        setLimittingData([limittingData[0], Number(e.currentTarget.value) - 1, limittingData[2]])
                                    }}></input>
                                </div>
                            </div>
                            <div>
                                <p>START COORDINATES (X,Y)</p>
                                <div>
                                    <input type='number' min="0" name='startingCoordX' required defaultValue="0" max={limittingData[0]}></input>
                                    <p>,</p>
                                    <input type='number' min="0" name='startingCoordY' required defaultValue="0" max={limittingData[1]}></input>
                                </div>
                            </div>
                            <div>
                                <p>END COORDINATES (X,Y) </p>
                                <div>
                                    <input type='number' min="0" name='endingCoordX' required defaultValue="9" max={limittingData[0]}></input>
                                    <p>,</p>
                                    <input type='number' min="0" name='endingCoordY' required defaultValue="9" max={limittingData[1]}></input>
                                </div>
                            </div>
                            <div>
                                <p>ALGORITHM: </p>
                                <select name='algorithm' required>
                                    <option value="0">DEPTH-FIRST SEARCH ALGORITHM</option>
                                    <option value="1">KRUSKAL'S ALGORITHM</option>
                                    <option value="2">PRIM'S ALGORITHM</option>
                                    <option value="3">WILSON'S ALGORITHM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>IMAGE SETTINGS</h3>
                        <div id='imageSettings'>
                            <div id='imagePixelSettings'>
                                <div>
                                    <p>TILE RESOLUTION (PX)</p>
                                    <input type='number' name='ppt' min="5" max="75" defaultValue="40" required onChange={(e) => {
                                        setLimittingData([limittingData[0], limittingData[1], Math.floor(Number(e.target.value) / 3)])
                                    }}></input>
                                </div>
                                <div>
                                    <p>BORDER WIDTH (PX)</p>
                                    <input type='number' name='borderWidth' min="2" defaultValue="5" required max={limittingData[2]}></input>
                                </div>
                                <div>
                                    <p>SOLUTION WIDTH (PX)</p>
                                    <input type='number' name='solWidth' min="1" defaultValue="5" required max={limittingData[2]}></input>
                                </div>
                            </div>
                            <div id='imageSettingsBottom'>
                                <div id='colorProfile'>
                                    <p>COLOR PROFILE</p>
                                    <div>
                                        <div>
                                            <p>BG</p>
                                            <input type='color' name='bgColor' defaultValue="#121214" required style={{ background: "#121214" }} onInput={(e) => {
                                                e.currentTarget.style.background = e.currentTarget.value;
                                            }}></input>
                                        </div>
                                        <div>
                                            <p>WALL</p>
                                            <input type='color' name='borderColor' defaultValue="#39FF14" required style={{ background: "#39FF14" }} onInput={(e) => {
                                                e.currentTarget.style.background = e.currentTarget.value;
                                            }}></input>
                                        </div>
                                        <div>
                                            <p>PATH</p>
                                            <input type='color' name='solColor' defaultValue="#FFFFFF" required style={{ background: "#FFFFFF" }} onInput={(e) => {
                                                e.currentTarget.style.background = e.currentTarget.value;
                                            }}></input>
                                        </div>
                                    </div>
                                </div>
                                <div id='startEndColorSettings'><p>COLOR START AND END CELLS</p><input type="color" name='startEndColor' required defaultValue="#121214" style={{ background: "#121214" }} onInput={(e) => {
                                    e.currentTarget.style.background = e.currentTarget.value;
                                }} /></div>
                            </div>
                        </div>
                    </div>
                    <div id='formButtons'>
                        <button type='submit'>GENERATE</button>
                        <button type='button' onClick={(e) => {
                            navigator.clipboard.writeText(`https://anshhh-btw.github.io/maze/play/${mazeRef.current.serialize()}`)
                            setCopyStatus('COPIED!')
                            setTimeout(() => {
                                setCopyStatus('COPY')
                            }, 2000)
                        }}>{copyStatus}</button>
                        <button type='button' onClick={() => {
                            let string = mazeRef.current.serialize()
                            navigate(`https://anshhh-btw.github.io/maze/play/${string}`)
                        }}>PLAY</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Generate;
