package com.example.homebaker.Modular;

import jakarta.persistence.*;

@Entity
@Table(name = "slots")
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "baker_id", nullable = false)
    private User baker;

    @Column(nullable = false)
    private String date; // YYYY-MM-DD format

    @Column(nullable = false)
    private Integer totalSlots;

    @Column(nullable = false)
    private Integer filledSlots;

    // Constructors
    public Slot() {
    }

    public Slot(Long id, User baker, String date, Integer totalSlots, Integer filledSlots) {
        this.id = id;
        this.baker = baker;
        this.date = date;
        this.totalSlots = totalSlots;
        this.filledSlots = filledSlots;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getTotalSlots() {
        return totalSlots;
    }

    public void setTotalSlots(Integer totalSlots) {
        this.totalSlots = totalSlots;
    }

    public Integer getFilledSlots() {
        return filledSlots;
    }

    public void setFilledSlots(Integer filledSlots) {
        this.filledSlots = filledSlots;
    }
}
