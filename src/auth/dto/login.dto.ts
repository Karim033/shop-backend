import { IsEmail } from 'class-validator';
import { IsPassword } from 'common/decorators/validators/is-password.decorator';

export class LoginDto {
  @IsEmail()
  email: string;
  /**
   * Requires
   * 1. 8 to 20 characters
   * 2. At least one
   * - Lowercase letter
   * - Uppercase letter
   * - Number
   * - Special character
   */
  @IsPassword()
  password: string;
}
