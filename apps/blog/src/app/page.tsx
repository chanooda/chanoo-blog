import { WriteRepository } from 'src/repository/writeRepository';
import { WriteList } from './components/WriteList';

export const getData = async () => {
  const writeRepository = new WriteRepository();
  const writes = await writeRepository.getWrites({});
  return writes;
};

export default async function Home() {
  const writes = await getData();
  return <WriteList writeList={writes} />;
}
