const fn = (v:boolean) =>{
    if(v)
        return 1;
    else
        return 2;
}

// infer 只能在条件类型的 extends 子句中使用，用来声明一个类型变量，TypeScript 会自动推断这个变量的类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type a = MyReturnType<typeof fn>;  // should be "1 | 2"
