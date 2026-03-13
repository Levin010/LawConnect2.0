package com.lawconnect.server.repository;

import com.lawconnect.server.model.CaseUpdate;
import com.lawconnect.server.model.LegalCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseUpdateRepository extends JpaRepository<CaseUpdate, String> {
    List<CaseUpdate> findByLegalCase(LegalCase legalCase);
}