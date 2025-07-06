interface Todo {
    title: string
    description: string
    completed: boolean
}

// Omit<T, K> 是 TypeScript 内置的类型工具，用于从类型 T 中排除属性 K
type MyOmit<T, K> = {
    [P in keyof T as P extends K ? never : P]: T[P]
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
    completed: false,
}

export {}