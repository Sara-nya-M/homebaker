package com.example.homebaker.Controller;

import com.example.homebaker.Modular.Order;
import com.example.homebaker.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        try {
            Order order = orderService.createOrder(
                    request.getCustomerId(),
                    request.getBakerId(),
                    request.getProductId(),
                    request.getCakeShape(),
                    request.getCakeSize(),
                    request.getCakeFlavor(),
                    request.getCakeTopping(),
                    request.getCakeMessage(),
                    request.getFinalPrice(),
                    request.getQuantity(),
                    request.getDeliveryTimeSlot(),
                    request.getDeliveryDate(),
                    request.getDeliveryType()
            );
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(id));
    }

    @GetMapping("/baker/{id}")
    public ResponseEntity<List<Order>> getOrdersByBaker(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrdersByBaker(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Order updated = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // DTO class for placing orders
    public static class OrderRequest {
        private Long customerId;
        private Long bakerId;
        private Long productId;
        private String cakeShape;
        private String cakeSize;
        private String cakeFlavor;
        private String cakeTopping;
        private String cakeMessage;
        private Double finalPrice;
        private Integer quantity;
        private String deliveryTimeSlot;
        private String deliveryDate;
        private String deliveryType;

        // Getters and Setters
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }

        public Long getBakerId() { return bakerId; }
        public void setBakerId(Long bakerId) { this.bakerId = bakerId; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getCakeShape() { return cakeShape; }
        public void setCakeShape(String cakeShape) { this.cakeShape = cakeShape; }

        public String getCakeSize() { return cakeSize; }
        public void setCakeSize(String cakeSize) { this.cakeSize = cakeSize; }

        public String getCakeFlavor() { return cakeFlavor; }
        public void setCakeFlavor(String cakeFlavor) { this.cakeFlavor = cakeFlavor; }

        public String getCakeTopping() { return cakeTopping; }
        public void setCakeTopping(String cakeTopping) { this.cakeTopping = cakeTopping; }

        public String getCakeMessage() { return cakeMessage; }
        public void setCakeMessage(String cakeMessage) { this.cakeMessage = cakeMessage; }

        public Double getFinalPrice() { return finalPrice; }
        public void setFinalPrice(Double finalPrice) { this.finalPrice = finalPrice; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getDeliveryTimeSlot() { return deliveryTimeSlot; }
        public void setDeliveryTimeSlot(String deliveryTimeSlot) { this.deliveryTimeSlot = deliveryTimeSlot; }

        public String getDeliveryDate() { return deliveryDate; }
        public void setDeliveryDate(String deliveryDate) { this.deliveryDate = deliveryDate; }

        public String getDeliveryType() { return deliveryType; }
        public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }
    }
}
