package com.library.dto.search;

import com.library.dto.book.BookDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class SearchDto {

    @Getter
    @NoArgsConstructor
    public static class SearchRequest {
        private String keyword;
        private String category;
        private String author;
        private Integer page;
        private Integer size;

        @Builder
        public SearchRequest(String keyword, String category, String author, Integer page, Integer size) {
            this.keyword = keyword;
            this.category = category;
            this.author = author;
            this.page = page != null ? page : 0;
            this.size = size != null ? size : 10;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class SearchResponse {
        private List<BookDto.SimpleResponse> books;
        private long totalElements;
        private int totalPages;
        private boolean hasNext;

        @Builder
        public SearchResponse(List<BookDto.SimpleResponse> books, long totalElements, int totalPages, boolean hasNext) {
            this.books = books;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.hasNext = hasNext;
        }
    }
} 