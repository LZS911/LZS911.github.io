import Link from "next/link";
import { WEB_TITLE } from "../lib/constants";
import { useRouter } from "next/router";
import cn from "classnames";
import Avatar from "./avatar";

const routerData = [
  {
    href: "/",
    text: "Home",
  },
  {
    href: "/projects",
    text: "Projects",
  },
  {
    href: "/talks",
    text: "Talks",
  },
  {
    href: "/blogs",
    text: "Blogs",
  },
];

const PageHeader = () => {
  const { pathname } = useRouter();

  return (
    <header className="text-white bg-black drop-shadow-2xl">
      <div className="mx-auto my-0 max-w-[960px] py-6 px-4 flex items-center">
        <Avatar
          name="Ai.Haibara"
          picture="/assets/blog/authors/haibara_2.jpg"
          height={100}
          width={100}
        />

        <div className="ml-6">
          <Link href="/" className=" font-bold text-3xl">
            {WEB_TITLE}
          </Link>

          <div className="mt-2">
            {routerData.map((v) => {
              return (
                <Link
                  key={v.text}
                  href={v.href}
                  className={cn(
                    {
                      ["text-black bg-white hover:border-none"]:
                        v.href === pathname,
                    },
                    "p-1 rounded-sm text-xl mr-2 hover:border-b-2 border-indigo"
                  )}
                >
                  {v.text}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
