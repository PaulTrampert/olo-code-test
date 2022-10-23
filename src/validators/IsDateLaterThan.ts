import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";

export const IsDateLaterThan = (otherProp: string, validationOptions?: ValidationOptions) =>
    (target: any, propName: string) => {
        registerDecorator({
            name: 'isDateOnInterval',
            target: target.constructor,
            propertyName: propName,
            options: validationOptions,
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