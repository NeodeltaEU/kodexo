export interface FileResult {
  key: string
  originalMimetype: string
  size: number
  mimetype: string
  encoding: string
  extension: string | null
  originalFilename: string
  path: string
  cdn?: string
  metadata: { [key: string]: any }
}
