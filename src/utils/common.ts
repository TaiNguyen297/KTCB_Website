import { INews } from "@/@types/news";
import { QQuoteData, TeamName } from "@/@types/team";
import quoteData from "./data/json/quote.json";
import newsData from "./data/json/news.json";

export const getNewsBySlug = (slug: string) => {
  const data = newsData as unknown as INews[];

  const news = data?.find((item) => item.slug == slug) || null;
  return news;
};

export const getNewsByTags = (title: string, tags: string[]) => {
  const data = newsData as unknown as INews[];

  const res = data
    .filter((news) => {
      return (
        tags.some((tag) => news.tags.includes(tag)) && news.title !== title
      );
    })
    .sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

  return res;
};

export const getNewsWithoutTags = (title: string, tags: string[]) => {
  const data = newsData as unknown as INews[];

  const res = data.filter((news) => {
    return (
      tags.every((tag) => !news.tags.includes(tag)) && news.title !== title
    );
  });

  return res;
};

export const getOtherNewWithoutTags = (tagsAlready: string[]) => {
  const data = newsData as unknown as INews[];
  const filteredItems = newsData.filter((news) => {
    return !news.tags.find((tag) => tagsAlready?.includes(tag));
  }) as unknown as INews[];
  return filteredItems;
};

export const getHighlightNews = (team?: string) => {
  if (team) {
    return sortNews(team)?.[0];
  }
  return sortNews()?.[0];
};

export const getMediumNews = (team?: string) => {
  return sortNews(team)?.slice(1, 7);
};

export const sortNews = (team?: string) => {
  const data = newsData as unknown as INews[];

  const highlightedPosts = data.filter((post) => {
    if (team && post?.team) {
      return post.is_highlight && post?.team.includes(team);
    }
    return post.is_highlight;
  });
  const nonHighlightedPosts = data.filter((post) => {
    if (team && post?.team) {
      return !post.is_highlight && post?.team.includes(team);
    }
    return !post.is_highlight;
  });

  highlightedPosts.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
  nonHighlightedPosts.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  const sortedData = [...highlightedPosts, ...nonHighlightedPosts];

  return sortedData;
};

export const loadMoreSmallNews = async (
  _cursor?: number,
  _pageSize?: number
) => {
  const cursor = _cursor || 7;
  const pageSize = _pageSize || 6;

  const smallNews = sortNews();

  const res = smallNews?.slice(cursor, cursor + pageSize);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: res,
    pageKey:
      smallNews?.length > cursor + pageSize ? cursor + pageSize : undefined,
  };
};

export const loadMoreNews = async (_cursor?: number, _pageSize?: number) => {
  const cursor = _cursor || 0;
  const pageSize = _pageSize || 24;

  const data = newsData as unknown as INews[];

  const dataSort = data.sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  const res = dataSort.slice(cursor, cursor + pageSize);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: res,
    pageKey: data?.length > cursor + pageSize ? cursor + pageSize : undefined,
  };
};

export const getQuoteByTeam = (team?: TeamName) => {
  const data = quoteData as unknown as QQuoteData;

  const res = data[team || "home"];

  return res;
};

export const ellipsisText = (lineClamp = 1) => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: `${lineClamp}`,
    WebkitBoxOrient: "vertical",
  };
};

export const notEmptyMessage = (fieldName: string) => {
  return `${fieldName} không được để trống`;
};

export const maxLengthMessage = (fieldName: string, maxLength = 255) => {
  return `${fieldName} không được để trống và không được quá ${maxLength} ký tự`;
};
