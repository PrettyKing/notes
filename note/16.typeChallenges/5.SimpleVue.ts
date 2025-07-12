type Expect<T extends true> = T extends true ? true : never
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
// ============= Test Cases =============
SimpleVue({
  data() {
    // @ts-expect-error
    this.firstname
    // @ts-expect-error
    this.getRandom()
    // @ts-expect-error
    this.data()

    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return `${this.firstname} ${this.lastname}`
    },
  },
  methods: {
    getRandom() {
      return Math.random()
    },
    hi() {
      alert(this.amount)
      alert(this.fullname.toLowerCase())
      // alert(this.getRandom())
    },
    test() {
      const fullname = this.fullname
      const cases: [Expect<Equal<typeof fullname, string>>] = [] as any
    },
  },
})


// ============= Your Code Here =============

declare function SimpleVue<Data extends Record<string, unknown>, Computed extends Record<string, unknown>, Methods extends Record<string, unknown>>(options: {
  data: (this: never) => Data,
  computed?: { [K in keyof Computed]: (this: Data, ...args: unknown[]) => Computed[K] },
  methods?: { [K in keyof Methods]: (this: Data & Computed & { [K in keyof Methods]: (...args: unknown[]) => Methods[K] }) => Methods[K] },
}): any

export { }