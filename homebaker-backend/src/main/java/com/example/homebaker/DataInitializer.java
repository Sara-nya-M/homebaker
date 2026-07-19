package com.example.homebaker;

import com.example.homebaker.Modular.Order;
import com.example.homebaker.Modular.Product;
import com.example.homebaker.Modular.User;
import com.example.homebaker.Repository.OrderRepository;
import com.example.homebaker.Repository.ProductRepository;
import com.example.homebaker.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            long count = 0;
            try {
                count = userRepository.count();
            } catch (Exception e) {
                System.out.println("Initializing tables in Supabase...");
            }

            if (count < 6) {
                System.out.println("Seeding 6 Homebakers, 6 Customers, 6 Products, and 6 Orders into PostgreSQL...");

                try { orderRepository.deleteAll(); } catch (Exception ignored) {}
                try { productRepository.deleteAll(); } catch (Exception ignored) {}
                try { userRepository.deleteAll(); } catch (Exception ignored) {}

                String defaultPass = passwordEncoder.encode("password123");

                // --- 6 HOMEBAKERS ---
                User b1 = saveUser("Sweet Delights Bakery (Sarah)", "sarah.baker@example.com", defaultPass, "BAKER", "Chennai", "600001", "9876543210", 13.0827, 80.2707);
                User b2 = saveUser("Heavenly Bakes (Anita)", "anita.baker@example.com", defaultPass, "BAKER", "Bangalore", "560001", "9876543211", 12.9716, 77.5946);
                User b3 = saveUser("Frosting & Flours (Meera)", "meera.baker@example.com", defaultPass, "BAKER", "Hyderabad", "500001", "9876543212", 17.3850, 78.4867);
                User b4 = saveUser("The Blue Ribbon Cakery (Priya)", "priya.baker@example.com", defaultPass, "BAKER", "Mumbai", "400001", "9876543213", 19.0760, 72.8777);
                User b5 = saveUser("Artisan Oven (Kavita)", "kavita.baker@example.com", defaultPass, "BAKER", "Delhi", "110001", "9876543214", 28.7041, 77.1025);
                User b6 = saveUser("Glaze & Crumb Studio (Rohit)", "rohit.baker@example.com", defaultPass, "BAKER", "Coimbatore", "641001", "9876543215", 11.0168, 76.9558);

                // --- 6 CUSTOMERS ---
                User c1 = saveUser("Rahul Kumar", "rahul.customer@example.com", defaultPass, "CUSTOMER", "Chennai", "600002", "9988776651", null, null);
                User c2 = saveUser("Sneha Sharma", "sneha.customer@example.com", defaultPass, "CUSTOMER", "Bangalore", "560002", "9988776652", null, null);
                User c3 = saveUser("Vikram Reddy", "vikram.customer@example.com", defaultPass, "CUSTOMER", "Hyderabad", "500002", "9988776653", null, null);
                User c4 = saveUser("Pooja Patel", "pooja.customer@example.com", defaultPass, "CUSTOMER", "Mumbai", "400002", "9988776654", null, null);
                User c5 = saveUser("Arjun Verma", "arjun.customer@example.com", defaultPass, "CUSTOMER", "Delhi", "110002", "9988776655", null, null);
                User c6 = saveUser("Divya Nair", "divya.customer@example.com", defaultPass, "CUSTOMER", "Coimbatore", "641002", "9988776656", null, null);

                // --- 6 PRODUCTS ---
                Product p1 = saveProduct(b1, "Belgian Chocolate Truffle Cake", "CAKE", 750.0, "Rich chocolate cake loaded with real Belgian chocolate ganache.", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", true, false, false, true, "Birthday", 5);
                Product p2 = saveProduct(b1, "Red Velvet Cream Cheese Cupcakes", "CUPCAKE", 350.0, "Moist red velvet cupcakes topped with smooth cream cheese frosting.", "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500", false, false, false, true, "Party", 10);
                Product p3 = saveProduct(b2, "Fudge Chocolate Brownie Box", "BROWNIE", 450.0, "Fudgy chocolate brownies made with premium cocoa and walnuts.", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", true, true, true, false, "Snack", 8);
                Product p4 = saveProduct(b3, "Blueberry Lemon Swirl Cheesecake", "CAKE", 850.0, "Creamy cheesecake swirled with fresh blueberry compote and lemon zest.", "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500", true, false, false, true, "Anniversary", 4);
                Product p5 = saveProduct(b4, "Fresh Fruit Tarts (Pack of 4)", "TART", 400.0, "Crisp pastry shells filled with vanilla custard and topped with fresh seasonal berries.", "https://images.unsplash.com/photo-1519869325930-281384150729?w=500", false, false, false, false, "High Tea", 6);
                Product p6 = saveProduct(b5, "Salted Caramel Macarons Set", "COOKIE", 500.0, "French almond macarons filled with buttery salted caramel filling.", "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500", true, true, false, false, "Gift Box", 12);

                // --- 6 ORDERS ---
                saveOrder(c1, b1, p1, "Round", "1 kg", "Belgian Chocolate", "Choco Chips & Berries", "Happy Birthday Rahul!", 750.0, 1, "2:00 PM - 4:00 PM", "2026-07-20", "DELIVERY", "CONFIRMED", "2026-07-19 10:30:00");
                saveOrder(c1, b2, p3, "Square", "Pack of 6", "Fudge Chocolate", "Walnuts", "Enjoy the treat!", 450.0, 1, "5:00 PM - 7:00 PM", "2026-07-21", "DELIVERY", "DELIVERED", "2026-07-18 16:15:00");
                saveOrder(c2, b3, p4, "Heart", "1.5 kg", "Blueberry Lemon", "Fresh Blueberries", "Happy Anniversary Sneha & Amit!", 850.0, 1, "11:00 AM - 1:00 PM", "2026-07-22", "DELIVERY", "BAKING", "2026-07-19 11:00:00");
                saveOrder(c3, b4, p5, "Round", "4 Tarts", "Vanilla Custard", "Mixed Berries", "Surprise for Vikram!", 400.0, 1, "4:00 PM - 6:00 PM", "2026-07-19", "PICKUP", "READY", "2026-07-19 09:00:00");
                saveOrder(c4, b5, p6, "Standard", "Box of 8", "Salted Caramel", "Gold Dust", "Congratulations Pooja!", 500.0, 1, "10:00 AM - 12:00 PM", "2026-07-23", "DELIVERY", "PENDING", "2026-07-19 12:45:00");
                saveOrder(c5, b1, p2, "Standard", "Box of 6", "Red Velvet", "Cream Cheese", "Party Time!", 350.0, 1, "3:00 PM - 5:00 PM", "2026-07-17", "DELIVERY", "DELIVERED", "2026-07-17 14:20:00");

                System.out.println("Successfully seeded 6 Homebakers, 6 Customers, 6 Products, and 6 Orders!");
            }
        } catch (Exception err) {
            System.err.println("DataInitializer warning: " + err.getMessage());
        }
    }

    private User saveUser(String name, String email, String password, String role, String city, String pincode, String phone, Double lat, Double lng) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setCity(city);
        user.setPincode(pincode);
        user.setPhone(phone);
        user.setLatitude(lat);
        user.setLongitude(lng);
        return userRepository.save(user);
    }

    private Product saveProduct(User baker, String name, String category, Double price, String description, String imageUrl, boolean eggless, boolean glutenFree, boolean vegan, boolean nutFree, String occasion, Integer dailySlots) {
        Product p = new Product();
        p.setBaker(baker);
        p.setName(name);
        p.setCategory(category);
        p.setPrice(price);
        p.setDescription(description);
        p.setImageUrl(imageUrl);
        p.setIsEggless(eggless);
        p.setIsGlutenFree(glutenFree);
        p.setIsVegan(vegan);
        p.setIsNutFree(nutFree);
        p.setOccasion(occasion);
        p.setDailySlots(dailySlots);
        return productRepository.save(p);
    }

    private Order saveOrder(User customer, User baker, Product product, String shape, String size, String flavor, String topping, String message, Double price, Integer qty, String slot, String delivDate, String delivType, String status, String orderDate) {
        Order o = new Order();
        o.setCustomer(customer);
        o.setBaker(baker);
        o.setProduct(product);
        o.setCakeShape(shape);
        o.setCakeSize(size);
        o.setCakeFlavor(flavor);
        o.setCakeTopping(topping);
        o.setCakeMessage(message);
        o.setFinalPrice(price);
        o.setQuantity(qty);
        o.setDeliveryTimeSlot(slot);
        o.setDeliveryDate(delivDate);
        o.setDeliveryType(delivType);
        o.setStatus(status);
        o.setOrderDate(orderDate);
        return orderRepository.save(o);
    }
}
