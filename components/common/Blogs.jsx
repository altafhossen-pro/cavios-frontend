"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { blogPosts } from "@/data/blogs";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { getLatestBlogs } from "@/features/blog/api/blogApi";

export default function Blogs({
  parentClass = "flat-spacing pt-0",
  readMore = false,
}) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLatestBlogs({ limit: 3 });
        
        if (response.success && response.data && response.data.length > 0) {
          setBlogs(response.data);
        } else {
          // Fallback to static data if API fails or no blogs
          setBlogs(blogPosts);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
        // Fallback to static data
        setBlogs(blogPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Use blogs from API or fallback to static data
  const displayBlogs = blogs.length > 0 ? blogs : blogPosts;

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">News insight</h3>
          <p className="subheading text-secondary wow fadeInUp">
            Browse our Top Trending: the hottest picks loved by all.
          </p>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <p>Loading blogs...</p>
          </div>
        ) : (
          <Swiper
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 15,
                pagination: { clickable: true },
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
                pagination: { clickable: true },
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
                pagination: { clickable: true },
              },
            }}
            dir="ltr"
            className="swiper tf-sw-recent"
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".spd1",
            }}
          >
            {displayBlogs.map((post, index) => {
              // Handle both API data and static data formats
              const blogId = post._id || post.id;
              const blogTitle = post.title;
              const blogDescription = post.description;
              const blogImage = post.image || post.imgSrc;
              const blogDate = post.publishedAt ? formatDate(post.publishedAt) : (post.date || "");
              const blogSlug = post.slug || blogId;
              const delay = post.delay || `${index * 0.1}s`;

              return (
                <SwiperSlide key={blogId || index} className="swiper-slide">
                  <div
                    className="wg-blog style-1 hover-image wow fadeInUp"
                    data-wow-delay={delay}
                  >
                    <div className="image">
                      <Image
                        className="aspect-ratio-1 ls-is-cached lazyload"
                        data-src={blogImage}
                        alt={blogTitle || "Blog"}
                        src={blogImage}
                        width={615}
                        height={461}
                      />
                    </div>
                    <div className="content">
                      <p className="text-btn-uppercase text-secondary-2">
                        {blogDate}
                      </p>
                      <div>
                        <h6 className="title fw-5">
                          <Link className="link" href={`/blog-detail/${blogSlug}`}>
                            {blogTitle}
                          </Link>
                        </h6>
                        {readMore ? (
                          <Link
                            href={`/blog-detail/${blogSlug}`}
                            className="btn-readmore mt-0 link"
                          >
                            Readmore
                          </Link>
                        ) : (
                          <div className="body-text">{blogDescription}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}

            <div className="sw-pagination-recent spd1 sw-dots type-circle justify-content-center" />
          </Swiper>
        )}
      </div>
    </section>
  );
}
