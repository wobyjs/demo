/* IMPORT */
import { $, render, Observable } from 'voby'

/* MAIN */

const Counter = ({ increment, decrement, value }: { increment: Observable<() => number>, decrement: Observable<() => number>, value: Observable<number> }): JSX.Element => {

    // const value = $(0)

    // const increment = () => value(prev => prev + 1)
    // const decrement = () => value(prev => prev - 1)

    const v = $('abc')

    return (
        <>
            <h1>Counter</h1>
            <p>{value}</p>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </>
    )
}

const App = () => {
    const value = $(0)

    const increment = () => value(prev => prev + 1)
    const decrement = () => value(prev => prev - 1)

    return <Counter {...{ value, increment, decrement }} />
}
render(<App />, document.getElementById('app'))
