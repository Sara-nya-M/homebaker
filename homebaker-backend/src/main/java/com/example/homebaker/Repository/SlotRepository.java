package com.example.homebaker.Repository;

import com.example.homebaker.Modular.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    Optional<Slot> findByBakerIdAndDate(Long bakerId, String date);
}
