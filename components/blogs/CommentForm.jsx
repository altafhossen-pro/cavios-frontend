"use client";

import { useState } from "react";
import { createComment } from "@/features/blog/api/blogCommentApi";

export default function CommentForm({ blogId, onCommentAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.comment.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    if (!blogId) {
      setMessage({ type: 'error', text: 'Blog ID is missing' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await createComment({
        blogId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        comment: formData.comment.trim(),
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Comment submitted successfully! It will be visible after approval.',
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          comment: "",
        });
        // Notify parent to refresh comments
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to submit comment. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setMessage({
        type: 'error',
        text: 'Failed to submit comment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-comment">
      <h4 className="leave-comment-heading">Leave A Comment</h4>
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message.text}
        </div>
      )}
      <form className="form-leave-comment" onSubmit={handleSubmit}>
        <div className="wrap">
          <div className="cols">
            <fieldset className="">
              <input
                className=""
                type="text"
                placeholder="Your Name*"
                name="name"
                value={formData.name}
                onChange={handleChange}
                tabIndex={2}
                required
                disabled={loading}
              />
            </fieldset>
            <fieldset className="">
              <input
                className=""
                type="email"
                placeholder="Your Email*"
                name="email"
                value={formData.email}
                onChange={handleChange}
                tabIndex={2}
                required
                disabled={loading}
              />
            </fieldset>
          </div>
          <fieldset className="">
            <textarea
              className=""
              rows={4}
              placeholder="Your Message*"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              tabIndex={2}
              required
              disabled={loading}
            />
          </fieldset>
        </div>
        <div className="button-submit">
          <button className="" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
