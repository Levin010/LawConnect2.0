package com.lawconnect.server.repository;

import com.lawconnect.server.model.RepresentationRequest;
import com.lawconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepresentationRequestRepository extends JpaRepository<RepresentationRequest, Long> {
    List<RepresentationRequest> findByAdvocate(User advocate);
    List<RepresentationRequest> findByClient(User client);
}
