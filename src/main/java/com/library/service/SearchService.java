package com.library.service;

import com.library.dto.book.BookDto;
import com.library.dto.search.SearchDto;
import com.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {

    private final BookRepository bookRepository;

    public SearchDto.SearchResponse searchBooks(SearchDto.SearchRequest request) {
        Page<com.library.domain.book.Book> searchResult = bookRepository.searchBooks(
                request.getKeyword(),
                request.getCategory(),
                request.getAuthor(),
                PageRequest.of(request.getPage(), request.getSize())
        );

        List<BookDto.SimpleResponse> books = searchResult.getContent().stream()
                .map(BookDto.SimpleResponse::from)
                .collect(Collectors.toList());

        return SearchDto.SearchResponse.builder()
                .books(books)
                .totalElements(searchResult.getTotalElements())
                .totalPages(searchResult.getTotalPages())
                .hasNext(searchResult.hasNext())
                .build();
    }
} 