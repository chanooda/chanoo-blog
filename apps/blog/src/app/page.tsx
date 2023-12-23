import { WriteRepository } from 'src/repository/writeRepository';
import { WriteList } from './components/WriteList';

export const dynamic = 'force-dynamic';

const getData = async () => {
  const writeRepository = new WriteRepository();
  const writes = await writeRepository.getWrites({
    isPublish: true
  });
  return writes;
};

export default async function Home() {
  const writes = await getData();
  return <WriteList writeList={writes} />;
}
