import { Module } from '@kodexo/common'
import { AclService } from './components'
import { AccessControlService } from './components/access-control.service'

@Module({
  imports: [AccessControlService, AclService]
})
export class AccessControlModule {}
