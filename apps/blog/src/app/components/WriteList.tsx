'use client';

import React from 'react';
import { WriteRes } from 'utils';
import { Grid2 } from 'ui';
import { WriteListCard } from './WriteListCard';

interface WriteListProps {
  writeList: WriteRes[];
}

export function WriteList({ writeList }: WriteListProps) {
  return (
    <Grid2 columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 15 }} container spacing={{ xs: 2, md: 3 }}>
      {writeList?.map((write) => {
        return (
          <Grid2 key={write.id} lg={3} md={4} sm={4} xl={3} xs={2}>
            <WriteListCard write={write} />
          </Grid2>
        );
      })}
    </Grid2>
  );
}
