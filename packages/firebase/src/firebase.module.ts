import { Module } from '@kodexo/common'
import { FirebaseAuthService } from './services/firebase-auth.service'
import { FirebaseMessagingService } from './services/firebase-messaging.service'
import { FirebaseService } from './services/firebase.service'

@Module({
  providers: [FirebaseService, FirebaseAuthService, FirebaseMessagingService]
})
export class FirebaseModule {}
