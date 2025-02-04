import React, { useState, useEffect } from 'react';
import { Star, AlertCircle, ThumbsUp, Shield } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Review } from '../../types';

interface DoctorReviewsProps {
  doctorId: string;
  doctorName: string;
}

export default function DoctorReviews({ doctorId, doctorName }: DoctorReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadReviews();
    checkUserReview();
  }, [doctorId]);

  const loadReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews')
      );
      const querySnapshot = await getDocs(q);
      // Filter and sort in memory since indexes might not be available
      const reviewsData = querySnapshot.docs
        .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
        .filter(review => review.doctorId === doctorId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as Review[];
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Errore nel caricamento delle recensioni');
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'reviews'));
      const querySnapshot = await getDocs(q);
      const hasReview = querySnapshot.docs.some(doc => {
        const data = doc.data();
        return data.doctorId === doctorId && data.patientId === user.uid;
      });
      setHasReviewed(hasReview);
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const reviewData = {
        doctorId,
        patientId: user.uid,
        patientName: `${user.firstName} ${user.lastName}`,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString(),
        verified: true
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      setHasReviewed(true);
      setNewReview({ rating: 5, comment: '' });
      loadReviews();

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Recensione pubblicata con successo';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Errore durante la pubblicazione della recensione');
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Recensioni per Dr. {doctorName}
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {renderStars(Math.round(Number(getAverageRating())))}
          </div>
          <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
            {getAverageRating()}
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            ({reviews.length} recensioni)
          </span>
        </div>
      </div>

      {user && !hasReviewed && (
        <form onSubmit={handleSubmitReview} className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Lascia una recensione
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valutazione
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className="p-1"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= newReview.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Commento
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-500 focus:ring-rose-500"
              placeholder="Condividi la tua esperienza..."
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Pubblica Recensione
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {review.patientName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('it-IT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {review.verified && (
                <div className="flex items-center text-green-600">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-xs">Verificata</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-6">
            <ThumbsUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Nessuna recensione
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sii il primo a recensire questo dottore
            </p>
          </div>
        )}
      </div>
    </div>
  );
}