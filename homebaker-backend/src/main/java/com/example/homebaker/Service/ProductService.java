package com.example.homebaker.Service;

import com.example.homebaker.Modular.Product;
import com.example.homebaker.Modular.User;
import com.example.homebaker.Repository.ProductRepository;
import com.example.homebaker.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product createProduct(Product product, Long bakerId) {
        User baker = userRepository.findById(bakerId)
                .orElseThrow(() -> new RuntimeException("Baker not found!"));
        if (!"BAKER".equals(baker.getRole())) {
            throw new RuntimeException("Only bakers can add products!");
        }
        product.setBaker(baker);
        return productRepository.save(product);
    }

    public List<Product> getProductsByBaker(Long bakerId) {
        return productRepository.findByBakerId(bakerId);
    }

    public List<Product> filterByDiet(String diet) {
        if ("eggless".equalsIgnoreCase(diet)) {
            return productRepository.findByIsEggless(true);
        } else if ("glutenfree".equalsIgnoreCase(diet)) {
            return productRepository.findByIsGlutenFree(true);
        } else if ("vegan".equalsIgnoreCase(diet)) {
            return productRepository.findByIsVegan(true);
        }
        return productRepository.findAll();
    }

    public Product updateProduct(Long id, Product details) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found!"));

        product.setName(details.getName());
        product.setCategory(details.getCategory());
        product.setPrice(details.getPrice());
        product.setDescription(details.getDescription());
        product.setImageUrl(details.getImageUrl());
        product.setIsEggless(details.getIsEggless());
        product.setIsGlutenFree(details.getIsGlutenFree());
        product.setIsVegan(details.getIsVegan());
        product.setIsNutFree(details.getIsNutFree());
        product.setOccasion(details.getOccasion());
        product.setDailySlots(details.getDailySlots());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found!"));
        productRepository.delete(product);
    }
}
