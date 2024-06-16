import type { Metadata } from "next";
import "../templates/css/site.css"

export const metadata: Metadata = {
  title: "My customer submission",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={'h-100'}>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
              crossOrigin="anonymous"/>
      </head>
    <body className={'d-flex flex-column h-100'}>{children}</body>
    </html>
  );
}
