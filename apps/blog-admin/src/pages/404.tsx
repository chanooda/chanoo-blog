import React from 'react';
import { Button, Stack, Typography } from 'ui';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <Stack alignItems="center" height="100vh" justifyContent="center" width="100vw">
      <Stack alignItems="center" justifyContent="center" spacing={4}>
        <Typography variant="h3">404 - Not Found</Typography>
        <Stack alignItems="center">
          <Typography>존재하지 않는 페이지입니다.</Typography>
          <Link to="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
}
