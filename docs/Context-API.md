# Context API

The Woby framework provides two context hooks for sharing data between components:

1. **useContext**: Standard context hook for JSX/TSX components
2. **useMountedContext**: Enhanced context hook for both JSX/TSX and custom elements

## useContext (JSX/TSX Only)

The standard `useContext` hook works only in JSX/TSX components and relies on the React-like context provider pattern.

### Usage

```tsx
import { createContext, useContext } from 'woby'

// Create a context
const CounterContext = createContext<number>(0)

// Provider component
const ParentComponent = () => {
  const value = $(42)
  
  return (
    <CounterContext.Provider value={value}>
      <ChildComponent />
    </CounterContext.Provider>
  )
}

// Consumer component
const ChildComponent = () => {
  const contextValue = useContext(CounterContext)
  return <div>Context value: {contextValue}</div>
}
```

### Limitations

- Only works in JSX/TSX components
- Requires explicit Provider components
- Does not work with custom elements defined directly in HTML

## useMountedContext (Both JSX/TSX and Custom Elements)

The `useMountedContext` hook works in both JSX/TSX components and custom elements defined directly in HTML. It provides special support for custom elements by attempting to retrieve context from parent elements.

### Usage

```tsx
import { createContext, useMountedContext } from 'woby'

// Create a context
const CounterContext = createContext<number>(0)

// In JSX/TSX components
const MyComponent = () => {
  const { ref, context } = useMountedContext(CounterContext)
  return <div ref={ref}>Context value: {context}</div>
}
```

```html
<!-- In HTML custom elements -->
<counter-element>
  <counter-element><!-- This child can access parent's context --></counter-element>
</counter-element>
```

### How it Works

1. For JSX/TSX components, it falls back to the standard useContext behavior
2. For custom elements, it attempts to retrieve context from the parent element's context property
3. It automatically handles the differences between the two environments

### Parameters

- `Context`: The context object created with createContext
- `ref` (optional): An existing observable ref to use

### Return Values

When called without a ref parameter:
- Returns an object with `ref` and `context` properties

When called with a ref parameter:
- Returns only the context value

## Key Differences

| Feature | useContext | useMountedContext |
|---------|------------|-------------------|
| JSX/TSX Support | ✅ | ✅ |
| Custom Element Support | ❌ | ✅ |
| Provider Required | ✅ | ❌ (for custom elements) |
| Ref Integration | ❌ | ✅ |
| HTML Usage | ❌ | ✅ |

## Best Practices

1. Use `useContext` when working exclusively with JSX/TSX components
2. Use `useMountedContext` when you need to support both JSX/TSX and custom elements
3. Always provide a default value when creating contexts
4. Use observables for context values that need to be reactive