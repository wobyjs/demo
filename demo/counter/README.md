# Counter Component Demo

This demo showcases how to create a custom element using the Woby framework that demonstrates reactive properties, nested properties, and style attributes.

## Overview

The Counter component is a simple counter that displays a value and provides buttons to increment and decrement the value. It demonstrates:

1. Basic custom element creation with `customElement`
2. Handling of observable properties
3. Support for nested properties
4. Style attribute processing
5. Integration with Woby's reactive system

## Component Structure

### `Counter` Component

A simple counter component that displays a value and provides buttons to increment and decrement the value.

**Props:**
- `increment`: Function to increment the counter
- `decrement`: Function to decrement the counter
- `value`: Observable containing the counter value
- `nested`: Optional nested properties

### Custom Element Registration

The Counter component is registered as a custom element with the tag name `counter-element`.

**Observed Attributes:**
- `value`: The counter value
- `class`: CSS classes
- `style-*`: Style properties (e.g., `style-color`, `style-font-size`)
- `nested-*`: Nested properties (e.g., `nested-nested-text`)

## Usage Examples

### As a Custom Element

```html
<counter-element 
  style-color="red" 
  style-font-size="2em" 
  nested-nested-text="xyz" 
  class="border-2 border-black border-solid bg-amber-400">
</counter-element>
```

### As a Standard Component

```tsx
const value = $(0)
const increment = () => value(prev => prev + 1)
const decrement = () => value(prev => prev - 1)

<Counter value={value} increment={increment} decrement={decrement} />
```

## Key Features Demonstrated

### Reactive Properties

The counter value is implemented as an observable, which automatically updates the UI when changed.

### Nested Property Handling

The component demonstrates how nested properties (e.g., `nested-nested-text`) are processed and made available to the component.

### Style Attribute Processing

Style attributes are automatically converted from kebab-case to camelCase and applied to the element's style:
- `style-color` becomes `color`
- `style-font-size` becomes `fontSize`

### Memoized Computed Values

The demo shows how to create memoized computed values that automatically update when their dependencies change.

## Running the Demo

To run this demo:

1. Ensure all dependencies are installed
2. Build the Woby framework
3. Serve the demo directory
4. Open in a web browser

The demo will show two counters:
1. One implemented as a custom element with various attributes
2. One implemented as a standard component