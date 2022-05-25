import { Service } from '@kodexo/common'
import { HttpError } from '@kodexo/errors'
import { Inject } from '@kodexo/injection'
import { MessagingPayload } from 'firebase-admin/lib/messaging/messaging-api'
import { FirebaseService } from './firebase.service'

@Service()
export class FirebaseMessagingService {
  private messaging

  constructor(@Inject firebaseService: FirebaseService) {
    this.messaging = firebaseService.app.messaging()
  }

  /**
   *
   * @param payload
   * @returns
   */
  async sendNotificationToFCMTokens(payload: FirebaseNotificationPayload) {
    try {
      if (!payload.tokens.length) return

      return await this.messaging.sendToDevice(payload.tokens, payload.message)
    } catch (err: any) {
      throw HttpError.InternalServerError(err.message)
    }
  }
}

export type FirebaseNotificationPayload = {
  tokens: string[]
  message: MessagingPayload
}
