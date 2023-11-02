
/* IMPORT */

import { $, h, render } from 'woby'
import type { JSX } from 'woby'

/* MAIN */

const Counter = (): JSX.Element => {

    const value = $(0)

    const increment = () => value(prev => prev + 1)
    const decrement = () => value(prev => prev - 1)

    return [
        h('h1', null, 'Counter'),
        h('p', null, value),
        h('button', { onClick: increment }, '+'),
        h('button', { onClick: decrement }, '-')
    ]

}

render(Counter, document.getElementById('app'))
