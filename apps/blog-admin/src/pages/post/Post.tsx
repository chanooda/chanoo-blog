import {
  Button,
  Divider,
  InputLabel,
  LinearProgress,
  MenuItem,
  MenuList,
  Select,
  SelectChangeEvent,
  Stack,
  TextField
} from 'ui';
import { GlobalError, Series, Tag, WriteFilterForm, getQuery, useForm } from 'utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormEvent, Suspense, useEffect } from 'react';
import { useChanooQuery } from '../../libs/queryHook';
import { WriteList } from '../../components/list/WriteList';

export function Post() {
  const { search: query } = useLocation();

  const navigate = useNavigate();

  const queryObject = getQuery(query, ['search', 'seriesId', 'tagId']);

  const { register, watch, reset } = useForm<WriteFilterForm>({
    defaultValues: {
      ...queryObject,
      seriesId: Number(queryObject.seriesId) || 0,
      tagId: Number(queryObject.tagId) || 0
    }
  });

  const { search, tagId } = watch();

  const { data: series } = useChanooQuery<Series[], GlobalError>(['/series']);
  const { data: tags } = useChanooQuery<Tag[], GlobalError>(['/tag']);

  const resetQuires = () => {
    navigate('/post');
  };

  const setQueries = (chooseSeriesId = '', chooseTagId = '') => {
    navigate(`/post?search=${search}&seriesId=${chooseSeriesId}&tagId=${chooseTagId}`);
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
      ...queryObject,
      seriesId: Number(queryObject.seriesId) || 0,
      tagId: Number(queryObject.tagId) || 0
    });
  }, [query]);

  return (
    <Stack direction="row" minHeight="100%" position="relative" py={2}>
      <Stack
        gap={2}
        height="100%"
        minWidth={240}
        p={2}
        width={240}
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            transform: 'translateX(-100%)',
            position: 'absolute'
          }
        })}
      >
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
            {series?.data?.data?.map((seriesName) => (
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
            {tags?.data?.data?.map((tag) => (
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
      <Divider orientation="vertical" />
      <Suspense
        fallback={
          <Stack alignItems="center" height="100%" justifyContent="center" width="100%">
            <LinearProgress />
          </Stack>
        }
      >
        <Stack width="100%">
          <WriteList />
        </Stack>
      </Suspense>
    </Stack>
  );
}
