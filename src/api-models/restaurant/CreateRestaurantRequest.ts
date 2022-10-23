import {MinLength} from 'class-validator';


export class CreateRestaurantRequest {
    @MinLength(3)
    name: string
}