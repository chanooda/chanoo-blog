'use client';

import { NextLink } from '@Components/common/NextLink';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import {
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  WriteListCard,
  WriteListItem
} from 'ui';
import { Series, SeriesDetail, useForm } from 'utils';

interface SeriesListProps {
  series: Series[];
  seriesDetail?: SeriesDetail;
}

interface SeriesListForm {
  seriesId: number;
}

export function SeriesList({ series, seriesDetail }: SeriesListProps) {
  const query = useSearchParams();
  const router = useRouter();
  const { register, watch } = useForm<SeriesListForm>({
    defaultValues: {
      seriesId: Number(query.get('seriesId')) || 0
    }
  });

  const changeSeriesHandler = (e: SelectChangeEvent<number>) => {
    const seriesId = e.target.value;
    router.push(seriesId ? `/series?seriesId=${seriesId}` : '/series');
  };

  return (
    <Stack height="100%" maxWidth={800} minHeight="100%" mx="auto" width="100%">
      <Stack width={300}>
        <Select
          {...(register('seriesId'),
          {
            onChange: changeSeriesHandler
          })}
          defaultValue={watch('seriesId')}
          size="small"
        >
          <MenuItem value={0}>시리즈를 선택해주세요.</MenuItem>
          {series?.map((seriesName) => (
            <MenuItem key={seriesName.id} value={seriesName.id}>
              {seriesName.name}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      {seriesDetail ? (
        <Stack gap={2} mt={4} width="100%">
          {seriesDetail.writes.map((write) => (
            <NextLink href={`/post/${write.id}`} key={write.id}>
              <WriteListItem write={write} />
            </NextLink>
          ))}
        </Stack>
      ) : (
        <Stack alignItems="center" height="100%" justifyContent="center" width="100%">
          <Typography variant="h5">시리즈를 선택해주세요.</Typography>
        </Stack>
      )}
    </Stack>
  );
}
