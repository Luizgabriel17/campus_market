import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class CartService {
    create(createCartDto: CreateCartDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCartDto: UpdateCartDto): string;
    remove(id: number): string;
}
