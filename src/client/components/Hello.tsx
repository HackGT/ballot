import * as React from "react";
import './Hello.scss';

export interface Props {
    name: string;
    bestNumber: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

function Hello({ name, bestNumber, onIncrement, onDecrement }: Props) {
    if (bestNumber < 0) {
        throw new Error('No best number is below 0');
    }

    return (
        <div>
            <h1>Hello {name}. This is a test... of the Georgia Tech Emergency Notification System... And Redux!</h1>
            <h2>The best number is obviously {bestNumber}</h2>
            <div>
                <button onClick={onDecrement}>-</button>
                <button onClick={onIncrement}>+</button>
            </div>
        </div>
    );
}

export default Hello;