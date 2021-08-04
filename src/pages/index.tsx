import type { InferGetStaticPropsType } from 'next';
import type { CategoriesType, PostsType, PostType } from 'src/types/microcms';
import { ClockIcon, FolderIcon, RefreshIcon, XIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import { useEffect, useReducer, useState } from 'react';
import { DispatchContext } from 'src/contexts/DispatchContext';
import { client } from 'src/libs/microcms';
import Link from 'next/link';
import { date } from 'src/libs/date';

export const getStaticProps = async () => {
  const sortedCategories = await client
    .get<CategoriesType>({ endpoint: 'categories' })
    .then((categories) => categories.contents.sort((a, b) => (a.name < b.name ? -1 : 1)));
  const posts = await client.get<PostsType>({ endpoint: 'posts' });
  return { props: { categories: sortedCategories, posts: posts.contents } };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const reducer = (
  state: {
    filter: { category: { id: string; name: string } };
    itemsPerDisplay: number;
    sort: { order: 'asc' | 'desc'; target: 'createdAt' | 'updatedAt' };
  },
  action:
    | { type: 'DEFAULT'; payload: { itemsPerDisplay: number } }
    | { type: 'FILTER'; payload: { filter: { category: { id: string; name: string } }; itemsPerDisplay: number } }
    | { type: 'SEE_MORE'; payload: { addItemsToDisplay: number } }
    | { type: 'SORT'; payload: { order: 'asc' | 'desc'; target: 'createdAt' | 'updatedAt' } }
) => {
  switch (action.type) {
    case 'DEFAULT':
      return {
        filter: { category: { id: 'all', name: 'All' } },
        itemsPerDisplay: action.payload.itemsPerDisplay,
        sort: { order: state.sort.order, target: state.sort.target },
      };
    case 'FILTER':
      return {
        filter: { category: { id: action.payload.filter.category.id, name: action.payload.filter.category.name } },
        itemsPerDisplay: action.payload.itemsPerDisplay,
        sort: { order: state.sort.order, target: state.sort.target },
      };
    case 'SEE_MORE':
      return {
        filter: { category: { id: state.filter.category.id, name: state.filter.category.name } },
        itemsPerDisplay: state.itemsPerDisplay + action.payload.addItemsToDisplay,
        sort: { order: state.sort.order, target: state.sort.target },
      };
    case 'SORT':
      return {
        filter: { category: { id: state.filter.category.id, name: state.filter.category.name } },
        itemsPerDisplay: state.itemsPerDisplay,
        sort: { order: action.payload.order, target: action.payload.target },
      };
    default:
      return state;
  }
};

const createItems = (
  posts: PostType[],
  state: {
    filter: { category: { id: string; name: string } };
    itemsPerDisplay: number;
    sort: { order: 'asc' | 'desc'; target: 'createdAt' | 'updatedAt' };
  }
) => {
  const filter = posts.filter((post) => {
    if (state.filter.category.id === 'all') {
      return post;
    } else if (state.filter.category.id === post.category.id) {
      return post;
    }
  });
  const sort = filter.sort((a, b) => {
    if (state.sort.target === 'createdAt') {
      if (state.sort.order === 'asc') {
        if (a.createdAt < b.createdAt) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (a.createdAt > b.createdAt) {
          return -1;
        } else {
          return 1;
        }
      }
    } else {
      if (state.sort.order === 'asc') {
        if (a.updatedAt < b.updatedAt) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (a.updatedAt > b.updatedAt) {
          return -1;
        } else {
          return 1;
        }
      }
    }
  });
  return sort;
};

const Home = (props: Props) => {
  console.log('Render home.');
  const itemsPerDisplay = 1;
  const [state, dispatch] = useReducer(reducer, {
    filter: { category: { id: 'all', name: 'All' } },
    itemsPerDisplay: itemsPerDisplay,
    sort: { order: 'desc', target: 'createdAt' },
  });
  const items = createItems(props.posts, state);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    open ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden');
  }, [open]);
  return (
    <>
      {console.log('Render home 2.', state)}
      <Head>
        <meta name="description" content="yuqlo" />
        <title>yuqlo</title>
      </Head>
      <DispatchContext.Provider value={dispatch}>
        <section className="container pt-12 sm:pt-14 lg:pt-16 pb-6 sm:pb-7 lg:pb-8">
          <div className="border-b border-gray-300 dark:border-gray-600 py-1.5 sm:py-1.75 lg:py-2 px-3 sm:px-3.5 lg:px-4 mb-6 sm:mb-7 lg:mb-8">
            <div className="relative">
              <h3>投稿</h3>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="absolute right-0 bottom-0 font-medium text-blue-500 dark:text-blue-400"
              >
                絞り込み
              </button>
            </div>
          </div>
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed top-0 left-0 h-screen w-full bg-gray-100 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 pt-57px sm:pt-65px lg:pt-73px"
            >
              <div className="container h-full overflow-auto py-6 sm:py-7 lg:py-8">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full sm:w-1/2 bg-gray-100 dark:bg-gray-800 border rounded-xl sm:rounded-1.5xl lg:rounded-2xl border-gray-300 dark:border-gray-600 sm:mx-auto"
                >
                  <div className="container border-b border-gray-300 dark:border-gray-600 py-3 sm:py-3.5 lg:py-4">
                    <div className="flex items-center justify-between">
                      <h3>絞り込み条件を設定</h3>
                      <button type="button" onClick={() => setOpen(false)}>
                        <span className="sr-only">絞り込みメニューを閉じる</span>
                        <XIcon className="h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="container pt-6 sm:pt-7 lg:pt-8">
                    <h4 className="border-b border-gray-300 dark:border-gray-600 py-1.5 sm:py-1.75 lg:py-2 px-3 sm:px-3.5 lg:px-4 mb-6 sm:mb-7 lg:mb-8">
                      カテゴリー
                    </h4>
                    {state.filter.category.id === 'all' ? (
                      <ul className="px-3 sm:px-3.5 lg:px-4 mb-6 sm:mb-7 lg:mb-8">
                        {props.categories.map((category) => {
                          return (
                            <li key={category.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  dispatch({
                                    type: 'FILTER',
                                    payload: {
                                      filter: { category: { id: category.id, name: category.name } },
                                      itemsPerDisplay: itemsPerDisplay,
                                    },
                                  });
                                  setOpen(false);
                                }}
                                className="w-full text-left font-medium text-blue-500 dark:text-blue-400"
                              >
                                {category.name}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="px-3 sm:px-3.5 lg:px-4 mb-6 sm:mb-7 lg:mb-8">
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'DEFAULT', payload: { itemsPerDisplay: itemsPerDisplay } })}
                          className="inline-flex items-center font-medium text-blue-500 dark:text-blue-400"
                        >
                          <span className="sr-only">条件を解除</span>
                          <XIcon className="h-3 sm:h-3.5 lg:h-4 mr-1.5 sm:mr-1.75 lg:mr-2" />
                          {state.filter.category.name}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex mb-6 sm:mb-7 lg:mb-8">
            <div className="flex-1 text-right">
              {state.sort.target === 'createdAt' ? (
                <span className="font-semibold text-sm sm:text-base lg:text-lg leading-4 sm:leading-5 lg:leading-6">
                  投稿日時が新しい順
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SORT', payload: { order: 'desc', target: 'createdAt' } })}
                  className="font-medium text-blue-500 dark:text-blue-400"
                >
                  投稿日時が新しい順
                </button>
              )}
            </div>
            <span className="mx-1.5 sm:mx-1.75 lg:mx-2">/</span>
            <div className="flex-1">
              {state.sort.target === 'updatedAt' ? (
                <span className="font-semibold text-sm sm:text-base lg:text-lg leading-4 sm:leading-5 lg:leading-6">
                  更新日時が新しい順
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'SORT', payload: { order: 'desc', target: 'updatedAt' } })}
                  className="font-medium text-blue-500 dark:text-blue-400"
                >
                  更新日時が新しい順
                </button>
              )}
            </div>
          </div>
          {items.length ? (
            <>
              <ul className="sm:grid sm:grid-cols-2">
                {items.map((item, i) => {
                  if (state.itemsPerDisplay > i) {
                    const createdAt = date(item.createdAt);
                    const updatedAt = date(item.updatedAt);
                    return (
                      <li
                        key={item.id}
                        className={`${i % 2 === 0 ? 'sm:mr-3.5 lg:mr-4' : 'sm:ml-3.5 lg:ml-4'} mb-6 sm:mb-7 lg:mb-8`}
                      >
                        <Link href={`/${item.id}`}>
                          <a className="block h-full border rounded-xl sm:rounded-1.5xl lg:rounded-2xl border-gray-300 dark:border-gray-600 hover:ring-2 focus:outline-none focus-visible:ring-2 ring-gray-400 dark:ring-gray-500 p-3 sm:p-3.5 lg:p-4">
                            <dl className="h-full flex flex-col">
                              <dt className="flex-1 font-semibold text-lg sm:text-xl lg:text-2xl mb-1.5 sm:mb-1.75 lg:mb-2">
                                {item.title}
                              </dt>
                              <dd className="inline-flex items-center">
                                <FolderIcon className="h-3 sm:h-3.5 lg:h-4 mr-1.5 sm:mr-1.75 lg:mr-2" />
                                <span>{item.category.name}</span>
                              </dd>
                              <dd className="inline-flex items-center">
                                <ClockIcon className="h-3 sm:h-3.5 lg:h-4 mr-1.5 sm:mr-1.75 lg:mr-2" />
                                <time>{createdAt}</time>
                              </dd>
                              <dd className="inline-flex items-center">
                                <RefreshIcon className="h-3 sm:h-3.5 lg:h-4 mr-1.5 sm:mr-1.75 lg:mr-2" />
                                <time>{updatedAt}</time>
                              </dd>
                            </dl>
                          </a>
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>
              {state.itemsPerDisplay < items.length && (
                <div className="text-center mb-6 sm:mb-7 lg:mb-8">
                  <button
                    onClick={() => dispatch({ type: 'SEE_MORE', payload: { addItemsToDisplay: itemsPerDisplay } })}
                    className="font-medium text-blue-500 dark:text-blue-400"
                  >
                    もっと見る
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="px-3 sm:px-3.5 lg:px-4 mb-6 sm:mb-7 lg:mb-8">このカテゴリーに関する投稿はありません。</p>
          )}
        </section>
      </DispatchContext.Provider>
    </>
  );
};

export default Home;
