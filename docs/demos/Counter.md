# Counter Demo

**Location**: `demo/counter/`  
**Run**: `pnpm dev:counter`  
**Live Demo**: [CodeSandbox](https://codesandbox.io/s/demo-counter-23fv5)

## Overview

The Counter demo is the foundational example that demonstrates core Woby concepts including reactive state, event handling, component composition, and custom elements. It's the perfect starting point for learning Woby.

## Features Demonstrated

- ✅ **Reactive Observables** - Basic state management with `$()`
- ✅ **Event Handling** - Button click interactions
- ✅ **Custom Elements** - Web component registration
- ✅ **Component Composition** - Reusable component patterns
- ✅ **Computed Values** - Derived state with `useMemo`
- ✅ **State Updates** - Function-based state updates

## Complete Source Code

```typescript
/* IMPORT */
import { $, $$, useMemo, render, Observable, customElement, ElementAttributes } from 'woby'

/* MAIN */

const Counter = ({ increment, decrement, value, ...props }: { 
  increment: () => number, 
  decrement: () => number, 
  value: Observable<number> 
}): JSX.Element => {
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

// Register as custom element
customElement('counter-element', ['value', 'class'], Counter)

// TypeScript declaration for custom element
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

  return [
    <counter-element 
      {...{ value, increment, decrement }} 
      class="border-2 border-black border-solid bg-amber-400"
    />,
    <Counter {...{ value, increment, decrement }} />
  ]
}

render(<App />, document.getElementById('app'))
```

## Code Breakdown

### 1. Importing Woby

```typescript
import { 
  $,              // Observable creation
  $$,             // Observable unwrapping
  useMemo,        // Computed values
  render,         // DOM rendering
  Observable,     // Type definition
  customElement,  // Custom element registration
  ElementAttributes // Type helper
} from 'woby'
```

### 2. Counter Component

The main `Counter` component demonstrates several key concepts:

```typescript
const Counter = ({ increment, decrement, value, ...props }) => {
  // Local observable state
  const v = $('abc')
  
  // Computed value using useMemo
  const m = useMemo(() => {
    return $$(value) + $$(v)  // $$ unwraps observable values
  })
  
  return <div {...props}>
    <h1>Counter</h1>
    <p>{value}</p>        {/* Observable displayed directly */}
    <p>{m}</p>            {/* Computed value displayed */}
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
}
```

**Key Points:**
- **Props Interface**: Component accepts functions and observables as props
- **Local State**: `v = $('abc')` creates component-local reactive state
- **Computed Values**: `useMemo` automatically tracks dependencies
- **Observable Unwrapping**: `$$()` extracts current value from observables
- **Direct Display**: Observables can be displayed directly in JSX

### 3. Custom Element Registration

```typescript
customElement('counter-element', ['value', 'class'], Counter)
```

This registers the `Counter` component as a custom web element:
- **Element Name**: `counter-element`
- **Watched Attributes**: `['value', 'class']`
- **Component**: The `Counter` function component

### 4. TypeScript Integration

```typescript
declare module 'woby' {
  namespace JSX {
    interface IntrinsicElements {
      'counter-element': ElementAttributes<typeof Counter>
    }
  }
}
```

This provides full TypeScript support for the custom element, including:
- **Prop Types**: Correct typing for all component props
- **Attribute Validation**: Compile-time checking of attributes
- **IntelliSense**: Auto-completion in IDEs

### 5. App Component and State Management

```typescript
const App = () => {
  // Application state
  const value = $(0)
  
  // State update functions
  const increment = () => value(prev => prev + 1)
  const decrement = () => value(prev => prev - 1)

  // Render both custom element and regular component
  return [
    <counter-element 
      {...{ value, increment, decrement }} 
      class="border-2 border-black border-solid bg-amber-400"
    />,
    <Counter {...{ value, increment, decrement }} />
  ]
}
```

**Key Points:**
- **Observable State**: `$(0)` creates reactive state
- **Function Updates**: `prev => prev + 1` safely updates state
- **State Sharing**: Same state shared between components
- **Multiple Rendering**: Both custom element and component versions

## Key Learning Concepts

### 1. Reactive State with Observables

```typescript
const count = $(0)        // Create observable
console.log(count())      // Read current value
count(5)                  // Set new value
count(prev => prev + 1)   // Update with function
```

Observables are the foundation of Woby's reactivity:
- **Creation**: `$()` creates reactive state
- **Reading**: Call as function `count()` to get value
- **Setting**: Call with value `count(5)` to set
- **Updating**: Use function `count(prev => prev + 1)` for safe updates

### 2. Automatic Dependency Tracking

```typescript
const doubled = useMemo(() => count() * 2)
```

Woby automatically tracks dependencies:
- **No arrays**: No need to specify what the computed value depends on
- **Automatic updates**: When `count` changes, `doubled` updates automatically
- **Fine-grained**: Only components using `doubled` re-render

### 3. Component Composition

```typescript
// Component accepts observables as props
const Counter = ({ value, increment, decrement }) => {
  return (
    <div>
      <p>{value}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

Components work naturally with observables:
- **Props**: Observables passed as regular props
- **Display**: Observables displayed directly in JSX
- **Events**: Functions called directly from event handlers

### 4. Custom Elements

```typescript
customElement('my-counter', ['value'], Counter)

// Use as web component
<my-counter value={count} onIncrement={handleIncrement} />
```

Turn any component into a web component:
- **Standard APIs**: Works with standard DOM APIs
- **Attribute Mapping**: Maps HTML attributes to component props
- **Bidirectional**: Component can update attributes

## Performance Characteristics

### Fine-Grained Updates

The counter demo showcases Woby's fine-grained reactivity:

```typescript
// When count changes from 5 to 6:
// ❌ React: Entire component re-renders
// ✅ Woby: Only the <p>{value}</p> text node updates
```

### No Virtual DOM Overhead

```typescript
// Direct DOM manipulation
value(6)  // Immediately updates DOM text node
```

### Automatic Optimization

```typescript
// Multiple updates in same frame are batched
increment()
increment()
increment()
// Only one DOM update occurs
```

## Common Patterns

### State Update Patterns

```typescript
// Increment
const increment = () => count(prev => prev + 1)

// Set to specific value
const reset = () => count(0)

// Conditional update
const incrementIfEven = () => count(prev => prev % 2 === 0 ? prev + 1 : prev)

// Batched updates
const doubleIncrement = () => batch(() => {
  count(prev => prev + 1)
  count(prev => prev + 1)
})
```

### Component Communication

```typescript
// Parent component manages state
const Parent = () => {
  const value = $(0)
  return <Counter value={value} onIncrement={() => value(v => v + 1)} />
}

// Child component receives state and callbacks
const Counter = ({ value, onIncrement }) => (
  <button onClick={onIncrement}>{value}</button>
)
```

## Variations and Extensions

### Add Reset Functionality

```typescript
const App = () => {
  const value = $(0)
  const increment = () => value(prev => prev + 1)
  const decrement = () => value(prev => prev - 1)
  const reset = () => value(0)

  return (
    <div>
      <Counter {...{ value, increment, decrement }} />
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### Add Step Size

```typescript
const Counter = () => {
  const count = $(0)
  const step = $(1)
  
  const increment = () => count(prev => prev + step())
  const decrement = () => count(prev => prev - step())
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Step: <input value={step} onInput={e => step(+e.target.value)} /></p>
      <button onClick={increment}>+{step}</button>
      <button onClick={decrement}>-{step}</button>
    </div>
  )
}
```

### Add Persistence

```typescript
const Counter = () => {
  const count = $(parseInt(localStorage.getItem('count') || '0'))
  
  // Save to localStorage when count changes
  useEffect(() => {
    localStorage.setItem('count', count().toString())
  })
  
  return <div>Count: {count}</div>
}
```

## Next Steps

After understanding the Counter demo:

1. **Try the Clock Demo**: Learn about time-based updates and animations
2. **Explore Store Counter**: See complex state management patterns
3. **Check Performance Demos**: Understand Woby's performance benefits
4. **Build Your Own**: Create a custom counter with your own features

The Counter demo provides the foundation for understanding all other Woby concepts. Master these patterns and you'll be ready for more complex applications.

## Related Documentation

- [Basic Demos Overview](../Basic-Demos.md)
- [Code Patterns](../Code-Patterns.md)
- [Woby Core Methods](../../woby/docs/Core-Methods.md)
- [Creating New Demos](../Creating-New-Demos.md)