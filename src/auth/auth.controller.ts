import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiErrorResponseDto,
} from '../common';
import { CurrentUser, Public } from './decorators';
import { AuthResponseDto, AuthUserDto, LoginDto, RegisterUserDto } from './dto';
import { JwtAuthGuard } from './guards';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Registrar usuario base',
    description:
      'Endpoint de bootstrap para desarrollo/test cuando AUTH_REGISTER_ENABLED=true. En producción el registro público de ADMIN debe permanecer deshabilitado y el usuario inicial debe crearse por seed o procedimiento manual controlado.',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiEnvelopeCreated('Usuario registrado correctamente.')
  @ApiForbiddenResponse({
    description: 'El registro público fue deshabilitado por configuración.',
    type: ApiErrorResponseDto,
  })
  @Public()
  @Post('register')
  register(@Body() dto: RegisterUserDto): Promise<AuthUserDto> {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Iniciar sesión y obtener access token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiEnvelopeOk('Autenticación realizada correctamente.')
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas o usuario inactivo.',
    type: ApiErrorResponseDto,
  })
  @Public()
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Obtener usuario autenticado actual' })
  @ApiBearerAuth('access-token')
  @ApiEnvelopeOk('Usuario autenticado obtenido correctamente.')
  @ApiUnauthorizedResponse({
    description: 'Token Bearer inválido o ausente.',
    type: ApiErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
