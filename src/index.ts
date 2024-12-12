import { showOnCallAction } from "./action/showOnCall"
import dotenv from 'dotenv'

dotenv.config()

const main = async () => {
  const email = process.env.EMAIL_OPSGENIE
  if (!email) {
    throw new Error("EMAIL_OPSGENIE environment variable is not defined")
  }

 await showOnCallAction(`${process.env.EMAIL_OPSGENIE}`)
}

console.log('Start')
main();