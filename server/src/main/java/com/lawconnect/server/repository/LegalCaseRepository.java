package com.lawconnect.server.repository;

import com.lawconnect.server.model.CaseStatus;
import com.lawconnect.server.model.LegalCase;
import com.lawconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LegalCaseRepository extends JpaRepository<LegalCase, String> {
    List<LegalCase> findByAdvocate(User advocate);
    List<LegalCase> findByClient(User client);
    List<LegalCase> findByAdvocateAndStatus(User advocate, com.lawconnect.server.model.CaseStatus status);
    long countByAdvocate(User advocate);
    long countByAdvocateAndStatus(User advocate, CaseStatus status);
    long countDistinctClientByAdvocateAndStatus(User advocate, CaseStatus status);
}
