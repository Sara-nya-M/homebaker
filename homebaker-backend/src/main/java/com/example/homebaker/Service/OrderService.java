package com.example.homebaker.Service;

import com.example.homebaker.Modular.Order;
import com.example.homebaker.Modular.Product;
import com.example.homebaker.Modular.Slot;
import com.example.homebaker.Modular.User;
import com.example.homebaker.Repository.OrderRepository;
import com.example.homebaker.Repository.ProductRepository;
import com.example.homebaker.Repository.SlotRepository;
import com.example.homebaker.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Transactional
    public Order createOrder(
            Long customerId,
            Long bakerId,
            Long productId,
            String cakeShape,
            String cakeSize,
            String cakeFlavor,
            String cakeTopping,
            String cakeMessage,
            Double finalPrice,
            Integer quantity,
            String deliveryTimeSlot,
            String deliveryDate,
            String deliveryType
    ) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found!"));
        User baker = userRepository.findById(bakerId)
                .orElseThrow(() -> new RuntimeException("Baker not found!"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found!"));

        // Check Slot-based capacity
        Optional<Slot> slotOpt = slotRepository.findByBakerIdAndDate(bakerId, deliveryDate);
        if (slotOpt.isPresent()) {
            Slot slot = slotOpt.get();
            if (slot.getFilledSlots() >= slot.getTotalSlots()) {
                throw new RuntimeException("Slots are fully booked for this date! Please choose another delivery date.");
            }
            slot.setFilledSlots(slot.getFilledSlots() + 1);
            slotRepository.save(slot);
        } else {
            Slot slot = new Slot();
            slot.setBaker(baker);
            slot.setDate(deliveryDate);
            slot.setTotalSlots(product.getDailySlots() != null ? product.getDailySlots() : 5);
            slot.setFilledSlots(1);
            slotRepository.save(slot);
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setBaker(baker);
        order.setProduct(product);
        order.setCakeShape(cakeShape);
        order.setCakeSize(cakeSize);
        order.setCakeFlavor(cakeFlavor);
        order.setCakeTopping(cakeTopping);
        order.setCakeMessage(cakeMessage);
        order.setFinalPrice(finalPrice);
        order.setQuantity(quantity);
        order.setDeliveryTimeSlot(deliveryTimeSlot);
        order.setDeliveryDate(deliveryDate);
        order.setDeliveryType(deliveryType);
        order.setStatus("PENDING");
        
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        order.setOrderDate(LocalDateTime.now().format(dtf));

        return orderRepository.save(order);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getOrdersByBaker(Long bakerId) {
        return orderRepository.findByBakerId(bakerId);
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
        
        // Ensure valid status
        String upperStatus = status.toUpperCase();
        if (!List.of("PENDING", "CONFIRMED", "BAKING", "READY", "DELIVERED").contains(upperStatus)) {
            throw new RuntimeException("Invalid order status!");
        }

        order.setStatus(upperStatus);
        return orderRepository.save(order);
    }
}
