/* IMPORT */
import { $, $$, useMemo, render, Observable, customElement, ElementAttributes } from 'woby'

/* MAIN */


const Counter = ({ increment, decrement, value, ...props }: { increment: () => number, decrement: () => number, value: Observable<number> }): JSX.Element => {

    // const value = $(0)

    // const increment = () => value(prev => prev + 1)
    // const decrement = () => value(prev => prev - 1)

    const v = $('abc')
    const m = useMemo(() => {
        console.log($$(value) + $$(v))
        return $$(value) + $$(v)
    })
    return <div {...props}>
        <h1>Counter</h1>
        <p>{value}</p>
        <p>{m}</p>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
    </div>
}

customElement('counter-element', ['value', 'class'], Counter)

declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'counter-element': ElementAttributes<typeof Counter>
        }
    }
}


const App = () => {
    const value = $(0)

    const increment = () => value(prev => prev + 1)
    const decrement = () => value(prev => prev - 1)

    return [<counter-element {...{ value, increment, decrement }} class={$('border-2 border-black border-solid bg-amber-400')}></counter-element>,
    <Counter {...{ value, increment, decrement }} />]
}
render(<App />, document.getElementById('app'))
