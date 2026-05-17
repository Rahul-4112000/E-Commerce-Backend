import z from "zod";
import { emailSchema } from "./utility.validation";

const invitationSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export { invitationSchema };
