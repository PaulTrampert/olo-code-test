export const FromPath = (parser: Function) =>
    (target: any, propertyName: string) => {
        Object.defineProperty(target, propertyName, {
            enumerable: true,
            get() {
                return parser(this.req.query[propertyName]);
            }
        })
    }