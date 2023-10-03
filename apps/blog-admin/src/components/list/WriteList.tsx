import { List, ListItem } from 'ui';
import { GlobalError } from 'react-hook-form';
import { getQuery, objetEmptyFilter } from 'utils';
import { useLocation } from 'react-router-dom';
import { useChanooQuery } from '../../libs/queryHook';
import { WriteRes } from '../../types/res';
import { WriteListItem } from './WriteListItem';

export function WriteList() {
  const { search: query } = useLocation();

  const queryObject = getQuery(query, ['search', 'seriesId', 'tagId']);

  const { data: writeList } = useChanooQuery<WriteRes[], GlobalError>(
    ['/write', objetEmptyFilter(queryObject)],
    {
      suspense: true
    }
  );

  return (
    <List>
      {writeList?.data?.data?.map((write) => (
        <ListItem key={write.id} sx={{ cursor: 'pointer' }}>
          <WriteListItem write={write} />
        </ListItem>
      ))}
    </List>
  );
}
