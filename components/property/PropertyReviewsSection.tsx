"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquare, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/hooks/use-me";
import { useMyRentals } from "@/hooks/use-my-rentals";
import { extractApiErrorMessage } from "@/lib/api-error";
import { api, unwrapApiResponse } from "@/lib/axios";
import { formatDate, initialsOf } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IApiResponse } from "@/types/api";

export interface PropertyReview {
  id: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  tenant?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

interface PropertyReviewsSectionProps {
  propertyId: string;
  initialReviews: PropertyReview[];
}

function StarRatingPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled || !onChange}
            onClick={() => onChange?.(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className={cn(
              "transition-transform",
              onChange && !disabled
                ? "cursor-pointer hover:scale-110"
                : "cursor-default",
            )}
          >
            <Star
              className={cn(
                "h-4 w-4",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

export function PropertyReviewsSection({
  propertyId,
  initialReviews,
}: PropertyReviewsSectionProps) {
  const queryClient = useQueryClient();
  const { data: user } = useMe();
  const isTenant = user?.role === "TENANT";

  const { data: myRentals = [] } = useMyRentals();

  const { data: reviews = initialReviews } = useQuery<PropertyReview[]>({
    queryKey: ["property-reviews", propertyId],
    queryFn: () =>
      unwrapApiResponse(
        api.get<IApiResponse<PropertyReview[]>>(
          `/reviews/properties/${propertyId}`,
        ),
        "Failed to load reviews",
      ),
    initialData: initialReviews,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [busyReviewId, setBusyReviewId] = useState<string | null>(null);

  const hasCompletedStay = useMemo(() => {
    if (!isTenant) return false;
    return myRentals.some(
      (rental) =>
        rental.propertyId === propertyId && rental.status === "COMPLETED",
    );
  }, [isTenant, myRentals, propertyId]);

  const hasAlreadyReviewed = useMemo(() => {
    if (!user) return false;
    return reviews.some((r) => r.tenantId === user.id);
  }, [reviews, user]);

  const canWriteReview = isTenant && hasCompletedStay && !hasAlreadyReviewed;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const refreshReviews = () => {
    queryClient.invalidateQueries({
      queryKey: ["property-reviews", propertyId],
    });
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a brief review comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      await unwrapApiResponse(
        api.post<IApiResponse<PropertyReview>>("/reviews", {
          propertyId,
          rating,
          comment: comment.trim(),
        }),
        "Could not submit review",
      );
      toast.success("Thank you! Your review has been posted.");
      setComment("");
      setRating(5);
      refreshReviews();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Could not submit review."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (!editComment.trim()) {
      toast.error("Review comment cannot be empty.");
      return;
    }

    setBusyReviewId(reviewId);
    try {
      await unwrapApiResponse(
        api.patch<IApiResponse<PropertyReview>>(`/reviews/${reviewId}`, {
          rating: editRating,
          comment: editComment.trim(),
        }),
        "Could not update review",
      );
      toast.success("Review updated");
      setEditingId(null);
      refreshReviews();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Could not update review."));
    } finally {
      setBusyReviewId(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setBusyReviewId(reviewId);
    try {
      await unwrapApiResponse(
        api.delete<IApiResponse<unknown>>(`/reviews/${reviewId}`),
        "Could not delete review",
      );
      toast.success("Review deleted");
      refreshReviews();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Could not delete review."));
    } finally {
      setBusyReviewId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Tenant Reviews
          </h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {reviews.length}
          </span>
        </div>
        {averageRating ? (
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Star
              className="h-4 w-4 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span>{averageRating}</span>
            <span className="text-xs font-normal text-muted-foreground">
              / 5.0
            </span>
          </div>
        ) : null}
      </div>

      {/* Verified-only Write Review Form */}
      {canWriteReview ? (
        <form
          onSubmit={handleCreateReview}
          className="space-y-3 rounded-2xl border border-border/60 bg-muted/25 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              Write a Review
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Rating:</span>
              <StarRatingPicker value={rating} onChange={setRating} />
            </div>
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience staying at this property..."
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  Submitting...
                </>
              ) : (
                "Post Review"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <p className="rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
          Reviews are verified and can only be submitted by tenants who have
          completed a stay at this property.
        </p>
      )}

      {/* Existing Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquare
            className="mb-2 h-8 w-8 text-muted-foreground/50"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-foreground">No reviews yet</p>
          <p className="text-xs text-muted-foreground">
            Be the first verified tenant to share feedback after your stay.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isAuthor = user?.id === review.tenantId;
            const isEditing = editingId === review.id;
            const isBusy = busyReviewId === review.id;
            const authorName = review.tenant?.name || "Verified Tenant";

            return (
              <div
                key={review.id}
                className="space-y-2 rounded-xl border border-border/50 bg-background/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400">
                      {review.tenant?.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.tenant.avatar}
                          alt={authorName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initialsOf(authorName)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {authorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StarRatingPicker value={review.rating} />
                    {isAuthor && !isEditing ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(review.id);
                            setEditRating(review.rating);
                            setEditComment(review.comment);
                          }}
                          disabled={isBusy}
                          aria-label="Edit review"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteReview(review.id)}
                          disabled={isBusy}
                          aria-label="Delete review"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Update rating:
                      </span>
                      <StarRatingPicker
                        value={editRating}
                        onChange={setEditRating}
                        disabled={isBusy}
                      />
                    </div>
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                      disabled={isBusy}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        disabled={isBusy}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => void handleUpdateReview(review.id)}
                        disabled={isBusy}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {isBusy ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
