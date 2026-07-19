package com.example.homebaker.Repository;

import com.example.homebaker.Modular.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByBakerId(Long bakerId);
    List<Product> findByIsEggless(boolean isEggless);
    List<Product> findByIsGlutenFree(boolean isGlutenFree);
    List<Product> findByIsVegan(boolean isVegan);
}
