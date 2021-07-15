import { PartialDeep } from 'type-fest'

type OtherConfiguration = {
  [key: string]: any
}

export type ServerConfiguration = PartialDeep<Kodexo.Configuration> & OtherConfiguration
