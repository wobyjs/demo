
/* IMPORT */
import { $, render } from 'voby'
// import type { JSX } from 'voby'
import type { Observable } from 'oby'

/* MAIN */

const Counter = ({ increment, decrement, value }: { increment: Observable<() => number>, decrement: Observable<() => number>, value: Observable<number> }): Element => {

    // const value = $(0)

    // const increment = () => value(prev => prev + 1)
    // const decrement = () => value(prev => prev - 1)

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

    const increment = $(() => value(prev => prev + 1))
    const decrement = $(() => value(prev => prev - 1))

    return <Counter {...{ value, increment, decrement }} />
}
render(<App />, document.getElementById('app'))
