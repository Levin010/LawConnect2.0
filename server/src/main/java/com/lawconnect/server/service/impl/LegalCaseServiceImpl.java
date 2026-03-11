package com.lawconnect.server.service.impl;

import com.lawconnect.server.dto.LegalCaseDto;
import com.lawconnect.server.model.CaseStatus;
import com.lawconnect.server.model.LegalCase;
import com.lawconnect.server.model.User;
import com.lawconnect.server.repository.LegalCaseRepository;
import com.lawconnect.server.repository.UserRepository;
import com.lawconnect.server.service.LegalCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LegalCaseServiceImpl implements LegalCaseService {

    @Autowired
    private LegalCaseRepository legalCaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public LegalCase createCase(String advocateUsername, LegalCaseDto dto) {
        User advocate = userRepository.findByUsername(advocateUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Advocate not found"));

        LegalCase legalCase = new LegalCase();
        legalCase.setAdvocate(advocate);
        legalCase.setCaseName(dto.getCaseName());
        legalCase.setCaseNumber(dto.getCaseNumber());
        legalCase.setClientRole(dto.getClientRole());
        legalCase.setCaseDescription(dto.getCaseDescription());

        if (dto.getClientUsername() != null && !dto.getClientUsername().isBlank()) {
            User client = userRepository.findByUsername(dto.getClientUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("Client not found"));
            legalCase.setClient(client);
        }

        return legalCaseRepository.save(legalCase);
    }

    @Override
    public LegalCase updateCase(String caseId, String advocateUsername, LegalCaseDto dto) {
        LegalCase legalCase = legalCaseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!legalCase.getAdvocate().getUsername().equals(advocateUsername)) {
            throw new RuntimeException("Unauthorized to update this case");
        }

        legalCase.setCaseName(dto.getCaseName());
        legalCase.setCaseNumber(dto.getCaseNumber());
        legalCase.setClientRole(dto.getClientRole());
        legalCase.setCaseDescription(dto.getCaseDescription());

        return legalCaseRepository.save(legalCase);
    }

    @Override
    public LegalCase closeCase(String caseId, String advocateUsername) {
        LegalCase legalCase = legalCaseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!legalCase.getAdvocate().getUsername().equals(advocateUsername)) {
            throw new RuntimeException("Unauthorized to close this case");
        }

        legalCase.setStatus(CaseStatus.CLOSED);
        return legalCaseRepository.save(legalCase);
    }

    @Override
    public List<LegalCase> getCasesByAdvocate(String advocateUsername) {
        User advocate = userRepository.findByUsername(advocateUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Advocate not found"));
        return legalCaseRepository.findByAdvocate(advocate);
    }

    @Override
    public List<LegalCase> getCasesByClient(String clientUsername) {
        User client = userRepository.findByUsername(clientUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Client not found"));
        return legalCaseRepository.findByClient(client);
    }

    @Override
    public LegalCase getCaseById(String caseId) {
        return legalCaseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
    }
}
