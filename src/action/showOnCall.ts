import { Effect, pipe, Schema } from "effect"
import { TimelineResponseSchema, RotationSchema } from "../utils/decoder"
import { getCurrentMonthTimeline } from "../api/timeline"
import { ParseError } from "effect/ParseResult"

export const getBaseRotations = (rotations: ReadonlyArray<RotationSchema>, email: string): ReadonlyArray<RotationSchema> => {
  return rotations.filter((rotation: RotationSchema) => {
    if (rotation.periods && rotation.periods.length > 0) {
      const userMail = rotation.periods[0].recipient.name
      return userMail === email
    }
    return false
  })
}


export const getFinalRotations = (
  rotations: ReadonlyArray<RotationSchema>,
  email: string
): [ReadonlyArray<RotationSchema>, number] => {
  let tokenSpesi = 0

  const rotazioniUtentePassate = rotations.filter((rotation: RotationSchema) => {

    if (rotation.periods && rotation.periods.length > 0) {
      const userMail = rotation.periods[0].recipient.name
      if (!rotation.name.startsWith('BOT') && userMail === email) tokenSpesi++
      return userMail === email && rotation.periods[0].type === 'historical'
    }
    return false
  })

  return [rotazioniUtentePassate, tokenSpesi]

}

const decodeResponse = Schema.decode(TimelineResponseSchema)

const makeProgram = (email: string): Effect.Effect<(readonly RotationSchema[] | [readonly RotationSchema[], number])[], ParseError | Error, never> => {
  const program = pipe(
    getCurrentMonthTimeline(),
    Effect.flatMap(decodeResponse),
    Effect.andThen(r => {
      const [base, final] = [r.data.baseTimeline.rotations, r.data.finalTimeline.rotations]
      return [getBaseRotations(base, email), getFinalRotations(final, email)]

    })
  )

  return program;
}

export const showOnCallAction = async (email: string) => {
  const TOKEN = 5

  try {
    const [base, [final, tokenSpesi]] = await Effect.runPromise(makeProgram(email)) as [ReadonlyArray<RotationSchema>, [ReadonlyArray<RotationSchema>, number]]

    console.log(`Ecco i dettagli del turno di reperibilità per ${email} \n\r`)
    console.log(`Base: ${JSON.stringify(base, null, 2)} \n\r`)
    console.log(`Final: ${JSON.stringify(final, null, 2)} \n\r`)
    console.log(`Token Rimasti: ${JSON.stringify(TOKEN-tokenSpesi, null, 2)} \n\r`)
  } catch(error) {
    console.error(`Failed to execute program: ${error}`)
  }

}