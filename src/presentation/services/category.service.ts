import { CategoryModel } from '../../data';
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from '../../domain';

export class CategoryService {
    // DI
    constructor() { }

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
        if (categoryExists) throw CustomError.badRequest('Category already exists');

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            });

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }
        } catch (error) {
            throw CustomError.internalServer(`Internal server ${error}`);
        }
    }

    async getCategories(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip((page - 1) * limit) // 0*limit = pag1, 1*limit = pag2, n*limit = pagn+1
                    .limit(limit)
            ])
            // const total = await CategoryModel.countDocuments();
            // const categories = await CategoryModel.find()
            //     .skip((page - 1) * limit) // 0*limit = pag1, 1*limit = pag2, n*limit = pagn+1
            //     .limit(limit);

            return {
                page,
                limit,
                total,
                next: `/api/categories?page=${page + 1}&limit=${limit}`,
                previous: (page - 1 > 0) ? `/api/categories?page=${page - 1}&limit=${limit}`: null,
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available
                }))
            };
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    }
}