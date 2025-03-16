import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import Layout from '@components/layout/Layout';
import Hero from '@components/home/Hero';
import FeaturedStories from '@components/home/FeaturedStories';
import HowItWorks from '@components/home/HowItWorks';
import CreatorShowcase from '@components/home/CreatorShowcase';
import TokenEconomy from '@components/home/TokenEconomy';
import CallToAction from '@components/home/CallToAction';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Lumen Tales | Interactive Narrative Platform</title>
        <meta
          name="description"
          content="Lumen Tales is a groundbreaking platform that fuses AI-generated consistent character imagery with branching narratives, underpinned by a token economy."
        />
      </Head>

      <main>
        <Hero />
        <FeaturedStories />
        <HowItWorks />
        <CreatorShowcase />
        <TokenEconomy />
        <CallToAction />
      </main>
    </Layout>
  );
};

export default Home; 