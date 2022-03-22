import { Module } from '@kodexo/common'
import { ConfigurationService } from './ConfigurationService'

@Module({ imports: [ConfigurationService] })
export class ConfigurationModule {}
