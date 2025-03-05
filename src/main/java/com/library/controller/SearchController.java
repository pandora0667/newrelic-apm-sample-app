package com.library.controller;

import com.library.dto.search.SearchDto;
import com.library.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Tag(name = "Search", description = "도서 검색 API")
@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @Operation(
        summary = "도서 검색", 
        description = "키워드, 카테고리, 저자로 도서를 검색합니다. 한글 키워드를 사용할 경우 URL 인코딩이 필요합니다."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "검색 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content)
    })
    @GetMapping("/books")
    public ResponseEntity<SearchDto.SearchResponse> searchBooks(
            @Parameter(description = "검색 키워드 (제목 또는 저자). 한글일 경우 URL 인코딩 필요")
            @RequestParam(required = false) String keyword,
            
            @Parameter(description = "카테고리. 한글일 경우 URL 인코딩 필요")
            @RequestParam(required = false) String category,
            
            @Parameter(description = "저자. 한글일 경우 URL 인코딩 필요")
            @RequestParam(required = false) String author,
            
            @Parameter(description = "페이지 번호 (0부터 시작)")
            @RequestParam(required = false, defaultValue = "0") Integer page,
            
            @Parameter(description = "페이지 크기")
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        // URL 디코딩 처리
        String decodedKeyword = decodeParam(keyword);
        String decodedCategory = decodeParam(category);
        String decodedAuthor = decodeParam(author);
        
        SearchDto.SearchRequest request = SearchDto.SearchRequest.builder()
                .keyword(decodedKeyword)
                .category(decodedCategory)
                .author(decodedAuthor)
                .page(page)
                .size(size)
                .build();

        return ResponseEntity.ok(searchService.searchBooks(request));
    }

    /**
     * URL 인코딩된 파라미터를 디코딩합니다.
     */
    private String decodeParam(String param) {
        if (param == null) {
            return null;
        }
        try {
            return URLDecoder.decode(param, StandardCharsets.UTF_8.name());
        } catch (UnsupportedEncodingException e) {
            return param;
        }
    }
} 