import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    // Check if it's a Zod validation error
    if (error instanceof ZodError) {
      // Use optional chaining (?.) and a fallback empty array to prevent .map() crashes
      const errorMessage = (error.issues || error.errors)
        ?.map((err) => `${err.path.join(".")} : ${err.message}`)
        .join(" | ");
      
      return next(new ApiError(400, errorMessage || "Validation failed"));
    }
    
    // If it's some other unexpected error, pass it to the global handler
    next(error);
  }
};

export default validate;
