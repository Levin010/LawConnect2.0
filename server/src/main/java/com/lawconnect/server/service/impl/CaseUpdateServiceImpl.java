package com.lawconnect.server.service.impl;

import com.lawconnect.server.model.CaseUpdate;
import com.lawconnect.server.model.CaseUpdateDocument;
import com.lawconnect.server.model.LegalCase;
import com.lawconnect.server.repository.CaseUpdateDocumentRepository;
import com.lawconnect.server.repository.CaseUpdateRepository;
import com.lawconnect.server.repository.LegalCaseRepository;
import com.lawconnect.server.service.CaseUpdateService;
import com.lawconnect.server.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CaseUpdateServiceImpl implements CaseUpdateService {

    @Autowired
    private CaseUpdateRepository caseUpdateRepository;

    @Autowired
    private CaseUpdateDocumentRepository caseUpdateDocumentRepository;

    @Autowired
    private LegalCaseRepository legalCaseRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public CaseUpdate createUpdate(String caseId, String advocateUsername, String title, String description, List<MultipartFile> documents) {
        LegalCase legalCase = legalCaseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!legalCase.getAdvocate().getUsername().equals(advocateUsername)) {
            throw new RuntimeException("Unauthorized to add update to this case");
        }

        CaseUpdate update = new CaseUpdate();
        update.setLegalCase(legalCase);
        update.setTitle(title);
        update.setDescription(description);

        CaseUpdate savedUpdate = caseUpdateRepository.save(update);

        if (documents != null && !documents.isEmpty()) {
            savedUpdate.setDocuments(uploadDocuments(documents, savedUpdate));
        }

        return savedUpdate;
    }

    @Override
    public CaseUpdate editUpdate(String updateId, String advocateUsername, String title, String description, List<MultipartFile> documents) {
        CaseUpdate update = caseUpdateRepository.findById(updateId)
                .orElseThrow(() -> new RuntimeException("Update not found"));

        if (!update.getLegalCase().getAdvocate().getUsername().equals(advocateUsername)) {
            throw new RuntimeException("Unauthorized to edit this update");
        }

        update.setTitle(title);
        update.setDescription(description);

        if (documents != null && !documents.isEmpty()) {
            caseUpdateDocumentRepository.deleteAll(update.getDocuments());
            update.setDocuments(uploadDocuments(documents, update));
        }

        return caseUpdateRepository.save(update);
    }

    @Override
    public void deleteUpdate(String updateId, String advocateUsername) {
        CaseUpdate update = caseUpdateRepository.findById(updateId)
                .orElseThrow(() -> new RuntimeException("Update not found"));

        if (!update.getLegalCase().getAdvocate().getUsername().equals(advocateUsername)) {
            throw new RuntimeException("Unauthorized to delete this update");
        }

        caseUpdateRepository.delete(update);
    }

    @Override
    public List<CaseUpdate> getUpdatesByCase(String caseId) {
        LegalCase legalCase = legalCaseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        return caseUpdateRepository.findByLegalCase(legalCase);
    }

    private List<CaseUpdateDocument> uploadDocuments(List<MultipartFile> files, CaseUpdate update) {
        List<CaseUpdateDocument> documents = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String url = cloudinaryService.uploadFile(file, "case-updates");
                CaseUpdateDocument doc = new CaseUpdateDocument();
                doc.setCaseUpdate(update);
                doc.setDocumentUrl(url);
                doc.setDocumentName(file.getOriginalFilename());
                documents.add(doc);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload document: " + file.getOriginalFilename());
            }
        }
        caseUpdateDocumentRepository.saveAll(documents);
        return documents;
    }
}