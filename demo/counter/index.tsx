/**
 * Counter Component Demo
 * 
 * This is a demonstration of creating a custom element with the Woby framework
 * that showcases reactive properties, nested properties, and style attributes.
 * 
 * @file index.tsx
 */

/* IMPORT */
import { $, $$, useMemo, render, customElement, isObservable } from 'woby'
import type { Observable, ElementAttributes, ObservableMaybe } from 'woby'

/**
 * Counter Component Properties
 * 
 * Defines the interface for the Counter component's properties.
 */
interface CounterProps {
    /** Function to increment the counter value */
    increment?: () => number

    /** Function to decrement the counter value */
    decrement?: () => number

    /** Observable containing the current counter value */
    value?: Observable<number>

    /** Optional nested property structure */
    nested?: {
        nested: {
            /** Text value that can be either observable or plain string */
            text: ObservableMaybe<string>
        }
    }
    
    /** Nested properties */
    'nested-nested-text'?: string
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
    increment, 
    decrement, 
    value = $(0), 
    nested = { nested: { text: $('abc') } }, 
    ...props 
}: CounterProps): JSX.Element => {

    // Provide default increment/decrement functions if not provided
    const handleIncrement = increment || (() => { value($$(value) + 1); return $$(value) + 1; });
    const handleDecrement = decrement || (() => { value($$(value) - 1); return $$(value) - 1; });

    // const value = $(0)

    // const increment = () => value(prev => prev + 1)
    // const decrement = () => value(prev => prev - 1)

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

    return <div {...props}>
        <h1>Counter</h1>
        <p>{value}</p>
        <p>{m}</p>
        <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
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
customElement('counter-element', Counter, 'value', 'class', 'style-*', 'nested-nested-text')

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