"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getBlogComments } from "@/features/blog/api/blogCommentApi";

export default function Comments({ blogId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await getBlogComments(blogId);
      if (response.success) {
        setComments(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const renderComment = (comment, isReply = false) => {
    return (
      <div key={comment._id || comment.id} className={`reply-comment-item ${isReply ? 'type-reply' : ''}`}>
        <div className="image">
          {/* Default avatar with initials */}
          <div
            style={{
              width: 90,
              height: 113,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#666',
            }}
          >
            {getInitials(comment.name)}
          </div>
        </div>
        <div className="content">
          <div>
            {!isReply && (
              <h6>
                <a href="#" className="link">
                  {comment.name}
                </a>
              </h6>
            )}
            {isReply && (
              <div className="d-flex gap-12 align-items-center">
                <h6>
                  <a href="#" className="link">
                    {comment.name}
                  </a>
                </h6>
                <div className="box-check">
                  <svg
                    width={10}
                    height={8}
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.39644 7.84288L0.146441 4.35628C-0.0488135 4.14681 -0.0488135 3.80718 0.146441 3.59769L0.853531 2.8391C1.04879 2.62961 1.36539 2.62961 1.56064 2.8391L3.75 5.18782L8.43936 0.157101C8.63461 -0.0523671 8.95121 -0.0523671 9.14647 0.157101L9.85356 0.915689C10.0488 1.12516 10.0488 1.46479 9.85356 1.67428L4.10355 7.8429C3.90828 8.05237 3.5917 8.05237 3.39644 7.84288Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            )}
            <div className="day text-caption-1">{formatDate(comment.createdAt)}</div>
          </div>
          <p>{comment.comment}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="reply-comment">
        <h4 className="reply-comment-heading">Loading comments...</h4>
      </div>
    );
  }

  const totalComments = comments.reduce((sum, comment) => {
    return sum + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="reply-comment">
      <h4 className="reply-comment-heading">
        {totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}
      </h4>
      <div className="reply-comment-wrap">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <React.Fragment key={comment._id || comment.id}>
              {renderComment(comment, false)}
              {comment.replies && comment.replies.length > 0 && (
                comment.replies.map((reply) => renderComment(reply, true))
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}
