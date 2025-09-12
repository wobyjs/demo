/**
 * Counter Component Demo
 * 
 * This is a demonstration of creating a custom element with the Woby framework
 * that showcases reactive properties, nested properties, and style attributes.
 * 
 * @file index.tsx
 */

/* IMPORT */
import { $, $$, useMemo, render, customElement, isObservable, createContext, useContext, useEffect, useMountedContext, useMounted } from 'woby'
import type { Observable, ElementAttributes, ObservableMaybe, } from 'woby'

const CounterContext = createContext<Observable<number> | null>(null)
const useCounterContext = () => useMountedContext(CounterContext)

/**
 * Counter Component Properties
 * 
 * Defines the interface for the Counter component's properties.
 */
interface CounterProps {
    /** Function to increment the counter value */
    increment?: () => void

    /** Function to decrement the counter value */
    decrement?: () => void

    /** Observable containing the current counter value */
    value?: Observable<number>

    children?: JSX.Element
    /** Optional nested property structure */
    nested?: {
        nested: {
            /** Text value that can be either observable or plain string */
            text: ObservableMaybe<string>
        }
    }
}

/**
 * Counter Component
 * 
 * A simple counter component that displays a value and provides
 * buttons to increment and decrement the value.
 * 
 * @param props - Component properties
 * @param props.increment - Function to increment the counter
 * @param props.decrement - Function to decrement the counter
 * @param props.value - Observable containing the counter value
 * @param props.nested - Optional nested properties
 * @returns JSX element representing the counter
 * 
 * @example
 * ```tsx
 * const value = $(0)
 * const increment = () => value(prev => prev + 1)
 * const decrement = () => value(prev => prev - 1)
 * 
 * <Counter value={value} increment={increment} decrement={decrement} />
 * ```
 */
const Counter = ({
    increment = () => { if (value) value($$(value) + 1) },
    decrement = () => { if (value) value(isNaN($$(value)) ? 0 : $$(value) - 1) },
    value = $(0),
    nested = { nested: { text: $('abc') } },
    children,
    ...props
}: CounterProps): JSX.Element => {

    const { ref, context } = useCounterContext()
    /**
     * Extract the nested text value
     */
    const v = nested.nested.text

    /**
     * Memoized computed value combining counter value and nested text
     * 
     * This value will automatically update when either the counter value
     * or the nested text changes.
     */
    const m = useMemo(() => {
        console.log($$(value) + '' + $$(v))
        return $$(value) + '' + $$(v)
    })

    useEffect(() => {
        console.log('mounted', $$(ref))
    })

    return <div {...props} ref={ref} style={{ border: '1px solid red' }}>
        <h1>Counter</h1>
        <p>Value: {value}</p>
        <p>Memo: {m}</p>
        <p>Parent Context: {context}</p>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>

        {children ?
            <div style={{ border: '1px solid gray', padding: '10px' }}>
                <CounterContext.Provider value={value}>
                    {children}
                </CounterContext.Provider>
            </div>
            : null}
    </div>
}

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
customElement('counter-element', Counter, 'value', 'class', 'style-*', 'nested-*')

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
        }
    }
}

/**
 * Application Component
 * 
 * Main application component that demonstrates the counter custom element
 * and the standard Counter component.
 * 
 * @returns Array of JSX elements
 */
const App = () => {
    /**
     * Counter value observable
     */
    const value = $(0)

    /**
     * Increment function
     * 
     * Increases the counter value by 1.
     */
    const increment = () => value(prev => prev + 1)

    /**
     * Decrement function
     * 
     * Decreases the counter value by 1.
     */
    const decrement = () => value(prev => prev - 1)

    //style-font-size='2em'
    return [
        /**
         * Custom element usage with various attribute types:
         * - style-color: Sets text color to red
         * - style-font-size: Sets font size to 2em
         * - nested-nested-text: Sets nested text property to 'xyz'
         * - class: Sets CSS classes for styling
         */
        <counter-element
            style-color={'red'}
            style-font-size='2em'
            nested-nested-text='xyz'
            {...{ value, increment, decrement, nested: { nested: { text: $('abc') } } }}
            class={$('border-2 border-black border-solid bg-amber-400')}>

            <counter-element
                style-color={'pink'}
                style-font-size='1em'
                nested-nested-text=' nested context'
                {...{ value, increment, decrement, nested: { nested: { text: $('abc') } } }}
                class={$('border-2 border-black border-solid bg-amber-400')}>
            </counter-element>,
        </counter-element>,

        /**
         * Standard component usage
         */
        <Counter {...{ value, increment, decrement }} />
    ]
}

/**
 * Render the application to the DOM
 * 
 * Mounts the App component to the element with ID 'app'.
 */
render(<App />, document.getElementById('app'))