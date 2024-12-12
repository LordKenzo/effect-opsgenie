import { showOnCallAction } from "./action/showOnCall"
import dotenv from 'dotenv'

dotenv.config()

const main = async () => {
 await showOnCallAction(`${process.env.EMAIL_OPSGENIE}`)
}

console.log('Start')
main();