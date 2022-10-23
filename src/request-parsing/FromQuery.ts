export const FromQuery = (parser: Function, defaultValue: any) =>
    (target: any, propertyName: string) => {
        Object.defineProperty(target, propertyName, {
            get() {
                return parser(this.req.query[propertyName]) || defaultValue;
            }
        })
    }