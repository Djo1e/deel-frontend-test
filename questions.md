### 1. What is the difference between Component and PureComponent? give an example where it might break my app.

- `PureComponent` uses `shouldComponentUpdate` with a shallow prop and state comparison.

### 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

- If a component in the middle of the component tree uses `shouldComponentUpdate` and blocks the update, it may prevent context changes from propagating to nested components.

### 3. Describe 3 ways to pass information from a component to its PARENT.

1. Pass a callback function from the parent to the child component as a prop.

2. Use context.

3. Use a global state management library like Redux.

### 4. Give 2 ways to prevent components from re-rendering.

- Use `shouldComponentUpdate` (in class components) or `React.memo`
- Use local state where possible to minimize the impact of state changes on other components.

### 5. What is a fragment and why do we need it? Give an example where it might break my app.

- A fragment is way to group elements without adding extra nodes to the DOM. Fragments might break your app if you rely on specific DOM structure.

### 6. Give 3 examples of the HOC pattern.

1. Redux's `connect` function, which connects a React component to the Redux store.
2. React Router's `withRouter`, which provides access to routing-related props.
3. A custom HOC for handling user authentication, like `useAuth`

### 7. what's the difference in handling exceptions in promises, callbacks and async...await.

1. Promises: Use `.catch()` to handle errors.
2. Callbacks: Handle errors through error-first callback arguments, usually as the first parameter.
3. Async-await: Use `try-catch` blocks to handle errors in asynchronous functions.

### 8. How many arguments does setState take and why is it async.

- `setState` takes up to two arguments: an object or a function that returns an object representing the new state, and an optional callback function that is executed once the state update is complete. `setState` is async to allow for batching multiple updates and improve performance by reducing unnecessary re-renders.

### 9. List the steps needed to migrate a Class to Function Component.

1. Convert the class component to a functional component.
2. Replace the state with `useState` hooks.
3. Replace lifecycle methods with appropriate `useEffect` hooks.

### 10. List a few ways styles can be used with components.

1. `Inline styles`: Apply styles directly as an object in the style prop.
2. `CSS modules`: Import scoped CSS classes and use them as className.
3. `Styled-components`: Use JavaScript to create styled components with dynamic styling.
4. `Regular CSS or SASS/LESS`: Use global or imported stylesheets.

### 11. How to render an HTML string coming from the server.

- You can use the `dangerouslySetInnerHTML` attribute.
