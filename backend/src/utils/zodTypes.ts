import z,{UserSchema} from './zodSchemas';

export type UserType = z.infer<typeof UserSchema>;