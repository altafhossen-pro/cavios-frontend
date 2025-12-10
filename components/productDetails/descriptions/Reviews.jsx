"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import ReviewSorting from "./ReviewSorting";

export default function Reviews({ product }) {
  // Static fake reviews data - Commented out for now, ready for dynamic data
  // When API is ready, replace this with actual API call
  const staticReviews = [
    // {
    //   id: 1,
    //   userName: "John Doe",
    //   title: "Superb quality apparel that exceeds expectations",
    //   comment: "Great theme - we were looking for a theme with lots of built in features and flexibility and this was perfect. We expected to need to employ a developer to add a few finishing touches. But we actually managed to do everything ourselves. We did have one small query and the support given was swift and helpful.",
    //   rating: 5,
    //   date: "1 days ago",
    //   userImage: "/images/avatar/user-default.jpg"
    // },
    // {
    //   id: 2,
    //   userName: "Jane Smith",
    //   title: "Excellent product quality",
    //   comment: "Very satisfied with the purchase. The quality is outstanding and delivery was fast.",
    //   rating: 5,
    //   date: "3 days ago",
    //   userImage: "/images/avatar/user-default.jpg"
    // },
    // {
    //   id: 3,
    //   userName: "Mike Johnson",
    //   title: "Good value for money",
    //   comment: "The product met my expectations. Good quality and reasonable price.",
    //   rating: 4,
    //   date: "5 days ago",
    //   userImage: "/images/avatar/user-default.jpg"
    // }
  ];

  const [reviews] = useState(staticReviews);
  
  // Calculate average rating and rating distribution
  const ratingStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    
    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = (sum / total).toFixed(1);
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    
    return { average, total, distribution };
  }, [reviews]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`icon icon-star ${i < rating ? "" : "empty"}`}
        style={i < rating ? {} : { opacity: 0.3 }}
      />
    ));
  };

  const getRatingPercentage = (count) => {
    if (ratingStats.total === 0) return 0;
    return ((count / ratingStats.total) * 100).toFixed(2);
  };

  return (
    <>
      <div className="tab-reviews-heading">
        {" "}
        <div className="top">
          <div className="text-center">
            <div className="number title-display">
              {ratingStats.average || "0.0"}
            </div>
            <div className="list-star">
              {renderStars(Math.round(parseFloat(ratingStats.average) || 0))}
            </div>
            <p>({ratingStats.total} {ratingStats.total === 1 ? "Rating" : "Ratings"})</p>
          </div>
          <div className="rating-score">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingStats.distribution[star] || 0;
              const percentage = getRatingPercentage(count);
              return (
                <div key={star} className="item">
                  <div className="number-1 text-caption-1">{star}</div>
                  <i className="icon icon-star" />
                  <div className="line-bg">
                    <div style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="number-2 text-caption-1">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="btn-style-4 text-btn-uppercase letter-1 btn-comment-review btn-cancel-review">
            Cancel Review
          </div>
          <div className="btn-style-4 text-btn-uppercase letter-1 btn-comment-review btn-write-review">
            Write a review
          </div>
        </div>
      </div>
      <div className="reply-comment style-1 cancel-review-wrap">
        <div className="d-flex mb_24 gap-20 align-items-center justify-content-between flex-wrap">
          <h4 className="">
            {reviews.length} {reviews.length === 1 ? "Comment" : "Comments"}
          </h4>
          {reviews.length > 0 && (
            <div className="d-flex align-items-center gap-12">
              <div className="text-caption-1">Sort by:</div>
              <ReviewSorting />
            </div>
          )}
        </div>
        {reviews.length === 0 ? (
          <div className="text-center" style={{ padding: "40px 20px" }}>
            <p className="text-secondary" style={{ fontSize: "16px" }}>
              No reviews found for this product.
            </p>
            <p className="text-secondary" style={{ fontSize: "14px", marginTop: "10px" }}>
              Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="reply-comment-wrap">
            {reviews.map((review) => (
              <div key={review.id} className="reply-comment-item">
                <div className="user">
                  <div className="image">
                    <Image
                      alt={review.userName}
                      src={review.userImage || "/images/avatar/user-default.jpg"}
                      width={120}
                      height={120}
                      onError={(e) => {
                        e.target.src = "/images/avatar/user-default.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <h6>
                      <a href="#" className="link">
                        {review.title}
                      </a>
                    </h6>
                    <div className="day text-secondary-2 text-caption-1">
                      {review.date} &nbsp;&nbsp;&nbsp;-
                    </div>
                    <div className="list-star mt-2">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-secondary">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <form
        className="form-write-review write-review-wrap"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="heading">
          <h4>Write a review:</h4>
          <div className="list-rating-check">
            <input type="radio" id="star5" name="rate" defaultValue={5} />
            <label htmlFor="star5" title="text" />
            <input type="radio" id="star4" name="rate" defaultValue={4} />
            <label htmlFor="star4" title="text" />
            <input type="radio" id="star3" name="rate" defaultValue={3} />
            <label htmlFor="star3" title="text" />
            <input type="radio" id="star2" name="rate" defaultValue={2} />
            <label htmlFor="star2" title="text" />
            <input type="radio" id="star1" name="rate" defaultValue={1} />
            <label htmlFor="star1" title="text" />
          </div>
        </div>
        <div className="mb_32">
          <div className="mb_8">Review Title</div>
          <fieldset className="mb_20">
            <input
              className=""
              type="text"
              placeholder="Give your review a title"
              name="text"
              tabIndex={2}
              defaultValue=""
              aria-required="true"
              required
            />
          </fieldset>
          <div className="mb_8">Review</div>
          <fieldset className="d-flex mb_20">
            <textarea
              className=""
              rows={4}
              placeholder="Write your comment here"
              tabIndex={2}
              aria-required="true"
              required
              defaultValue={""}
            />
          </fieldset>
          <div className="cols mb_20">
            <fieldset className="">
              <input
                className=""
                type="text"
                placeholder="You Name (Public)"
                name="text"
                tabIndex={2}
                defaultValue=""
                aria-required="true"
                required
              />
            </fieldset>
            <fieldset className="">
              <input
                className=""
                type="email"
                placeholder="Your email (private)"
                name="email"
                tabIndex={2}
                defaultValue=""
                aria-required="true"
                required
              />
            </fieldset>
          </div>
          <div className="d-flex align-items-center check-save">
            <input
              type="checkbox"
              name="availability"
              className="tf-check"
              id="check1"
            />
            <label className="text-secondary text-caption-1" htmlFor="check1">
              Save my name, email, and website in this browser for the next time
              I comment.
            </label>
          </div>
        </div>
        <div className="button-submit">
          <button className="text-btn-uppercase" type="submit">
            Submit Reviews
          </button>
        </div>
      </form>
    </>
  );
}
