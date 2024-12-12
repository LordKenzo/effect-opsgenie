import { Effect, pipe, Schema } from "effect"
import { TimelineResponseSchema } from './decoder'
import { getCurrentMonthTimeline } from './timeline'
import dotenv from 'dotenv'

dotenv.config()
const decodeResponse = Schema.decode(TimelineResponseSchema)

const makeProgram = () => {
  const program = pipe(
    getCurrentMonthTimeline(),
    Effect.flatMap(decodeResponse),
    Effect.andThen(r => {
      return [r.data.finalTimeline.rotations, r.data.baseTimeline.rotations]
    })
  )

  return program;
}


const main = async () => {
  const [base, final] = await Effect.runPromise(makeProgram())
  console.log(base)
  console.log(final)
}

console.log('Start')
main();