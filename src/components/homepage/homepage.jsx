import { useEffect, useRef, useState } from "react";
import Maze, { randint } from "../generate/generator.js";
import "./homepage.css";
import { Link, useNavigate } from "react-router-dom";
import PlayableMaze from "../play/playable";


function Homepage() {
  let ogText = `At its core, a maze is a complex, branching puzzle of pathways designed to challenge navigation and problem-solving. While people often use the words "maze" and "labyrinth" interchangeably, they are fundamentally different. A classical labyrinth is unicursal—meaning it has only one single, winding path that leads to the center with no choices or dead ends. A maze, however, is multicursal. It is an intricate network of choices, intentionally packed with dead ends, loops, and intersections designed to misdirect and confuse the solver. `;
  let extraText = `
  To a computer scientist or mathematician, a maze is much more than a simple game; it is a physical representation of a graph. Every pathway is treated as an edge, and every intersection or dead end is a vertex (node). Because a perfect maze contains exactly one unique path between any two points, it functions structurally as a spanning tree. This mathematical foundation is what allows us to use logic and code to construct them.

By utilizing specific algorithms, we can carve out these paths using rules of randomness and geometry. Whether using a depth-first search to bore deep, winding corridors or Kruskal's algorithm to build a chaotic web of walls, creating a maze is a perfect marriage of ancient puzzle design and modern computer science. `;
  const [isExpanded, setExpanded] = useState(false);
  const canvasRef = useRef(null);

  const timeline = [
    [
      0,
      "Ancient Roots",
      "Millennia ago, the Greeks built the Labyrinth of Crete to trap the legendary Minotaur. Unlike a modern puzzle, it was a single unicursal spiritual journey designed for absolute containment. It represented structure before choice."
    ],
    [
      1,
      "The Formalization",
      "In 1736, mathematician Leonhard Euler solved the Seven Bridges of Königsberg problem, laying the groundwork for Graph Theory. This transformed physical pathways into abstract networks of vertices and edges, changing how we analyze mazes forever."
    ],
    [
      2,
      "The 1980s Arcade Boom",
      "Mazes entered the digital age. Game developers hardcoded routing logic into classics like Pac-Man to dictate ghost movements, while global Micromouse competitions challenged engineers to build physical autonomous robots that could map and solve mazes in real time."
    ],
    [
      3,
      "Algorithmic Revolution",
      "Computer scientists adapted classic tree and graph algorithms—like Depth-First Search, Prim's, and Kruskal's—to procedurally carve perfect mazes. The puzzle transformed from hand-drawn art into a flawless playground for mathematical execution."
    ],
    [
      4,
      "Modern Computational Sandbox",
      "Today, mazes are the ultimate testing ground for AI training, pathfinding optimizations, and machine learning models. A simple grid of walls serves as a baseline benchmark for testing routing efficiency in cutting-edge computer science."
    ]
  ];

  const [currTime, setCurrTime] = useState(0)
  const [currTimePress, setCurrTimePress] = useState(0)

  const navigate = useNavigate()

  return (
    <>
      <section id="section1">
        <div id="section1left">
          <h1>Lose Yourself in the Logic</h1>
          <h3>An interactive playground to play, generate and enjoy.</h3>
          <button onClick={() => { navigate('https://anshhh-btw.github.io/maze/generate') }}>Generate a Maze</button>
        </div>
        <div id="section1right">
          <PlayableMaze victoryText={'Congratulations! Go ahead, explore the playground'} mazeSerial={"42aaaaaa8456aac6aac5552855285555285528555528392855552aaaa855552aaaa855552aaaa855552aaaa855392aaaa839-10_10_0_0_9_9-40_5_5-121214_39ff14_ffffff_121214"} playAgain={false} />
        </div>
      </section>

      <section id="section2">
        <h1>What is a Maze?</h1>
        <p>
          {isExpanded ? ogText + extraText : ogText}
          <span
            onClick={(e) => {
              e.target.innerText = isExpanded ? "Read more" : "Read less";
              setExpanded(isExpanded ? false : true);
            }}
          >
            Read more
          </span>
        </p>
      </section>

      <section id="section3">
        <h1>History of Maze</h1>
        <div id="timeline">
          <div id="timelineUp" className="timelineControls" style={{ opacity: timeline[currTime][0] === 0 ? "0" : "1" }}>
            <div className="timelineLine"></div>
            <div className="timelineDot" onClick={(e) => {
              if (currTimePress === 0) {
                setCurrTimePress(1)
                setTimeout(() => {
                  setCurrTime(currTime - 1);
                }, 1500)
                setTimeout(() => {
                  setCurrTimePress(0)
                }, 3000)
              }
            }}></div>
          </div>
          <div id='timelineCard' className={currTimePress === 1 ? "timelineCardAnimate" : (currTimePress === 0 ? "" : "timelineCardAnimateReverse")}>
            <h3>{timeline[currTime][1]}</h3>
            <p>{timeline[currTime][2]}</p>
          </div>
          <div id="timelineDown" className="timelineControls" style={{ opacity: timeline[currTime][0] === timeline.length - 1 ? "0" : "1" }}>
            <div className="timelineLine"></div>
            <div className="timelineDot" onClick={(e) => {
              if (currTimePress === 0) {
                setCurrTimePress(-1)
                setTimeout(() => {
                  setCurrTime(currTime + 1);
                }, 1500)
                setTimeout(() => {
                  setCurrTimePress(0)
                }, 3000)
              }
            }}></div>
          </div>
        </div>
      </section>

      <section id="section4">
        <h1>Explore the Ground</h1>
        <div id="cardsContainer">
          <div className="card">
            <div>
              <h3>About the website</h3>
              <p>Read the journey of the Whys and Hows behind making this website. Dive into the architectural blueprints, discover the engineering choices that power the real-time grid generation, and explore the underlying math that transforms abstract logic into interactive pathways.</p>
            </div>
            <Link to={"./about"}>Read more →</Link>
          </div>
          <div className="card">
            <div>
              <h3>Algorithms</h3>
              <p>Go under the hood of procedural generation. Watch algorithms like Depth-First Search, Kruskal's, Prim's and Wilson's race through cells to carve out perfect grids in real-time.</p>
            </div>
            <Link to={"./algorithms"}>Explore more →</Link>
          </div>
          <div className="card">
            <div>
              <h3>Custom Generator</h3>
              <p>Take absolute control of the matrix. Configure your own grid dimensions, set custom start/end coordinates, adjust wall weights, and generate flawless structural paths instantly.</p>
            </div>
            <Link to={"./generate"}>Initialize Sandbox →</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Homepage;
