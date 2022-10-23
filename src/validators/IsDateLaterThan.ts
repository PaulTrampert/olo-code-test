import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";

export const IsDateLaterThan = (otherProp: string, validationOptions?: ValidationOptions) =>
    (target: any, propName: string) => {
        registerDecorator({
            name: 'isDateLaterThan',
            target: target.constructor,
            propertyName: propName,
            options: {
                message: "$property must be later than $constraint1",
                ...validationOptions
            },
            constraints: [otherProp],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [otherPropName] = args.constraints;
                    const otherValue = (args.object as any)[otherPropName];
                    return value instanceof Date && otherValue instanceof Date && value.getTime() > otherValue.getTime();
                }
            }
        })
    }