import { Metadata } from 'next';
import { WriteRepository } from 'src/repository/writeRepository';
import { removeMarkdown } from 'utils';
import { PostDetail } from '../components/PostDetail';

interface PageProps {
  params: {
    id: number;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const writeRepository = new WriteRepository();
  const write = await writeRepository.getWrite({ id: params.id });

  return {
    title: `${write.title} | chanoo`,
    description: removeMarkdown(write.content),
    openGraph: {
      title: write.title,
      images: [write.imgUrl || ''],
      description: removeMarkdown(write.content)
    }
  };
}

export default async function Page({ params }: PageProps) {
  const writeRepository = new WriteRepository();
  const write = await writeRepository.getWrite({ id: params.id });

  return <PostDetail write={write} />;
}
