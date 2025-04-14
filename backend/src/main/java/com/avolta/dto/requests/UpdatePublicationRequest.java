package com.avolta.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePublicationRequest {
    private String title;
    private String content;
    private String imageUrl;
    private List<PublicationImageRequest> images;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private String category;
}