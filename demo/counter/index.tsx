/**
 * Counter Component Demo
 * 
 * This is a demonstration of creating a custom element with the Woby framework
 * that showcases reactive properties, nested properties, and style attributes.
 * 
 * @file index.tsx
 */

/* IMPORT */
import { $, $$, useMemo, render, customElement, isObservable, createContext, useContext, useEffect, defaults, SYMBOL_DEFAULT, useMountedContext } from 'woby'
import type { Observable, ElementAttributes, ObservableMaybe } from 'woby'

const CounterContext = createContext<Observable<number> | null>(null)
const useCounterContext = () => useContext(CounterContext)

/**
 * Counter Component Properties
 * 
 * Defines the interface for the Counter component's properties.
 */
interface CounterProps {
    title?: ObservableMaybe<string>
    /** Function to increment the counter value */
    increment?: () => void

    /** Function to decrement the counter value */
    decrement?: () => void

    /** Observable containing the current counter value */
    value?: Observable<number>

    disabled?: Observable<boolean>
    children?: JSX.Element
    /** Optional nested property structure */
    nested?: {
        nested: {
            /** Text value that can be either observable or plain string */
            text: ObservableMaybe<string>
        }
    }
}

// Apply defaults to the Counter component manually
const def = () => {
    const value = $(0, { type: 'number' } as const)
    return {
        title: $('Counter'),
        value,
        increment: () => { value($$(value) + 1) },
        decrement: () => { value($$(value) - 1) },
        nested: { nested: { text: $('abc') } },
        disabled: $(false, { type: 'boolean' } as const),
        children: undefined
    }
}

/**
 * Counter Component
 */
const Counter = defaults(def, (props) => {
    const {
        title,
        increment,
        decrement,
        value,
        nested,
        disabled,
        children,
        ...restProps
    } = props

    // const context = useCounterContext()
    const { ref, context } = useMountedContext(CounterContext)

    /**
     * Extract the nested text value
     */
    const v = useMemo(() => $$($$($$(nested)?.nested)?.text))

    /**
     * Memoized computed value combining counter value and nested text
     */
    const m = useMemo(() => {
        return $$(value) + '' + $$(v)
    })

    // useEffect(() => {
    //     console.log('children', $$(children))
    // })
    // useEffect(() => {
    //     console.log('context', $$(context))
    // })

    return (
        <div {...restProps} style={{ border: '1px solid red' }}>
            <h1>{title}</h1>
            <p>Value: {value}</p>
            <p>Memo: {m}</p>
            <p>Parent Context: {context}</p>
            <button disabled={disabled} onClick={increment}>+</button>
            <button disabled={disabled} onClick={decrement}>-</button>

            {() => $$(children) ?
                <div style={{ border: '1px solid gray', padding: '10px' }}>
                    <CounterContext.Provider ref={ref} value={value}>
                        {children}
                    </CounterContext.Provider>
                </div>
                : null}
        </div>
    )
})

const ContextValue = defaults(() => ({}), (props) => {
    // console.log('ContextValue', props)
    const context = useCounterContext()
    // useEffect(() => console.log('ContextValue useEffect', $$(context)))
    return <div>Context Value: {context}</div>
})



/**
 * Register the Counter component as a custom element
 * 
 * This makes the Counter component available as an HTML element
 * with the tag name 'counter-element'.
 * 
 * Observed attributes:
 * - 'value': The counter value
 * - 'class': CSS classes
 * - 'style-*': Style properties (e.g., style-color, style-font-size)
 * - 'nested-*': Nested properties (e.g., nested-nested-text)
 */
customElement('counter-element', Counter)
customElement('context-value', ContextValue)

// Export components for potential use in other modules
export { Counter, ContextValue, CounterContext, useCounterContext }

/**
 * Extend JSX namespace to include the custom element
 * 
 * This allows TypeScript to recognize the custom element in JSX.
 */
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            /**
             * Counter custom element
             * 
             * HTML element that displays a counter with increment/decrement buttons.
             * 
             * The ElementAttributes<typeof Counter> type automatically includes:
             * - All HTML attributes
             * - Component-specific props from CounterProps
             * - Style properties via the style-* pattern
             * - Nested properties via the nested-* pattern
             */
            'counter-element': ElementAttributes<typeof Counter>
            'context-value': ElementAttributes<typeof ContextValue>
        }
    }
}

/**
 * Application Component
 */
const App = () => {
    /**
     * Counter value observable
     */
    const value = $(0)

    /**
     * Increment function
     */
    const increment = () => value(prev => prev + 1)

    /**
     * Decrement function
     */
    const decrement = () => value(prev => prev - 1)

    return <>
        {/* <h1>Custom element in TSX:<br /></h1>
        <counter-element title={'Custom element in TSX'}
            style-color={'red'}
            style-font-size='1.1em'
            nested-nested-text='xyz'
            // value={0}
            // increment={increment}
            // decrement={decrement}
            nested={{ nested: { text: $('abc') } }}
            class={'border-2 border-black border-solid bg-amber-400'}>
            <context-value />
            <ContextValue />

            <h2>Nested Custom element in TSX:<br /></h2>

            <counter-element title={'counter-element Nested'}
                style-color={'orange'}
                style-font-size='1em'
                nested-nested-text=' nested context'
                value={value}
                increment={increment}
                decrement={decrement}
                nested={{ nested: { text: $(' nested context') } }}
                class={'border-2 border-black border-solid bg-amber-400 m-10'}>
                <context-value />
                <ContextValue />
            </counter-element>
        </counter-element>

        <h1>Pure TSX</h1>
        <Counter title='TSX Counter Main' value={value} increment={increment} decrement={decrement} >
            <context-value />
            <ContextValue />
            <Counter title='TSX Counter Nested' >
                <context-value />
                <ContextValue />
            </Counter>
        </Counter>

        <h1>TSX - HTML</h1>
        <Counter title='TSX - HTML Counter Main' >
            <context-value />
            <ContextValue />
            <counter-element title={'counter-element Nested'}
                style-color={'orange'}
                style-font-size='1em'
                nested-nested-text=' nested context'
                nested={{ nested: { text: $(' nested context') } }}
                class={'border-2 border-black border-solid bg-amber-400 m-10'}>
                <context-value />
                <ContextValue />
            </counter-element>
        </Counter>

        <h1>HTML - TSX</h1>
        <counter-element title={'HTML - TSX main'}
            style-color={'orange'}
            style-font-size='1em'
            nested-nested-text=' nested context'
            nested={{ nested: { text: $(' nested context') } }}
            class={'border-2 border-black border-solid bg-amber-400 m-10'}>
            <context-value />
            <ContextValue />
            <Counter title='TSX Counter nested' >
                <context-value />
                <ContextValue />
            </Counter>
        </counter-element> */}

    </>
}

/**
 * Render the application to the DOM
 * 
 * Mounts the App component to the element with ID 'app'.
 */
render(<App />, document.getElementById('app'))

export default Counter