import { ApiProperty } from '@nestjs/swagger';

export class ImdbImportSkippedItemDto {
  @ApiProperty({ example: 'tt4158110' })
  imdbId!: string;

  @ApiProperty({ example: 'Mr. Robot' })
  title!: string;

  @ApiProperty({
    example: 'Filtered: not a movie (TV Series)',
    description: 'Reason why this item was skipped.',
  })
  reason!: string;
}

export class ImdbImportFailedItemDto {
  @ApiProperty({ example: 'tt9999999' })
  imdbId!: string;

  @ApiProperty({ example: 'Unknown Movie' })
  title!: string;

  @ApiProperty({
    example: 'TMDB API error: 404 Not Found',
    description: 'Error message describing what went wrong.',
  })
  error!: string;
}

export class ImdbImportDetailsDto {
  @ApiProperty({ type: [ImdbImportSkippedItemDto] })
  skippedItems!: ImdbImportSkippedItemDto[];

  @ApiProperty({ type: [ImdbImportFailedItemDto] })
  failedItems!: ImdbImportFailedItemDto[];
}

export class ImdbImportResultDto {
  @ApiProperty({
    example: 42,
    description: 'Total number of rows parsed from the CSV file.',
  })
  total!: number;

  @ApiProperty({
    example: 35,
    description: 'Number of movies successfully imported.',
  })
  imported!: number;

  @ApiProperty({
    example: 5,
    description:
      'Number of items skipped (filtered by type, already rated, or not found on TMDB).',
  })
  skipped!: number;

  @ApiProperty({
    example: 2,
    description: 'Number of items that failed due to errors.',
  })
  failed!: number;

  @ApiProperty({ type: ImdbImportDetailsDto })
  details!: ImdbImportDetailsDto;
}
