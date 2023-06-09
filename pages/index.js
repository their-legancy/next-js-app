
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Post from '../components/Post';
import Banner from "../components/Banner";
import search from "../search.json";
import Head from 'next/head';
import { sortByDate, slugify, ImageUrl } from '../utils';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

export default function Home() {
  const { query } = useRouter()
  const TempPosts = []

  search.map(
    (post) => {
      if (post.frontmatter.draft === false) {
        if (post.frontmatter.name.toLowerCase().includes(query.q)) {
          TempPosts.push(post)
        } else {
          TempPosts.push(null)
        }
      }
    }
  )

  //   remove null in posts 
  const posts = TempPosts.filter(
    path => {
      return path && path
    }
  )


  return (
    <>
      <Head>
        <title>Home | Their Legency</title>
      </Head>
      <Banner />

      <section id="search-result" className="w-full font-medium px-6 py-6">
        <div className="search-result-inner flex flex-wrap items-self-start justify-center">



          {
            posts.length > 0 ?
              posts.map((post, index) => (
                <Post key={index} post={post} />
              )) : <div className='m-auto p-5 mx-5 '>
                <h2 className='text-center text-white'>
                  {query.q ? `${query.q} အမည်ဖြင့် အချက်အလက်မရှိပါ။  ` : 'ကျေးဇူးပြု၍ အထက်ပါအကွက်တွင် ရှာဖွေပါ၊ ရလဒ်သည် ဤနေရာတွင် ပြပါမည်။'}
                </h2>
              </div>
          }
        </div>

      </section>

    </>


  )
}

export async function getStaticProps() {
  // Get files from the posts dir
  const files = fs.readdirSync(path.join('posts'));

  // Get slug and frontmatter from posts
  const tempPosts = files.map((filename) => {
    // Create slug
    const slug = filename.replace('.md', '');

    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    )

    const { data: frontmatter } = matter(markdownWithMeta);


    if (frontmatter.draft === false) {
      return {
        slug,
        frontmatter,
      }
    } else {
      return null
    }

  })

  //  remove null in tempPosts 
  const posts = tempPosts.filter(
    post => {
      return post && post
    }
  )
  const jsonString = JSON.stringify(posts)
  fs.writeFileSync('./search.json', jsonString, err => {
    if (err) {
      console.log('Error writing file', err);
    } else {
      console.log('Successfully wrote file');
    }
  })

  return {
    props: {
      posts: posts.sort(sortByDate),
    },
  }


}



