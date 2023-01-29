import Head from "next/head";
import { FC } from "react";

interface MetaProps {
  title: string;
  description: string;
  image: string;
}

const Meta: FC<MetaProps> = ({ title, description, image }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <link rel="icon" href="/logo.png" />
    </Head>
  );
};

export default Meta;