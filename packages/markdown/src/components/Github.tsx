import { cn } from "@ui/lib/utils";
import {
  type ComponentPropsWithoutRef,
  type FC,
  useEffect,
  useState,
} from "react";
import type { ExtraProps } from "react-markdown";
import type { githubRepoInfo, githubUserInfo } from "../markdownType";
import { convertLink } from "../markdownUtils";

// GitHub 링크 컴포넌트 Props 타입
type GithubProps = ComponentPropsWithoutRef<"a"> & ExtraProps;

// GitHub 아이콘 컴포넌트
export const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    aria-label="github"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("fill-current", className)}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// 스켈레톤 컴포넌트
export const GithubSkeleton = ({ type }: { type: "repo" | "user" }) => (
  <span
    className={cn(
      "border border-border rounded-md flex flex-row overflow-hidden animate-pulse",
      type === "repo" ? "h-[106px]" : "h-26"
    )}
  >
    <span className={cn("bg-muted", type === "repo" ? "w-[70%] p-2" : "w-26")}>
      {type === "repo" && (
        <>
          <span className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
          <span className="h-3 bg-muted-foreground/20 rounded w-full mb-1" />
          <span className="h-3 bg-muted-foreground/20 rounded w-2/3" />
        </>
      )}
    </span>
    <span
      className={cn(
        "bg-muted-foreground/10",
        type === "repo" ? "w-[30%]" : "flex-1 p-2"
      )}
    >
      {type === "user" && (
        <>
          <span className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2" />
          <span className="h-3 bg-muted-foreground/20 rounded w-full" />
        </>
      )}
    </span>
  </span>
);

// GitHub URL 파싱 유틸
const parseGithubUrl = (href: string | undefined) => {
  if (!href) return { owner: undefined, repo: undefined };
  const splitUrl = href.replace("https://", "").split("/");
  return {
    owner: splitUrl[1],
    repo: splitUrl[2],
  };
};

export const Github: FC<GithubProps> = ({ href, className, target }) => {
  const { owner, repo } = parseGithubUrl(href);

  const [repoInfo, setRepoInfo] = useState<typeof githubRepoInfo | undefined>(
    undefined
  );
  const [userInfo, setUserInfo] = useState<typeof githubUserInfo | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const fetchGithubData = async () => {
      setLoading(true);
      setError(null);

      try {
        // repo가 있으면 repo 정보를, 없으면 user 정보를 가져옴
        if (repo) {
          const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = (await res.json()) as typeof githubRepoInfo;
          setRepoInfo(data);
        } else {
          const res = await fetch(`https://api.github.com/users/${owner}`, {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = (await res.json()) as typeof githubUserInfo;
          setUserInfo(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();

    return () => controller.abort();
  }, [owner, repo]);

  // 로딩 상태
  if (loading) {
    return <GithubSkeleton type={repo ? "repo" : "user"} />;
  }

  // 에러 또는 데이터 없음 - 일반 링크로 폴백
  if (error || (!repoInfo && !userInfo)) {
    return (
      <a
        href={href}
        target={target}
        className={cn(
          "inline-flex items-center gap-1 text-primary hover:underline",
          className
        )}
      >
        <GithubIcon className="w-4 h-4" />
        {href}
      </a>
    );
  }

  // Repo 카드
  if (repoInfo) {
    return (
      <a
        className={cn(
          "border border-border dark:border-gray-700 rounded-md flex flex-row overflow-hidden h-[106px] hover:border-primary/50 transition-colors no-underline",
          className
        )}
        href={href}
        target={target}
      >
        <span className="h-full p-2 w-[70%] gap-1 flex flex-col">
          <span className="line-clamp-1 font-medium">{repoInfo.full_name}</span>
          {repoInfo.description && (
            <span className="line-clamp-2 text-sm text-muted-foreground">
              {repoInfo.description}
            </span>
          )}
          <span className="items-center flex gap-1 mt-auto text-xs text-muted-foreground">
            <GithubIcon className="w-4 h-4" />
            <span className="line-clamp-1">{repoInfo.html_url}</span>
          </span>
        </span>
        <img
          alt={repoInfo.full_name}
          src={convertLink(href || "")}
          className="object-cover h-full w-[30%]"
        />
      </a>
    );
  }

  // User 카드
  if (userInfo) {
    return (
      <a
        className={cn(
          "border border-border dark:border-gray-700 rounded-md flex flex-row h-26 w-full overflow-hidden hover:border-primary/50 transition-colors no-underline",
          className
        )}
        href={href}
        target={target}
      >
        <img
          alt={userInfo.name || userInfo.login}
          className="w-26 h-26 object-cover"
          src={userInfo.avatar_url}
        />
        <span className="overflow-hidden p-2 flex-1 flex flex-col">
          <span className="line-clamp-1 font-medium">
            {userInfo.name || userInfo.login}
          </span>
          {userInfo.bio && (
            <span className="text-muted-foreground text-sm line-clamp-2">
              {userInfo.bio}
            </span>
          )}
          <span className="flex items-center gap-1 mt-auto text-xs text-muted-foreground">
            <GithubIcon className="w-4 h-4" />
            <span className="line-clamp-1">{userInfo.html_url}</span>
          </span>
        </span>
      </a>
    );
  }

  return null;
};
