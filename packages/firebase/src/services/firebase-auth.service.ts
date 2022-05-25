import { Service } from '@kodexo/common'
import { HttpError } from '@kodexo/errors'
import { Inject } from '@kodexo/injection'
import { FirebaseService } from './firebase.service'

@Service()
export class FirebaseAuthService {
  private auth

  constructor(@Inject firebaseService: FirebaseService) {
    this.auth = firebaseService.app.auth()
  }

  /**
   *
   */
  async getFirebaseUserIdFromToken(firebaseAccessOrIdToken: string) {
    const { uid } = await this.auth.verifyIdToken(firebaseAccessOrIdToken)
    return uid
  }

  /**
   *
   * @param email
   */
  async generateResetPasswordLink(email: string) {
    try {
      return await this.auth.generatePasswordResetLink(email)
    } catch (err: any) {
      throw HttpError.NotAcceptable(`Too many attempts, try again later`)
    }
  }

  /**
   *
   * @param email
   * @param password
   */
  async createFirebaseUser(userPayload: CreateFirebaseUserPayload) {
    const { email, password, firstName, lastName } = userPayload

    const displayName = `${firstName} ${lastName}`

    return await this.auth.createUser({
      email,
      password,
      emailVerified: true,
      displayName
    })
  }
}

export type CreateFirebaseUserPayload = {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}
