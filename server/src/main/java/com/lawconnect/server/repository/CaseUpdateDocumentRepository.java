package com.lawconnect.server.repository;

import com.lawconnect.server.model.CaseUpdateDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseUpdateDocumentRepository extends JpaRepository<CaseUpdateDocument, String> {
}
