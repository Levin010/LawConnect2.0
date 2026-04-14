package com.lawconnect.server.repository;

import com.lawconnect.server.model.AdvocateProfile;
import com.lawconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdvocateProfileRepository extends JpaRepository<AdvocateProfile, String> {
    Optional<AdvocateProfile> findByUser(User user);

    @Query("""
            select ap
            from AdvocateProfile ap
            join fetch ap.user u
            where (:search is null
                or lower(u.firstName) like :search
                or lower(u.lastName) like :search
                or lower(concat(u.firstName, ' ', u.lastName)) like :search
                or lower(ap.category) like :search
                or lower(ap.county) like :search)
              and (:category is null or lower(ap.category) = :category)
              and (:county is null or lower(ap.county) = :county)
            order by lower(u.firstName) asc, lower(u.lastName) asc
            """)
    List<AdvocateProfile> searchAdvocates(
            @Param("search") String search,
            @Param("category") String category,
            @Param("county") String county
    );
}
