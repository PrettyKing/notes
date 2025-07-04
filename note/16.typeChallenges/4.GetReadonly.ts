
// ============= Question =============
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
// type GetReadonlyKeys<T> = {
//     [K in keyof T]-?: Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? K : never
// }[keyof T];

type GetReadonlyKeys<T> = keyof {
    [K in keyof T as Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? K : never]: T[K]
}

// ============= Test Cases =============
interface Todo {
    readonly title: string
    readonly description: string
    completed: boolean
}
type Keys = GetReadonlyKeys<Todo>; // expected to be "title" | "description"