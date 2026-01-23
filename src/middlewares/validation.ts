import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validateBody = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // 1. Convert plain JS object (req.body) to Class Instance
        const output = plainToInstance(dtoClass, req.body);

        // 2. Run Validation
        const errors = await validate(output, { 
            whitelist: true,           // Removes properties not in the DTO
            forbidNonWhitelisted: true // Throws error if user sends extra data
        });

        if (errors.length > 0) {
            // 3. Format errors to be frontend-friendly
            const formattedErrors = errors.map((error: ValidationError) => ({
                field: error.property,
                errors: Object.values(error.constraints || {})
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: formattedErrors
            });
        }

        // 4. Attach the clean, validated object back to req.body
        req.body = output;
        next();
    };
};

const ValidationMiddleware = { validateBody };
export default ValidationMiddleware;