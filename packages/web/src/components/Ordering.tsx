// TODO: this might not be necessary anymore as I'm using another version of this algorithm

// // https://github.com/truongkhanhduy95/Lexorank/blob/master/LICENSE
// class Lexorank {
//   MIN_CHAR: number = this.byte("0")
//   MAX_CHAR: number = this.byte("z")

//   insert(prev: string, next: string): [string, boolean] {
//     if (prev == "") {
//       prev = this.string(this.MIN_CHAR)
//     }
//     if (next == "") {
//       next = this.string(this.MAX_CHAR)
//     }

//     let rank: string = ""
//     let i: number = 0

//     while (true) {
//       let prevChar: number = this.getChar(prev, i, this.MIN_CHAR)
//       let nextChar: number = this.getChar(next, i, this.MAX_CHAR)

//       if (prevChar == nextChar) {
//         rank += this.string(prevChar)
//         i++
//         continue
//       }

//       let midChar: number = this.mid(prevChar, nextChar)
//       if (midChar == prevChar || midChar == nextChar) {
//         rank += this.string(prevChar)
//         i++
//         continue
//       }

//       rank += this.string(midChar)
//       break
//     }

//     if (rank >= next) {
//       return [prev, false]
//     }
//     return [rank, true]
//   }

//   string(byte: number): string {
//     return String.fromCharCode(byte)
//   }

//   byte(char: string): number {
//     return char.charCodeAt(0)
//   }

//   mid(prev: number, next: number): number {
//     // TODO: consider to use 8 steps each jump
//     return Math.floor((prev + next) / 2)
//   }

//   getChar(s: string, i: number, defaultChar: number): number {
//     if (i >= s.length) {
//       return defaultChar
//     }
//     return this.byte(s.charAt(i))
//   }
// }

// type Collection = { [key: number]: string }

// const getSorted = (collection: { [key: number]: string }): string[] => {
//   const vals = Object.values(collection).sort()
//   vals.sort()
//   return vals
// }

// const readCollection = () => {
//   return JSON.parse(localStorage.getItem("collection") ?? "{}")
// }

// const writeCollection = (value: Collection) => {
//   localStorage.setItem("collection", JSON.stringify(value))
// }

// const insertAfter = (id: number) => {
//   const rank = new Lexorank()
//   const col = readCollection()
//   const sorted = getSorted(col)

//   const valA = col[id]
//   const indexOfValA = sorted.indexOf(valA)
//   const valB = sorted[indexOfValA + 1] ?? ""

//   // TODO: figure out what the boolean means
//   const [newVal, someBoolean] = rank.insert(valA, valB)

//   // TODO: replace with proper id generation (or actually might not be necessary when using real documents)
//   const newId = Math.max(...Object.keys(col).map((id) => +id)) + 1

//   const newCol = { ...col, [newId]: newVal }

//   writeCollection(newCol)
// }

// // insertAfter(2)

// console.log(readCollection())
// console.log(getSorted(readCollection()))

// export {}

// // console.log(rank.MIN_CHAR, rank.MAX_CHAR)

// // for (let i = rank.MIN_CHAR; i <= rank.MAX_CHAR; i++) {
// //   console.log(String.fromCharCode(i))
// // }

export {}
