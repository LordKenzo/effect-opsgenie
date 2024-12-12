import { Schema } from "effect"

const RecipientSchema = Schema.Struct({
  id: Schema.String,
  type: Schema.String,
  name: Schema.String
})

const PeriodsSchema = Schema.Struct({
  startDate: Schema.String,
  endDate: Schema.String,
  type: Schema.String,
  recipient: RecipientSchema,
  flattenedRecipients: Schema.optional(Schema.Array(RecipientSchema))
});

export const RotationSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  order: Schema.Number,
  periods: Schema.Array(PeriodsSchema),
})
export interface RotationSchema extends Schema.Schema.Type<typeof RotationSchema> {}

const TimelineSchema = Schema.Struct({
  _parent: Schema.Any,
  startDate: Schema.String,
  endDate: Schema.String,
  finalTimeline: Schema.Struct({
    rotations: Schema.Array(RotationSchema),
  }),
  baseTimeline: Schema.Struct({
    rotations: Schema.Array(RotationSchema),
  }),
})

export const TimelineResponseSchema = Schema.Struct({
  data: TimelineSchema,
  expandable: Schema.Array(Schema.String),
  took: Schema.Number,
  requestId: Schema.String,
})
export type TimelineResponseSchema = Schema.Schema.Type<typeof TimelineResponseSchema>
