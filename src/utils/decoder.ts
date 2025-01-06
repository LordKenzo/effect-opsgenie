import { Schema } from "effect"

const RecipientSchemaStruct = Schema.Struct({
  id: Schema.String,
  type: Schema.String,
  name: Schema.String
})

const PeriodsSchemaStruct = Schema.Struct({
  startDate: Schema.String,
  endDate: Schema.String,
  type: Schema.String,
  recipient: RecipientSchemaStruct,
  flattenedRecipients: Schema.optional(Schema.Array(RecipientSchemaStruct))
});

const RotationSchemaStruct = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  order: Schema.Number,
  periods: Schema.Array(PeriodsSchemaStruct),
})
export interface RotationSchema extends Schema.Schema.Type<typeof RotationSchemaStruct> {}

const TimelineSchemaStruct = Schema.Struct({
  _parent: Schema.Any,
  startDate: Schema.String,
  endDate: Schema.String,
  finalTimeline: Schema.Struct({
    rotations: Schema.Array(RotationSchemaStruct),
  }),
  baseTimeline: Schema.Struct({
    rotations: Schema.Array(RotationSchemaStruct),
  }),
})

const TimelineResponseSchemaStruct = Schema.Struct({
  data: TimelineSchemaStruct,
  expandable: Schema.Array(Schema.String),
  took: Schema.Number,
  requestId: Schema.String,
})
export interface TimelineResponseSchema extends Schema.Schema.Type<typeof TimelineResponseSchemaStruct> {}

export const decodeTimelineResponseSchema = Schema.decode(TimelineResponseSchemaStruct)