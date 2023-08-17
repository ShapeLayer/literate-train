declare global {
  interface IUser {
    id: Number,
    bojHandle: String,
    jnuEmail: String | undefined,
    uploadFile: Boolean
  }

  interface IVerify {
    id: Number,
    code: String
  }

  interface IEmailVerify extends IVerify {}
  interface ILoginVerify extends IVerify {}
}
