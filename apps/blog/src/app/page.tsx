'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Stack } from 'ui';

export default function Home() {
  // const { data } = useQuery({
  //   queryKey: ['posts'],
  //   queryFn: () => axios.get('https://jsonplaceholder.typicode.com/posts22')
  // });

  const { mutate } = useMutation(() =>
    axios.post('https://64b56c8df3dbab5a95c74bd7.mockapi.io/da')
  );

  return <Stack>ad</Stack>;
}
