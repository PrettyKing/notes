type Expect<T extends true> = T extends true ? true : never
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
// ============= Test Cases =============
SimpleVue({
  data() {
    this.firstname
    this.getRandom()
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
      alert(this.getRandom())
    },
    test() {
      const fullname = this.fullname
      const cases: [Expect<Equal<typeof fullname, string>>] = [] as any
    },
  },
})


// ============= Your Code Here =============

type VueOptions = {
    data: () => Record<string, any>
    computed?: Record<string, () => any>
    methods?: Record<string, (...args: any[]) => any>
    [key: string]: any
}

type VueInstance = {
  data: () => Record<string, any>
  computed: Record<string, () => any>
  methods: Record<string, (...args: any[]) => any>
  [key: string]: any
}

declare function SimpleVue(options: VueOptions): VueInstance
export {}