declare type Output = 'json' | 'compactJson' | 'pdf'
declare interface Options {
  styles?: any
  output?: Output
}
declare const xmlto: (xml: string, options?: Options) => Promise<any>
export default xmlto
