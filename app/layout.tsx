import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.darianzhao.com"),
  title: {
    default: "Darian Zhao · 赵达然",
    template: "%s · Darian Zhao",
  },
  description:
    "Darian Zhao 的个人主页：经历、作品、思考与正在发生的事。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Darian Zhao",
    title: "Darian Zhao · 赵达然",
    description: "一个持续生长的个人坐标系。",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Darian Zhao · 赵达然",
    description: "一个持续生长的个人坐标系。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
