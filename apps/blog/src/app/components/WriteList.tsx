'use client';

import React from 'react';
import { Grid2, WriteListCard } from 'ui';
import { NextLink } from '@Components/common/NextLink';
import { Write } from 'utils';

interface WriteListProps {
  writeList: Write[];
}

export function WriteList({ writeList }: WriteListProps) {
  return (
    <Grid2
      columns={{ xs: 2, sm: 8, md: 9, lg: 9, xl: 9 }}
      container
      spacing={{ xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }}
      width="100%"
    >
      {writeList?.map((write) => {
        return (
          <Grid2 key={write.id} lg={3} md={3} sm={4} xl={3} xs={2}>
            <NextLink href={`/post/${write.id}`}>
              <WriteListCard write={write} />
            </NextLink>
          </Grid2>
        );
      })}
    </Grid2>
  );
}
