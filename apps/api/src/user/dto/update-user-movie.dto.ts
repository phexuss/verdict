import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateUserMovieDto {
  @IsOptional()
  @IsBoolean()
  saved?: boolean;

  @IsOptional()
  @IsBoolean()
  watched?: boolean;

  @IsOptional()
  @IsIn(['LIKED', 'DISLIKED', null])
  reaction?: 'LIKED' | 'DISLIKED' | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number | null;
}
