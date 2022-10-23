export class PagedResult<T> {
    total: number
    offset: number
    pageSize: number
    results: T[]

    constructor(init?: Partial<PagedResult<T>>) {
        Object.assign(this, init);
    }
}