import { CategoryService } from './categories.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(data: {
        name: string;
    }): Promise<{
        name: string;
        id: number;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        name: string;
        id: number;
        createdAt: Date;
    }[]>;
    remove(id: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
    }>;
}
