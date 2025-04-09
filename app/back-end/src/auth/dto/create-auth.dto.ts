import { ApiProperty } from '@nestjs/swagger';

export class SignInDTO {
  @ApiProperty({
    description: "User's email",
  })
  readonly email: string;

  @ApiProperty({
    description: "User's password",
  })
  readonly password: string;
}
