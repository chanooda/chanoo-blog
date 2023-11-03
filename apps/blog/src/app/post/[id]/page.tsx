import React from 'react';
import { WriteRepository } from 'src/repository/writeRepository';
import { PostDetail } from '../components/PostDetail';

interface PageProps {
  params: {
    id: number;
  };
}

export default async function Page({ params }: PageProps) {
  const writeRepository = new WriteRepository();
  const write = await writeRepository.getWrite({ id: params.id });

  return <PostDetail write={write} />;
}
