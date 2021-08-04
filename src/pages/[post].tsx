import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import type { PostsType, PostType } from 'src/types/microcms';
import * as cheerio from 'cheerio';
import Head from 'next/head';
import Link from 'next/link';
import { client } from 'src/libs/microcms';
import { date } from 'src/libs/date';
import { ClockIcon, FolderIcon, RefreshIcon } from '@heroicons/react/outline';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await client.get<PostsType>({ endpoint: 'posts' });
  const paths = posts.contents.map((content) => {
    return { params: { post: content.id } };
  });
  return { paths, fallback: false };
};

export const getStaticProps = async (context: GetStaticPropsContext<{ post: string }>) => {
  const contentId = context.params?.post;
  const post = await client.get<PostType>({ endpoint: 'posts', contentId: contentId });
  const $ = cheerio.load(post.body);
  const headings = $('h2,h3').toArray();
  const toc = headings.map((heading) => {
    return { text: heading.children[0].data, id: heading.attribs.id, name: heading.name };
  });
  return { props: { post: post, toc: toc } };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Post = (props: Props) => {
  console.log('Render post.');
  const createdAt = date(props.post.createdAt);
  const updatedAt = date(props.post.updatedAt);
  return (
    <>
      {console.log('Render post 2.')}
      <Head>
        <meta name="description" content={props.post.description} />
        <title>yuqlo | {props.post.title}</title>
      </Head>
      <article className="container py-12 sm:py-14 lg:py-16">
        <header className="sm:flex sm:flex-col items-center mb-12 sm:mb-14 lg:mb-16">
          <h1 className="mb-6 sm:mb-7 lg:mb-8">{props.post.title}</h1>
          <div className="sm:flex">
            <div className="flex items-center">
              <FolderIcon className="h-3 sm:h-3.5 lg:h-4 mr-1.5 sm:mr-1.75 lg:mr-2" />
              <span>{props.post.category.name}</span>
            </div>
            <div className="flex items-center sm:mx-3.5 lg:mx-4">
              <ClockIcon className="h-3 sm:h-3.5 lg:h-4 mr-1.5 sm:mr-1.75 lg:mr-2" />
              <time>{createdAt}</time>
            </div>
            <div className="flex items-center">
              <RefreshIcon className="h-3 sm:h-3.5 lg:h-4 mr-1.5 sm:mr-1.75 lg:mr-2" />
              <time>{updatedAt}</time>
            </div>
          </div>
        </header>
        <div className="sm:flex">
          <section dangerouslySetInnerHTML={{ __html: `${props.post.body}` }} className="sm:flex-1 article" />
          {props.toc.length !== 0 && (
            <>
              <div className="hidden sm:block sm:border-r border-gray-300 dark:border-gray-600 sm:mx-3.5 lg:mx-4"></div>
              <section className="hidden sm:block sm:w-1/4">
                <div className="sm:sticky sm:top-121px lg:top-137px">
                  <h6 className="sm:mb-7 lg:mb-8">目次</h6>
                  <ul>
                    {props.toc.map((item) => {
                      return (
                        <li key={item.id} className={`${item.name === 'h3' ? 'sm:px-3.5 lg:px-4' : ''}`}>
                          <Link href={`#${item.id}`}>
                            <a className="font-medium text-blue-500 dark:text-blue-400">{item.text}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            </>
          )}
        </div>
      </article>
    </>
  );
};

export default Post;
