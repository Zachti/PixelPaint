import { useEffect, useState, FC } from 'react'
import TopBar from './TopBar'
import GridLayout from './gridLayout'
import { generateTiles, isCorrectTile } from '../utils/GameFuncs'
import { max } from 'lodash'
import { Tile } from '../models'
import { Constants, Modes } from '../utils/GameConstants'
import { PuzzlePayload } from '../payloads/PuzzlePayload'
import styles from './styles.module.scss'

interface GameManagerProps {
    gameMode: number
    handleGameOver: Function
    score: number
    setScore: Function
}

const GameManager: FC<GameManagerProps> = ({
    gameMode,
    handleGameOver,
    score,
    setScore
}: GameManagerProps) => {
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [rows, setRows] = useState(Constants.START_DIMENSIONS)
    const [columns, setColums] = useState(Constants.START_DIMENSIONS)
    const [tilesToGen, setTilesToGeN] = useState(Constants.START_RANDOM_TILES)
    // const [score, setScore] = useState<number>(0)
    const [puzzlePayload, setPayload] = useState<PuzzlePayload>(() =>
        generateTiles(rows, columns, tilesToGen, score, gameMode)
    )
    const [coloredObjectiveTiles, setColoredObjectiveTiles] =
        useState<number>(0)
    const [coloredRegularTiles, setCurrentColored] = useState<number>(0)
    const [clickable, setClickable] = useState<boolean>(true)
    const [puzzle, setPuzzle] = useState<Tile[]>(puzzlePayload.tiles)
    const [amount, setAmount] = useState<number>(puzzlePayload.amount)
    const [showPic, setShowPic] = useState<boolean>(true)

    const onTileClicked = (
        tileIndex: number,
        highlighted: boolean,
        color: string,
        prevColor: string
    ) => {
        const objectiveTile: boolean = puzzle[tileIndex].highlighted
        if (gameMode === Modes.PAINT)
            onTileClickedPaint(tileIndex, highlighted, color, prevColor)
        else {
            if (objectiveTile) {
                if (highlighted) {
                    setColoredObjectiveTiles(coloredObjectiveTiles + 1)
                } else {
                    setColoredObjectiveTiles(coloredObjectiveTiles - 1)
                }
            } else {
                if (highlighted) {
                    setCurrentColored(coloredRegularTiles + 1)
                } else setCurrentColored(coloredRegularTiles - 1)
            }
            if (gameMode === Modes.MEMORY) {
                if (coloredObjectiveTiles + coloredRegularTiles === 2)
                    setShowPic(false)
            }
        }
    }

    const onTileClickedPaint = (
        tileIndex: number,
        highlighted: boolean,
        color: string,
        prevColor: string
    ) => {
        const objectiveTile: boolean = puzzle[tileIndex].highlighted
        if (objectiveTile) {
            setColoredObjectiveTiles(
                coloredObjectiveTiles +
                    isCorrectTile(
                        puzzle[tileIndex],
                        highlighted,
                        color,
                        prevColor
                    )
            )
        } else {
            if (highlighted) {
                if (prevColor === '') setCurrentColored(coloredRegularTiles + 1)
            } else setCurrentColored(coloredRegularTiles - 1)
        }
    }

    const onClearClicked = () => {
        setColoredObjectiveTiles(0)
        setCurrentColored(0)
        setShowPic(true)
    }

    useEffect(() => {
        if (coloredObjectiveTiles === amount && coloredRegularTiles === 0) {
            setScore(score + 1)
            if (score === Constants.CHECKPOINT_8X8) {
                setRows((rows) => rows + 1)
                setColums((columns) => columns + 1)
            }
        }
    }, [coloredObjectiveTiles, coloredRegularTiles])

    useEffect(() => {
        if (score !== 0)
            setPayload(
                generateTiles(rows, columns, tilesToGen, score, gameMode)
            )
    }, [score])

    useEffect(() => {
        setAmount(puzzlePayload.amount)
        setPuzzle(puzzlePayload.tiles)
        setColoredObjectiveTiles(0)
        setCurrentColored(0)
        setShowPic(true)
    }, [puzzlePayload])

    const handleTimeOver = () => {
        setGameOver(true)
        setClickable(!clickable)
        setTimeout(() => {
            handleGameOver(score, 'ori')
        }, 1500)
    }

    return (
        <div className="App">
            <TopBar
                timeOverFunction={handleTimeOver}
                score={score}
                timeToAdd={puzzlePayload.difficulty}
            />
            <div className={`${styles.gameContainer}`}>
                <GridLayout
                    rows={rows}
                    columns={columns}
                    picture={true}
                    showPicture={showPic}
                    puzzle={puzzle}
                    gameMode={gameMode}
                    score={score}
                />
                <GridLayout
                    rows={rows}
                    columns={columns}
                    showPicture={true}
                    score={score}
                    clickableCanvas={clickable}
                    puzzle={puzzle}
                    gameMode={gameMode}
                    onTileClicked={onTileClicked}
                    onClearClicked={onClearClicked}
                />
            </div>
        </div>
    )
}

export default GameManager
