// Implement the built-in Pick<T, K> generic without using it.
// Constructs a type by picking the set of properties K from T
// For example:
interface Todo {
    title: string
    description: string
    completed: boolean
}

// Pick<T, K> 是 TypeScript 内置的类型工具，用于从类型 T 中选择属性 K
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}

export { }