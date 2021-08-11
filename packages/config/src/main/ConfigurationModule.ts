import { Module } from '@uminily/common'
import { ConfigurationService } from './ConfigurationService'

@Module({ imports: [ConfigurationService] })
export class ConfigurationModule {}
