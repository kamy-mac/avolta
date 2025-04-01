package com.avolta.config;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
public void addResourceHandlers(@SuppressWarnings("null") ResourceHandlerRegistry registry) {

    File directory = new File(uploadDir);
    String absolutePath = directory.getAbsolutePath();
    System.out.println("Adding resource handler for uploads: " + absolutePath);
    registry.addResourceHandler("/api/uploads/**")
            .addResourceLocations("file:" + absolutePath + "/");
}
}