import { Service } from '@kodexo/common'
import { ConfigurationService } from '@kodexo/config'
import { Inject } from '@kodexo/injection'
import type { app as firebaseApp, ServiceAccount } from 'firebase-admin'
import * as admin from 'firebase-admin'

@Service()
export class FirebaseService {
  public readonly app: firebaseApp.App

  constructor(@Inject config: ConfigurationService) {
    const serviceAccount = config.getOrFail<ServiceAccount>('firebase')
    this.app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  }
}
