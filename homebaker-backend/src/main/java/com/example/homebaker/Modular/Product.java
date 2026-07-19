package com.example.homebaker.Modular;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "baker_id", nullable = false)
    private User baker;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // CAKE, COOKIE, BROWNIE, SNACK

    @Column(nullable = false)
    private Double price;

    @Column(length = 1000)
    private String description;

    @Column(length = 2048)
    private String imageUrl;

    private boolean isEggless;
    private boolean isGlutenFree;
    private boolean isVegan;
    private boolean isNutFree;

    private String occasion;
    private Integer dailySlots;

    // Constructors
    public Product() {
    }

    public Product(Long id, User baker, String name, String category, Double price, String description, String imageUrl, boolean isEggless, boolean isGlutenFree, boolean isVegan, boolean isNutFree, String occasion, Integer dailySlots) {
        this.id = id;
        this.baker = baker;
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.isEggless = isEggless;
        this.isGlutenFree = isGlutenFree;
        this.isVegan = isVegan;
        this.isNutFree = isNutFree;
        this.occasion = occasion;
        this.dailySlots = dailySlots;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getBaker() {
        return baker;
    }

    public void setBaker(User baker) {
        this.baker = baker;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean getIsEggless() {
        return isEggless;
    }

    public void setIsEggless(boolean eggless) {
        isEggless = eggless;
    }

    public boolean getIsGlutenFree() {
        return isGlutenFree;
    }

    public void setIsGlutenFree(boolean glutenFree) {
        isGlutenFree = glutenFree;
    }

    public boolean getIsVegan() {
        return isVegan;
    }

    public void setIsVegan(boolean vegan) {
        isVegan = vegan;
    }

    public boolean getIsNutFree() {
        return isNutFree;
    }

    public void setIsNutFree(boolean nutFree) {
        isNutFree = nutFree;
    }

    public String getOccasion() {
        return occasion;
    }

    public void setOccasion(String occasion) {
        this.occasion = occasion;
    }

    public Integer getDailySlots() {
        return dailySlots;
    }

    public void setDailySlots(Integer dailySlots) {
        this.dailySlots = dailySlots;
    }
}
