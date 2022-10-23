import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";

export const IsDateOnInterval = (minutes: number, validationOptions?: ValidationOptions) =>
    (target: any, propName: string) => {
        registerDecorator({
            name: 'isDateOnInterval',
            target: target.constructor,
            propertyName: propName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return value instanceof Date && value.getMinutes() % minutes === 0;
                }
            }
        })
    }