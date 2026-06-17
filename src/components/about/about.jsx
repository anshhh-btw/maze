import inspirationIcon from '../../assets/svgs/inspiration.svg'
import sourceIcon from '../../assets/svgs/source.svg'
import wikipediaLogo from '../../assets/svgs/wikipediaLogo.svg';
import geminiLogo from '../../assets/svgs/geminiLogo.svg';
import complexIcon from '../../assets/svgs/complex.svg';
import optimizeIcon from '../../assets/svgs/optimize.svg';
import paletteIcon from '../../assets/svgs/palette.svg';
import bugIcon from '../../assets/svgs/bug.svg';
import roadmapIcon from '../../assets/svgs/roadmap.svg';

import './about.css'
import './responsive.css'

function About() {
    return (<div id="about">
        <h1>About the Project</h1>
        <div className="block">
            <h2 className="blockHead">Inspiration <img src={inspirationIcon}></img></h2>
            <div className="blockContent">
                <h4 id="block1qoute">A spark from mathematical theory, turned into a visual reality.</h4>
                <p>The inspiration for this project was drawn from Graph Theory. In graph theory terms, a standard "perfect maze" (one with no isolated loops and no inaccessible areas) is defined as a Spanning Tree. What is actually fascinating is seeing the distinct patterns in mazes created by different algorithms; for instance, Kruskal's algorithm generates smaller dead ends, whereas a Depth-First Search (DFS) yields much longer paths and dead ends. Furthermore, while some algorithms can scale to generate mazes as massive as a city, others rely heavily on recursion and fail on large scales due to maximum call stack limits. It is equally fascinating to explore different optimization methods, compressing the entire structural data of a maze from a kilobyte down to as little as 100 bytes.</p>
            </div>
        </div>
        <div className='pathLine'></div>
        <div className="block" id='block2'>
            <h2 className="blockHead">Knowledge Source & The Algorithm Codex <img src={sourceIcon}></img></h2>
            <div className="blockContent">
                <div className="block2Card">
                    <div className="block2CardLogo"><img src={wikipediaLogo} /><h4>Wikipedia</h4></div>
                    <p>While most rely on AI, I chose Wikipedia as my source for information regarding maze-generating algorithms, solving algorithms, and understanding graph theory because of the highly accurate content it provides.</p>
                </div>
                <div className="block2Card">
                    <div className="block2CardLogo"><img src={geminiLogo} /><h4>Gemini</h4></div>
                    <p>While I didn't rely on it exclusively, AI played an important role in clearing up my doubts and providing incredible ideas to make my logic cleaner and clearer.</p>
                </div>
            </div>
        </div>

        <div className='pathLine'></div>
        <div className='block'>
            <h2 className='blockHead'>Complexity & Challenges <img src={complexIcon}></img></h2>
            <div className='blockContent'>
                Translating complex graph algorithms like Kruskal’s and Prim’s from abstract mathematical theory into functional JavaScript presented a steep learning curve. Finally, rendering the maze dynamically onto an HTML5 Canvas and engineering the real-time collision detection logic required to make the grid completely playable added another layer of engineering complexity.
            </div>
        </div>
        <div className='pathLine'></div>
        <div className='block'>
            <h2 className='blockHead'>Optimization & Refactoring <img src={optimizeIcon}></img></h2>
            <div className='blockContent'>
                The concept of optimizing the maze generation and storage process is incredibly fascinating from an engineering perspective. The underlying logic is elegant: a maze can be modeled as a matrix of cells, where each cell contains four walls (or "gates"). Each gate exists in one of two binary states: open (1) or closed (0). Because each cell manages four independent gates, its entire structural state can be perfectly represented using just 4 bits of data. This yields 2<sup>4</sup> = 16 possible cell configurations, aligning perfectly with the base of the hexadecimal numbering system. Consequently, every single cell can be encoded as a single hexadecimal character from 0 to F. By leveraging this schema, an n * n maze requires exactly n * n characters to store its complete structural blueprint. To maximize runtime performance, the generation and storage engines utilize low-level bit manipulation, using bitwise operators to evaluate and mutate cell states instantly.
            </div>
        </div>
        <div className='pathLine'></div>
        <div className='block'>
            <h2 className='blockHead'>Design Philosophy <img src={paletteIcon}></img></h2>
            <div className='blockContent'>
                <p> The visual identity of this project was heavily inspired by minimalist, high-contrast aesthetics. The design was deliberately kept simple and clean so that the core content could be delivered with maximum clarity. By utilizing a deep, absolute-black background paired with sharp geometric borders and vibrant neon green indicators, the UI isolates the maze-carving area as the primary center of focus. This clean, sci-fi blueprint look ensures that the visual styling never clashes with the complex, colorful paths running inside the simulation canvas, striking a perfect balance between technical utility and a high-tech client aesthetic.</p>
                <div id='block5palette'>
                    <h4>Color palette</h4>
                    <div>
                        <div className='color'><div style={{ backgroundColor: "#39FF14" }}></div><p><span className='monospace'>#39FF14</span></p></div>
                        <div className='color'><div style={{ backgroundColor: "#121214" }}></div><p><span className='monospace'>#121214</span></p></div>
                        <div className='color'><div style={{ backgroundColor: "#1E1E24" }}></div><p><span className='monospace'>#1E1E24</span></p></div>
                        <div className='color'><div style={{ backgroundColor: "#F4F4F6" }}></div><p><span className='monospace'>#F4F4F6</span></p></div>
                        <div className='color'><div style={{ backgroundColor: "#0A0A0A" }}></div><p><span className='monospace'>#0A0A0A</span></p></div>
                    </div>
                </div>
            </div>
        </div>
        <div className='pathLine'></div>
        <div className='block'>
            <h2 className='blockHead'>Edge Cases & Bug Hunting <img src={bugIcon}></img></h2>
            <div className='blockContent'>
                <p> Documenting the development challenges was essential, as building a performance-heavy application in a dynamically typed language like JavaScript presents significant hurdles with error handling. A particularly frustrating bug arose from how JavaScript handles object properties: when using <span className='monospace'>Object.keys()</span>, the engine automatically coerces numerical keys—such as <span className="monospace">1</span>, <span className="monospace">16</span>, <span className="monospace">256</span>, and <span className="monospace">4096</span>—into strings. Because these keys held crucial bitwise data required by the generation algorithms, this silent type-coercion broke the logic and demanded hours of rigorous debugging to uncover. Beyond this, the project pushed the limits of the runtime environment, resulting in classic algorithmic pitfalls like accidental infinite loops during path validation and <span className="monospace">"Maximum call stack size exceeded"</span> errors caused by deep recursion in large-scale maze matrices. Resolving these bottlenecks forced a shift toward iterative design and defensive programming patterns.</p>
            </div>
        </div>
        <div className='pathLine'></div>
        <div className='block'>
            <h2 className='blockHead'>Future Roadmap <img src={roadmapIcon}></img></h2>
            <div className='blockContent'>
                <p>If allocated additional development cycles for this project, the immediate priority would be transitioning the rendering pipeline from a 2D canvas into an immersive 3D environment. This evolution would involve engineering a playable, first-person 3D maze simulation complete with a dynamic HUD and a real-time minimap overlay tracking player positioning. Concurrently, the user interface would undergo a comprehensive design overhaul; while the current UI is highly functional, a deeper aesthetic integration is envisioned to map the page geometry directly to procedural maze patterns. Finally, the scalability of the architecture presents an exciting opportunity to implement real-time multiplayer functionality. By utilizing WebSockets, the platform could host competitive, time-attack race modules where multiple users navigate the identical spanning-tree network simultaneously, transforming a single-player sandbox into a highly engaging, collaborative environment.</p>
            </div>
        </div>
    </div>
    );
}

export default About;