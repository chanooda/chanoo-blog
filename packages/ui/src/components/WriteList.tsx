import { Write } from 'utils';
import { WriteListCard } from './WriteListCard';
import { Grid2 } from '..';

interface WriteListProps {
  writeList: Write[];
}

export function WriteList({ writeList }: WriteListProps) {
  return (
    <Grid2 columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 12 }} container spacing={{ xs: 2, md: 3 }}>
      {writeList?.map((write) => {
        return (
          <Grid2 key={write.id} size={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 12 }}>
            <WriteListCard write={write} />
          </Grid2>
        );
      })}
    </Grid2>
  );
}
