'use client';

import { NextLink } from '@Components/common/NextLink';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Grid2,
  InputLabel,
  MenuItem,
  MenuList,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  WriteListCard,
  useMediaQuery
} from 'ui';
import { Series, Tag, Write, WriteFilterForm, useForm } from 'utils';

interface PostListProps {
  series: Series[];
  tags: Tag[];
  writes: Write[];
}

export function PostList({ writes, series, tags }: PostListProps) {
  const query = useSearchParams();
  const router = useRouter();
  const matches = useMediaQuery('(min-width:1270px)');
  const [mediaQueryLoading, setMediaQueryLoading] = useState(false);

  const { register, watch, reset } = useForm<WriteFilterForm>({
    defaultValues: {
      search: '',
      seriesId: Number(query.get('seriesId')) || 0,
      tagId: Number(query.get('tagId')) || 0
    }
  });

  const { search, tagId } = watch();

  const resetQuires = () => {
    router.push('/post');
  };

  const setQueries = (chooseSeriesId = '', chooseTagId = '') => {
    router.push(`/post?search=${search}&seriesId=${chooseSeriesId}&tagId=${chooseTagId}`);
  };

  const searchSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    setQueries();
  };

  const changeSeriesHandler = (e: SelectChangeEvent<number>) => {
    setQueries(String(e.target.value));
  };

  const changeTagHandler = (chooseTagId: number) => {
    setQueries('', String(chooseTagId));
  };

  useEffect(() => {
    reset({
      search: '',
      seriesId: Number(query.get('seriesId')) || 0,
      tagId: Number(query.get('tagId')) || 0
    });
  }, [query]);

  useEffect(() => {
    setMediaQueryLoading(true);
  }, []);

  return (
    <Stack>
      <Stack>
        <Stack maxWidth={800} mx="auto" position="relative" width="100%">
          {mediaQueryLoading && !matches && (
            <Stack direction="row" gap={1} mb={1}>
              <TextField {...register('search')} placeholder="검색" size="small" />
              <Select
                {...(register('seriesId'),
                {
                  onChange: changeSeriesHandler
                })}
                defaultValue={watch('seriesId')}
                size="small"
              >
                <MenuItem value={0}>시리즈 선택</MenuItem>
                {series?.map((seriesName) => (
                  <MenuItem key={seriesName.id} value={seriesName.id}>
                    {seriesName.name}
                  </MenuItem>
                ))}
              </Select>
              <Select {...register('tagId')} defaultValue={watch('tagId')} size="small">
                <MenuItem value={0}>태그 선택</MenuItem>
                {tags?.map((tag) => (
                  <MenuItem
                    key={tag.id}
                    selected={tag.id === tagId}
                    value={tag.id}
                    onClick={() => changeTagHandler(tag.id)}
                  >
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
              <Button size="small" variant="text" onClick={resetQuires}>
                초기화
              </Button>
            </Stack>
          )}
          {mediaQueryLoading && matches && (
            <Stack gap={2} left={-235} minWidth={200} position="absolute" width={200}>
              <Stack width="100%">
                <Stack alignItems="center" direction="row" justifyContent="space-between">
                  <InputLabel>Search</InputLabel>
                  <Button size="small" variant="text" onClick={resetQuires}>
                    초기화
                  </Button>
                </Stack>
                <Stack component="form" width="100%" onSubmit={searchSubmitHandler}>
                  <TextField {...register('search')} placeholder="검색" size="small" />
                </Stack>
              </Stack>
              <Stack width="100%">
                <InputLabel>Series</InputLabel>
                <Select
                  {...(register('seriesId'),
                  {
                    onChange: changeSeriesHandler
                  })}
                  defaultValue={watch('seriesId')}
                  size="small"
                >
                  <MenuItem value={0}>전체</MenuItem>
                  {series?.map((seriesName) => (
                    <MenuItem key={seriesName.id} value={seriesName.id}>
                      {seriesName.name}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Divider />
              <Stack width="100%">
                <InputLabel>Tags</InputLabel>
                <MenuList>
                  {tags?.map((tag) => (
                    <MenuItem
                      key={tag.id}
                      selected={tag.id === tagId}
                      onClick={() => changeTagHandler(tag.id)}
                    >
                      {tag.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Stack>
            </Stack>
          )}
          {writes?.length > 0 ? (
            <Grid2
              columns={{ xs: 8, sm: 8, md: 8 }}
              container
              spacing={{ xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }}
              width="100%"
            >
              {writes?.map((write) => (
                <Grid2 key={write.id} md={4} sm={4} xs={8}>
                  <NextLink href={`/post/${write.id}`}>
                    <WriteListCard write={write} />
                  </NextLink>
                </Grid2>
              ))}
            </Grid2>
          ) : (
            <Stack width="100%" />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
