"use client";

import React, { useState, useCallback } from "react";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import Image from "next/image";

export default function BlogDetail1({ blog }) {
  const [refreshComments, setRefreshComments] = useState(0);

  const handleCommentAdded = useCallback(() => {
    // Trigger refresh by changing state
    setRefreshComments((prev) => prev + 1);
  }, []);

  const blogId = blog._id || blog.id;
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Handle both API data and static data formats
  const blogTitle = blog.title || "";
  const blogDescription = blog.description || "";
  const blogContent = blog.content || blog.description || ""; // HTML content from TinyMCE
  const blogImage = blog.image || blog.imgSrc || "";
  const blogAuthor = blog.author || "Admin";
  const blogDate = blog.publishedAt ? formatDate(blog.publishedAt) : (blog.date || "");

  // Prepare share URLs
  const shareTitle = encodeURIComponent(blogTitle);
  const blogSlug = blog.slug || blog.id || '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const fullUrl = siteUrl ? `${siteUrl}/blog-detail/${blogSlug}` : `/blog-detail/${blogSlug}`;
  const shareUrl = encodeURIComponent(fullUrl);

  return (
    <div className="blog-detail-wrap">
      {blogImage && (
        <div className="container mb-4" style={{ maxWidth: '970px', margin: '20px auto 20px', padding: '0 15px' }}>
          <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
            <Image
              alt={blogTitle || "Blog"}
              src={blogImage}
              width={1920}
              height={1080}
              sizes="(max-width: 768px) 100vw, 970px"
              style={{ 
                objectFit: 'contain',
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
              }}
              priority
            />
          </div>
        </div>
      )}
      <div className="inner mt-0">
        <div className="heading">
          <h3 className="fw-5">{blogTitle}</h3>
          <div className="meta justify-content-center">
            {blogDate && (
              <div className="meta-item gap-8">
                <div className="icon">
                  <i className="icon-calendar" />
                </div>
                <p className="body-text-1">{blogDate}</p>
              </div>
            )}
            {blogAuthor && (
              <div className="meta-item gap-8">
                <div className="icon">
                  <i className="icon-user" />
                </div>
                <p className="body-text-1">
                  by{" "}
                  <span>{blogAuthor}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="content">
          {blogDescription && !blogContent && (
            <p className="body-text-1 mb_12">{blogDescription}</p>
          )}
          {blogContent && (
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blogContent }}
              style={{
                lineHeight: '1.8',
                fontSize: '16px',
              }}
            />
          )}
        </div>
        <div className="bot d-flex justify-content-between gap-10 flex-wrap">
          <div className="d-flex align-items-center justify-content-between gap-16">
            <p>Share this post:</p>
            <ul className="tf-social-icon style-1">
              <li>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-facebook"
                  aria-label="Share on Facebook"
                >
                  <i className="icon icon-fb" />
                </a>
              </li>
              <li>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-twiter"
                  aria-label="Share on Twitter"
                >
                  <i className="icon icon-x" />
                </a>
              </li>
              <li>
                <a 
                  href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pinterest"
                  aria-label="Share on Pinterest"
                >
                  <i className="icon icon-pinterest" />
                </a>
              </li>
              <li>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-instagram"
                  aria-label="Share on LinkedIn"
                >
                  <i className="icon icon-instagram" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        {blogId && (
          <>
            <Comments key={refreshComments} blogId={blogId} />
            <CommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />
          </>
        )}
      </div>
    </div>
  );
}
