package com.avolta.config;

@Configuration
public class FileUploadConfig {
    
    @Value("${file.upload-dir:/opt/render/project/src/uploads/images}")
    private String uploadDir;
    
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }
}