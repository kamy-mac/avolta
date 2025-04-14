package com.avolta.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicationImageRequest {
    private String imageUrl;
    private int displayOrder;
    private String caption;
}