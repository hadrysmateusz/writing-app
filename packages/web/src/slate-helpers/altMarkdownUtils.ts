// ==================== Experimental markdown utils using remark-slate-transformer ================
// Currently unused because remark-slate-transformer doesn't support plate editor schema
// ================================================================================================

// import { unified } from "unified"
// import markdown from "remark-parse"
// import { remarkToSlate, slateToRemark } from "remark-slate-transformer"
// import stringify from "remark-stringify"

// // Remark => Slate
// export const newDeserializeMd = (value: string) => {
//   console.log("deserializing: ", value)
//   const processor = unified().use(markdown).use(remarkToSlate)
//   const processedValue = processor.processSync(value).result
//   console.log("deserialized:", processedValue)
//   return processedValue
// }

// // Slate => Remark
// export const newSerializeMd = (value) => {
//   const processor = unified().use(slateToRemark).use(stringify)
//   const ast = processor.runSync(value)
//   console.log(ast)
//   const text = processor.stringify(ast)
//   console.log(text)
// }

export {}
