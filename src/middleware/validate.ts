import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod/v3";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {


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
       }))
      }
      res.status(400).json({
        success: false,
        message: 'validation failed',
        errors: errors
      })
    }

  };

export { validate };
