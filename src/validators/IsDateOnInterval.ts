import {registerDecorator, ValidationOptions} from "class-validator";

export const IsDateOnInterval = (minutes: number, validationOptions?: ValidationOptions) =>
    (target: any, propName: string) => {
        registerDecorator({
            name: 'isDateOnInterval',
            target: target.constructor,
            propertyName: propName,
            options: {
                message: `$property must be on an interval of ${minutes} minutes`,
                ...validationOptions
            },
            validator: {
                validate(value: any) {
                    return value instanceof Date && value.getMinutes() % minutes === 0;
                }
            }
        })
    }