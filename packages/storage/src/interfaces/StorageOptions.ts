export type UploadFileStorageOptions = {
  sizeLimit?: number | string
  maxFiles?: number
  fields?: StorageFieldOptions[]
}

export type StorageFieldOptions = {
  name: string
  subfolder?: string | Promise<string>
}

export type GetFileStreamStorageOptions = {}

export type RemoveFileStorageOptions = {}
