package com.lawconnect.server.service;

import com.lawconnect.server.model.CaseUpdate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CaseUpdateService {
    CaseUpdate createUpdate(String caseId, String advocateUsername, String title, String description, List<MultipartFile> documents);
    CaseUpdate editUpdate(String updateId, String advocateUsername, String title, String description, List<MultipartFile> documents);
    void deleteUpdate(String updateId, String advocateUsername);
    List<CaseUpdate> getUpdatesByCase(String caseId);
}
