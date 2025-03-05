export interface BookReservation {
  bookId: string;
  title: string;
  author: string;
  category: string;
  copiesAvailable: number;
  currentReservations: number;
  userReservationOrder: number | null;
  publishedDate: string;
  isbn: string;
}

export interface ReservationRequest {
  userId: string;
  bookId: string;
  reservationDate: string;
}

export interface ReservationResponse {
  reservationId: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  reservationDate: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'RESERVED';
  createdAt: string;
} 