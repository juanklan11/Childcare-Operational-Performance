declare module "pdf-parse" {
  const pdfParse: (dataBuffer: Buffer, options?: any) => Promise<{ text: string }>;
  export default pdfParse;
}
