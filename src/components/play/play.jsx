import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PlayableMaze from './playable';
import './play.css'

function Play() {
    const { mazeData } = useParams();

    return (
        <div id='playPage'>
            <PlayableMaze mazeSerial={mazeData} playAgain={true} victoryText={'Congratulations! You solved it'} />
        </div>
    );
}

export default Play;