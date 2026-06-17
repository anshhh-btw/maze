import './algorithms.css'
import './responsive.css'

function Algorithms() {
    return (<div id='algorithms'>
        <h1>Algorithms</h1>
        <div id="algoContent">
            <div id="algoLeft">
                <h3>Generation Algorithms</h3>
                <div className='algoSubContent'>
                    <div className='algoCard'>
                        <div className='algoHead'>Algorithm 0</div>
                        <div className='algoCardContent'>
                            <div className='algoName'>Depth First Search</div>
                            <div className='algoDesc'>Also known as the "recursive backtracker," this algorithm initiates a randomized walk from a starting point and carves a path forward until it encounters a dead end. When cornered, the algorithm backtracks along its current path to previous cells until it encounters a cell with an available, unvisited neighbor to open a new path. This cycle repeats systematically until every cell in the matrix has been visited. However, a major bottleneck of this algorithm is its reliance on deep recursion, which frequently triggers a "<span className='monospace'>Maximum call stack size exceeded</span>" error on large grids. To resolve this architectural limitation, the recursive framework can be refactored into an iterative loop using an explicit stack array. This eliminates call-stack dependencies completely, allowing the algorithm to smoothly generate stable mazes as massive as an entire city without runtime errors.</div>
                        </div>
                    </div>
                </div>
                <div className='algoSubContent'>
                    <div className='algoCard'>
                        <div className='algoHead'>Algorithm 1</div>
                        <div className='algoCardContent'>
                            <div className='algoName'>Kruskal's</div>
                            <div className='algoDesc'>The underlying logic of this algorithm is highly elegant and relies on a disjoint-set (Union-Find) data structure. To begin, the engine compiles a master list of all internal walls and assigns every individual cell in the grid to its own unique set. The algorithm then enters a loop, selecting a wall completely at random. It checks the two cells separated by that wall: if they belong to disjoint (separate) sets, the wall is destroyed, and the two sets are merged into one. This process ensures that no isolated loops are created. The cycle repeats continuously until all cells are unified into a single, cohesive set, resulting in a perfect spanning-tree maze characterized by short, highly uniform dead ends.</div>
                        </div>
                    </div>
                </div>
                <div className='algoSubContent'>
                    <div className='algoCard'>
                        <div className='algoHead'>Algorithm 2</div>
                        <div className='algoCardContent'>
                            <div className='algoName'>Prim's</div>
                            <div className='algoDesc'>This algorithm is equally as fascinating as Kruskal's. It initiates from a single, randomly selected cell, marks it as visited, and appends all of its adjacent walls to a master wall list. The engine then enters a continuous loop: it selects a wall from this list completely at random and evaluates the two cells it separates. If exactly one of those cells is unvisited, the algorithm destroys the wall, marks the unvisited cell as visited, and appends that new cell's adjacent walls to the master list. Finally, the processed wall is removed from the list. This organic expansion continues systematically until the master wall list is entirely empty, generating a dense and highly intricate maze structure.</div>
                        </div>
                    </div>
                </div>
                <div className='algoSubContent'>
                    <div className='algoCard'>
                        <div className='algoHead'>Algorithm 3</div>
                        <div className='algoCardContent'>
                            <div className='algoName'>Wilson's</div>
                            <div className='algoDesc'>Wilson’s algorithm is a true mathematical purist among maze generators. It begins by selecting a starting cell entirely at random and marking it as part of the "visited maze" network. The engine then picks an arbitrary unvisited cell elsewhere on the grid and initiates a completely unbiased random walk across the canvas. If this walk intersects its own trail, it creates a loop; the algorithm detects this instantly and erases the loop from its memory bank, restarting the path from the crossing point. The walk continues until it finally collides with any cell that is already a confirmed part of the maze, at which point the entire loop-erased path solidifies and is added to the network. This strict loop-erasure cycle repeats until every cell on the grid is connected. Because the walk is mathematically unbiased, Wilson’s algorithm generates a perfectly random spanning tree with zero directional bias.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="algoMiddle"></div>
            <div id="algoRight">
                <h3>Solving Algorithms</h3>
                <div className='algoSubContent'>
                    <div className='algoCard'>
                        <div className='algoHead'>Algorithm 0</div>
                        <div className='algoCardContent'>
                            <div className='algoName'>Random Mouse</div>
                            <div className='algoDesc'>Though inefficient, this algorithm is guaranteed to solve any perfect maze. Its core logic closely mirrors a Depth-First Search (DFS): beginning at the starting point, the solver moves in a randomly chosen direction until it encounters an intersection. It then selects an available path at random and advances until it reaches either a dead end or another junction. If it hits a new junction, it applies the same decision logic recursively; if it encounters a dead end, it backtracks to the most recent junction and attempts an alternate path. This systematic trial-and-error process continues until the end coordinate is successfully reached.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
};

export default Algorithms;