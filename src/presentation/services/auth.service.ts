import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

// El servicio será quien hará lo relacionado a la creación del usuario
export class AuthService {
    // DI
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(registerUserDto);

            // Encriptar password
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            // Generar JWT para mantener autenticación del usuario
            // Email de confirmación
            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: 'ABC'
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Email doesn\'t exists');

        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
        if (!isMatching) throw CustomError.badRequest('Password is not valid');

        const { password, ...userEntity } = UserEntity.fromObject(user);
        const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
        if (!token) throw CustomError.internalServer(`Error creating JWT`);

        return {
            user: userEntity,
            token
        };
    }
}