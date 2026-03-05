package com.lawconnect.server.repository;

import com.lawconnect.server.model.AdvocateProfile;
import com.lawconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdvocateProfileRepository extends JpaRepository<AdvocateProfile, Long> {
    Optional<AdvocateProfile> findByUser(User user);
}
