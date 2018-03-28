```json
{
    "presets": [
        "env",
        "react"
    ],
    "plugins": ["transform-es2015-destructuring", "transform-object-rest-spread"]
}
```
Adding the `plugins` section to `.babelrc` fixed the error with the spread operator for the react webpack build:
```javascript
ERROR in ./src/reducers/todos.js
Module build failed: SyntaxError: Unexpected token (15:13)

  13 |       return state.map(todo =>
  14 |         (todo.id === action.id)
> 15 |           ? {...todo, completed: !todo.completed}
     |              ^
  16 |           : todo
  17 |       )
  18 |     default:
```
