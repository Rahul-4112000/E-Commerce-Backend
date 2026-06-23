import { ZodError } from "zod";

const validate =
  (schema) =>
    async (req, res, next) => {
      try {
        await schema.parseAsync({
          body: req.body,
        });
        next();
      } catch (err) {
        let errors;
        if (err instanceof ZodError) {
          errors = err.issues.map((issue) => ({
            fieldName: issue.path[1],
            message: issue.message,
          }));
        }
        res.status(400).json({
          success: false,
          message: "validation failed",
          errors: errors,
        });
      }
    };

export { validate };
