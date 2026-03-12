package com.apartmentmanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "buildings")
@Getter
@Setter
public class Building extends BaseEntity { // Chưa xong

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "num_floors", nullable = false)
    private Integer numFloors = 1;

    @Column(name = "num_apartments", nullable = false)
    private Integer numApartents = 0;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
