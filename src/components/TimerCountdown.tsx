import { FC, useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { colors } from '@mui/material'

interface TimerCountdownProps {
    time: number
    isWarning: boolean
    score: number
    onTimeOver: Function
}

const TimerCountdown: FC<TimerCountdownProps> = ({
    time,
    isWarning,
    score,
    onTimeOver
}: TimerCountdownProps) => {
    const [timeLeft, setTime] = useState(time)
    const [warning, setWarning] = useState(isWarning)
    const [prevScore, setPrevScore] = useState(score)

    useEffect(() => {
        setTimeout(() => {
            if (timeLeft === 0) onTimeOver()
            if (timeLeft <= 10) setWarning(true)
            if (prevScore < score) {
                setTime(timeLeft + 1)
                setPrevScore(score)
            } else if (prevScore === score) setTime(timeLeft - 1)
        }, 1000)
    }, [timeLeft, score])

    const calculateTime = (time: number) => {
        let mins = Math.floor(time / 60)
        let secs = time % 60
        let res: string =
            mins.toString().padStart(2, '0') +
            ':' +
            secs.toString().padStart(2, '0')
        return res
    }

    return (
        <div
            className={
                warning
                    ? `${styles.timeContainerBlink}`
                    : `${styles.timeContainer}`
            }
            style={{
                color: warning ? 'red' : 'aqua',
                fontSize: `40px`,
                fontWeight: 'bold'
            }}
        >
            {calculateTime(timeLeft)}
        </div>
    )
}

export default TimerCountdown
