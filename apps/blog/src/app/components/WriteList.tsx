'use client';

import React from 'react';
import { WriteRes } from 'utils';
import { Grid2, WriteListCard } from 'ui';
import { NextLink } from '@Components/common/NextLink';

interface WriteListProps {
  writeList: WriteRes[];
}

export function WriteList({ writeList }: WriteListProps) {
  return (
    <Grid2
      columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 12 }}
      container
      spacing={{ xs: 2, md: 3 }}
      width="100%"
    >
      {writeList?.map((write) => {
        return (
          <Grid2 key={write.id} lg={4} md={6} sm={8} xl={3} xs={2}>
            <NextLink href={`/post/${write.id}`}>
              <WriteListCard write={write} />
            </NextLink>
          </Grid2>
        );
      })}
    </Grid2>
  );
}
