import {MinLength} from 'class-validator';


export class CreateRestaurantRequest {
    @MinLength(3)
    name: string

    constructor(init?: Partial<CreateRestaurantRequest>) {
        Object.assign(this, init);
    }
}