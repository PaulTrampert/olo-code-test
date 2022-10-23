export const FromQuery = (parser: Function, defaultValue: any) =>
    (target: any, propertyName: string) => {
        Object.defineProperty(target, propertyName, {
            enumerable: true,
            get() {
                return parser(this.req.query[propertyName]) || defaultValue;
            }
        })
    }