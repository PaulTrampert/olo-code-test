export const FromPath = (parser: Function) =>
    (target: any, propertyName: string) => {
        Object.defineProperty(target, propertyName, {
            get() {
                return parser(this.req.query[propertyName]);
            }
        })
    }