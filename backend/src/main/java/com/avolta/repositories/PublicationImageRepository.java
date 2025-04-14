package com.avolta.repositories;

import com.avolta.models.PublicationImage;
import com.avolta.models.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationImageRepository extends JpaRepository<PublicationImage, String> {
    List<PublicationImage> findByPublicationOrderByDisplayOrderAsc(Publication publication);
    void deleteByPublicationId(String publicationId);
}