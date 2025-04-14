package com.avolta.dto;

import com.avolta.models.PublicationImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicationImageDto {
    private String id;
    private String imageUrl;
    private int displayOrder;
    private String caption;

    public static PublicationImageDto fromEntity(PublicationImage image) {
        PublicationImageDto dto = new PublicationImageDto();
        dto.setId(image.getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setDisplayOrder(image.getDisplayOrder());
        dto.setCaption(image.getCaption());
        return dto;
    }
}