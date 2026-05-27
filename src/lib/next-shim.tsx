import {
  Link as TLink,
  useNavigate,
  useParams as useTParams,
  useSearch,
} from "@tanstack/react-router";
import type { ReactNode, AnchorHTMLAttributes } from "react";

type LinkProps = {
  href: string;
  children?: ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Link({ href, children, prefetch: _p, scroll: _s, ...rest }: LinkProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <TLink to={href as any} {...(rest as any)}>
      {children}
    </TLink>
  );
}

export default Link;

export function useRouter() {
  const navigate = useNavigate();
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    push: (path: string) => navigate({ to: path as any }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replace: (path: string) => navigate({ to: path as any, replace: true }),
    back: () => {
      if (typeof window !== "undefined") window.history.back();
    },
    forward: () => {
      if (typeof window !== "undefined") window.history.forward();
    },
    refresh: () => {
      if (typeof window !== "undefined") window.location.reload();
    },
    prefetch: () => {},
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (useTParams as any)({ strict: false }) as T;
}

export function useSearchParams() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search = ((useSearch as any)({ strict: false }) ?? {}) as Record<string, string>;
  return {
    get: (key: string) => (key in search ? String(search[key]) : null),
    has: (key: string) => key in search,
    toString: () =>
      new URLSearchParams(
        Object.fromEntries(
          Object.entries(search).map(([k, v]) => [k, String(v ?? "")]),
        ),
      ).toString(),
    entries: () => Object.entries(search)[Symbol.iterator](),
    forEach: (cb: (value: string, key: string) => void) => {
      Object.entries(search).forEach(([k, v]) => cb(String(v ?? ""), k));
    },
  };
}

export function usePathname() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname;
}
