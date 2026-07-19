package com.example.homebaker.Modular;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "baker_id", nullable = false)
    private User baker;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String cakeShape;
    private String cakeSize;
    private String cakeFlavor;
    private String cakeTopping;
    private String cakeMessage;

    @Column(nullable = false)
    private Double finalPrice;

    @Column(nullable = false)
    private Integer quantity;

    private String deliveryTimeSlot;
    private String deliveryDate; // YYYY-MM-DD format
    private String deliveryType; // DELIVERY, PICKUP
    private String status;       // PENDING, CONFIRMED, BAKING, READY, DELIVERED
    private String orderDate;    // YYYY-MM-DD HH:MM:SS format

    // Constructors
    public Order() {
    }

    public Order(Long id, User customer, User baker, Product product, String cakeShape, String cakeSize, String cakeFlavor, String cakeTopping, String cakeMessage, Double finalPrice, Integer quantity, String deliveryTimeSlot, String deliveryDate, String deliveryType, String status, String orderDate) {
        this.id = id;
        this.customer = customer;
        this.baker = baker;
        this.product = product;
        this.cakeShape = cakeShape;
        this.cakeSize = cakeSize;
        this.cakeFlavor = cakeFlavor;
        this.cakeTopping = cakeTopping;
        this.cakeMessage = cakeMessage;
        this.finalPrice = finalPrice;
        this.quantity = quantity;
        this.deliveryTimeSlot = deliveryTimeSlot;
        this.deliveryDate = deliveryDate;
        this.deliveryType = deliveryType;
        this.status = status;
        this.orderDate = orderDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public User getBaker() {
        return baker;
    }

    public void setBaker(User baker) {
        this.baker = baker;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getCakeShape() {
        return cakeShape;
    }

    public void setCakeShape(String cakeShape) {
        this.cakeShape = cakeShape;
    }

    public String getCakeSize() {
        return cakeSize;
    }

    public void setCakeSize(String cakeSize) {
        this.cakeSize = cakeSize;
    }

    public String getCakeFlavor() {
        return cakeFlavor;
    }

    public void setCakeFlavor(String cakeFlavor) {
        this.cakeFlavor = cakeFlavor;
    }

    public String getCakeTopping() {
        return cakeTopping;
    }

    public void setCakeTopping(String cakeTopping) {
        this.cakeTopping = cakeTopping;
    }

    public String getCakeMessage() {
        return cakeMessage;
    }

    public void setCakeMessage(String cakeMessage) {
        this.cakeMessage = cakeMessage;
    }

    public Double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDeliveryTimeSlot() {
        return deliveryTimeSlot;
    }

    public void setDeliveryTimeSlot(String deliveryTimeSlot) {
        this.deliveryTimeSlot = deliveryTimeSlot;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getDeliveryType() {
        return deliveryType;
    }

    public void setDeliveryType(String deliveryType) {
        this.deliveryType = deliveryType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }
}
